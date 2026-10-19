"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GallerySlide } from "@/data/gallery";
import { cn } from "@/lib/utils";

type ImageCarouselProps = {
  slides: GallerySlide[];
  autoAdvanceMs?: number;
  ariaLabel?: string;
  cinematic?: boolean;
};

export function ImageCarousel({
  slides,
  autoAdvanceMs = 5000,
  ariaLabel = "Image slideshow",
  cinematic = false,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1 || autoAdvanceMs <= 0 || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [paused, count, autoAdvanceMs, reduceMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (count === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const aspect = cinematic ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-[4/3] md:aspect-[16/10]";
  const transitionMs = reduceMotion ? 0 : cinematic ? 900 : 500;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-bg-elevated shadow-soft touch-pan-y",
          cinematic && "rounded-lg ring-1 ring-gold/10"
        )}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={cn("relative w-full", aspect)}>
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={cn(
                "absolute inset-0",
                i === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              )}
              style={{ transition: `opacity ${transitionMs}ms ease` }}
              aria-hidden={i !== index}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className={cn(
                  "object-cover",
                  cinematic && i === index && !reduceMotion && "motion-safe:scale-[1.02] motion-safe:duration-[9000ms]"
                )}
                style={{ objectPosition: slide.objectPosition ?? "center" }}
                priority={i === 0}
              />
              {cinematic && (
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => {
                setPaused(true);
                goPrev();
              }}
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-bg/75 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => {
                setPaused(true);
                goNext();
              }}
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-bg/75 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg/85 to-transparent px-5 py-5">
              <div className="flex items-end justify-between gap-4">
                <p className="max-w-[70%] font-sans text-sm text-ink/75">{slides[index]?.alt}</p>
                <p className="font-sans text-sm tabular-nums text-ink/60">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Go to slide ${i + 1}: ${slide.alt}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => {
                      setPaused(true);
                      goTo(i);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-8 bg-gold" : "w-2.5 bg-white/35 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
