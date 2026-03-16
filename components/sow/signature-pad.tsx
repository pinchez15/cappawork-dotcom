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
    const isPenDown = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

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
      isPenDown.current = false;
      lastPoint.current = null;
    }, []);

    // Mouse/touch handlers
    const handlePointerDown = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isCapturing) {
          // First click starts the capture session
          setIsCapturing(true);
        }
        isPenDown.current = true;
        lastPoint.current = getPoint(e);
      },
      [isCapturing, getPoint]
    );

    const handlePointerUp = useCallback(() => {
      // Lift finger/mouse — stop drawing but stay in capture mode
      isPenDown.current = false;
      lastPoint.current = null;
    }, []);

    const handleMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isCapturing || !isPenDown.current) return;
        e.preventDefault();
        const point = getPoint(e);
        if (!point) return;

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

    // Canvas event listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.addEventListener("mousedown", handlePointerDown);
      canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("touchmove", handleMove, { passive: false });
      canvas.addEventListener("mouseup", handlePointerUp);
      canvas.addEventListener("touchend", handlePointerUp);

      return () => {
        canvas.removeEventListener("mousedown", handlePointerDown);
        canvas.removeEventListener("touchstart", handlePointerDown);
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("mouseup", handlePointerUp);
        canvas.removeEventListener("touchend", handlePointerUp);
      };
    }, [handlePointerDown, handleMove, handlePointerUp]);

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
      isPenDown.current = false;
      lastPoint.current = null;
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
