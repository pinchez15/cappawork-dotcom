"use client";

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check } from "lucide-react";

export interface SignaturePadRef {
  isEmpty: () => boolean;
  toDataURL: () => string;
  clear: () => void;
}

interface SignaturePadProps {
  penColor?: string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  function SignaturePad({ penColor = "#1c1917" }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const liftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipCount = useRef(0);

    const getCtx = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.getContext("2d");
    }, []);

    const getPoint = useCallback((e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      if ("clientX" in e) {
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      }
      return null;
    }, []);

    const drawLine = useCallback(
      (from: { x: number; y: number }, to: { x: number; y: number }) => {
        const ctx = getCtx();
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      },
      [getCtx, penColor]
    );

    const finishCapture = useCallback(() => {
      setIsCapturing(false);
      lastPoint.current = null;
      skipCount.current = 0;
      if (liftTimer.current) clearTimeout(liftTimer.current);
    }, []);

    // Click starts capture session; once capturing, movement alone draws
    const handlePointerDown = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isCapturing) {
          setIsCapturing(true);
        }
        if (liftTimer.current) clearTimeout(liftTimer.current);
        lastPoint.current = getPoint(e);
      },
      [isCapturing, getPoint]
    );

    const handleMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isCapturing) return;
        e.preventDefault();
        const point = getPoint(e);
        if (!point) return;

        // Reset the lift timer — finger is still moving
        if (liftTimer.current) clearTimeout(liftTimer.current);
        liftTimer.current = setTimeout(() => {
          // No movement for 150ms = finger lifted off trackpad.
          // Null the last point AND skip the next few move events so
          // the cursor can travel to its new position before we start
          // a new stroke (trackpads are relative, not absolute).
          lastPoint.current = null;
          skipCount.current = 3;
        }, 150);

        // After a lift, skip a few events to let cursor relocate
        if (skipCount.current > 0) {
          skipCount.current--;
          lastPoint.current = null;
          return;
        }

        if (lastPoint.current) {
          drawLine(lastPoint.current, point);
          setHasSignature(true);
        }
        lastPoint.current = point;
      },
      [isCapturing, getPoint, drawLine]
    );

    // Keyboard listener — any key finishes the capture session
    useEffect(() => {
      if (!isCapturing) return;

      const handleKey = (e: KeyboardEvent) => {
        e.preventDefault();
        finishCapture();
      };

      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [isCapturing, finishCapture]);

    // Touch end — reset lastPoint so next touch starts a new stroke
    const handleTouchEnd = useCallback(() => {
      lastPoint.current = null;
    }, []);

    // Canvas event listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.addEventListener("mousedown", handlePointerDown);
      canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("touchmove", handleMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);

      return () => {
        canvas.removeEventListener("mousedown", handlePointerDown);
        canvas.removeEventListener("touchstart", handlePointerDown);
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      };
    }, [handlePointerDown, handleMove, handleTouchEnd]);

    // Setup canvas resolution
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    }, []);

    function clear() {
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      setIsCapturing(false);
      lastPoint.current = null;
      skipCount.current = 0;
      if (liftTimer.current) clearTimeout(liftTimer.current);
    }

    useImperativeHandle(ref, () => ({
      isEmpty: () => !hasSignature,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") || "",
      clear,
    }));

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {isCapturing ? (
              <span className="text-blue-600">
                Signing... press any key or click Done when finished
              </span>
            ) : hasSignature ? (
              <span className="text-green-600">Signature captured</span>
            ) : (
              <span className="text-stone-500">Click the box to start signing</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {isCapturing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200"
                onClick={finishCapture}
              >
                <Check className="h-3 w-3 mr-1" />
                Done
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <div
          className={`border-2 rounded-lg bg-white touch-none transition-colors ${
            isCapturing
              ? "border-blue-400 shadow-sm"
              : "border-stone-200"
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-40 cursor-crosshair"
            style={{ width: "100%", height: "160px" }}
          />
        </div>
        <p className="text-xs text-stone-400">
          Click to start, draw your signature (you can lift and continue),
          then press any key or click Done to finish
        </p>
      </div>
    );
  }
);
