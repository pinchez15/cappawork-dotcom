"use client";

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
    const [hasSignature, setHasSignature] = useState(false);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

    function getCtx() {
      return canvasRef.current?.getContext("2d") ?? null;
    }

    function getPoint(e: React.MouseEvent | React.TouchEvent) {
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
    }

    function handleDown(e: React.MouseEvent | React.TouchEvent) {
      isDrawing.current = true;
      lastPoint.current = getPoint(e);
    }

    function handleMove(e: React.MouseEvent | React.TouchEvent) {
      if (!isDrawing.current) return;
      e.preventDefault();
      const ctx = getCtx();
      const point = getPoint(e);
      if (!ctx || !point) return;

      if (lastPoint.current) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        setHasSignature(true);
      }
      lastPoint.current = point;
    }

    function handleUp() {
      isDrawing.current = false;
      lastPoint.current = null;
    }

    function clear() {
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      isDrawing.current = false;
      lastPoint.current = null;
    }

    // Setup canvas resolution
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    }, []);

    useImperativeHandle(ref, () => ({
      isEmpty: () => !hasSignature,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") || "",
      clear,
    }));

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {hasSignature ? (
              <span className="text-green-600">Signature captured</span>
            ) : (
              <span className="text-stone-500">Draw your signature below</span>
            )}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
        <div className="border-2 rounded-lg bg-white touch-none border-stone-200">
          <canvas
            ref={canvasRef}
            className="w-full h-40 cursor-crosshair"
            style={{ width: "100%", height: "160px" }}
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onMouseLeave={handleUp}
            onTouchStart={handleDown}
            onTouchMove={handleMove}
            onTouchEnd={handleUp}
          />
        </div>
        <p className="text-xs text-stone-400">
          Click and drag to sign
        </p>
      </div>
    );
  }
);
