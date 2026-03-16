"use client";

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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

      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
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

    const handleMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isCapturing) return;
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

    const stopCapture = useCallback(() => {
      if (isCapturing) {
        setIsCapturing(false);
        lastPoint.current = null;
      }
    }, [isCapturing]);

    const startCapture = useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (isCapturing) {
          stopCapture();
          return;
        }
        setIsCapturing(true);
        lastPoint.current = getPoint(e);
      },
      [isCapturing, stopCapture, getPoint]
    );

    // Keyboard listener to stop capture
    useEffect(() => {
      if (!isCapturing) return;

      const handleKey = (e: KeyboardEvent) => {
        e.preventDefault();
        stopCapture();
      };

      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [isCapturing, stopCapture]);

    // Mouse/touch listeners
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("touchmove", handleMove, { passive: false });
      canvas.addEventListener("mouseup", stopCapture);
      canvas.addEventListener("touchend", stopCapture);
      canvas.addEventListener("mouseleave", stopCapture);

      return () => {
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("mouseup", stopCapture);
        canvas.removeEventListener("touchend", stopCapture);
        canvas.removeEventListener("mouseleave", stopCapture);
      };
    }, [handleMove, stopCapture]);

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
                Drawing... press any key or click to finish
              </span>
            ) : hasSignature ? (
              <span className="text-green-600">Signature captured</span>
            ) : (
              <span className="text-stone-500">Click the box to start signing</span>
            )}
          </div>
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
            onMouseDown={(e) => startCapture(e.nativeEvent)}
            onTouchStart={(e) => startCapture(e.nativeEvent)}
          />
        </div>
        <p className="text-xs text-stone-400">
          Click to start drawing, move your mouse or finger to sign, then press
          any key or click again to finish
        </p>
      </div>
    );
  }
);
