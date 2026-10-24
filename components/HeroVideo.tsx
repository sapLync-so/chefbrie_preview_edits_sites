"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  className?: string;
  poster?: string;
  src?: string;
  ariaLabel?: string;
};

export function HeroVideo({
  className,
  poster = "/videos/supper-club-poster.jpg",
  src = "/videos/supper-club-reel.mp4",
  ariaLabel = "Supper club atmosphere reel",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Autoplay blocked until interaction — handled below */
        });
      }
    };

    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    const unlockOnInteraction = () => {
      tryPlay();
      document.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("click", unlockOnInteraction);
    };

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("touchstart", unlockOnInteraction, { passive: true });
    document.addEventListener("click", unlockOnInteraction);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("touchstart", unlockOnInteraction);
      document.removeEventListener("click", unlockOnInteraction);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload="auto"
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
