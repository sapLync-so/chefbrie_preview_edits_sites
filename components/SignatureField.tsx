"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignatureFieldProps = {
  value: string;
  onChange: (dataUrl: string) => void;
  className?: string;
};

export function SignatureField({ value, onChange, className }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedSignature, setTypedSignature] = useState("");

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = "rgb(245, 240, 232)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);
    return () => window.removeEventListener("resize", syncCanvasSize);
  }, [syncCanvasSize]);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    const dpr = window.devicePixelRatio || 1;
    const imageData = ctx.getImageData(0, 0, width, height);
    const hasInk = imageData.data.some((channel, i) => i % 4 === 3 && channel > 0);
    onChange(hasInk ? canvas.toDataURL("image/png") : "");
  }, [onChange]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "draw") return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || mode !== "draw") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointerPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    exportCanvas();
  };

  useEffect(() => {
    if (mode === "type" && typedSignature.trim()) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      syncCanvasSize();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgb(245, 240, 232)";
      ctx.font = "italic 28px Georgia, serif";
      ctx.textBaseline = "middle";
      ctx.fillText(typedSignature.trim(), 16, rect.height / 2);
      onChange(canvas.toDataURL("image/png"));
    } else if (mode === "type" && !typedSignature.trim()) {
      clearCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- typed mode redraws canvas only
  }, [mode, typedSignature]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider",
            mode === "draw" ? "border-gold bg-gold/15 text-gold" : "border-border text-ink/55"
          )}
        >
          Draw signature
        </button>
        <button
          type="button"
          onClick={() => setMode("type")}
          className={cn(
            "rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider",
            mode === "type" ? "border-gold bg-gold/15 text-gold" : "border-border text-ink/55"
          )}
        >
          Type signature
        </button>
      </div>
      {mode === "type" && (
        <input
          type="text"
          value={typedSignature}
          onChange={(e) => setTypedSignature(e.target.value)}
          placeholder="Type your full name"
          className="w-full rounded-md border border-border bg-bg px-4 py-3 font-serif text-lg italic text-ink focus-visible:ring-2 focus-visible:ring-gold-bright"
          autoComplete="name"
        />
      )}
      <div className="relative overflow-hidden rounded-md border border-border bg-bg">
        <canvas
          ref={canvasRef}
          className={cn("h-32 w-full touch-none", mode === "type" && "pointer-events-none opacity-80")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          aria-label="Signature pad"
        />
        {!value && mode === "draw" && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-xs text-ink/35">
            Sign with your finger or mouse
          </p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
        Clear signature
      </Button>
    </div>
  );
}
