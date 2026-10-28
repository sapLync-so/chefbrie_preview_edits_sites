"use client";

import Image from "next/image";
import { HeroVideo } from "@/components/HeroVideo";

const POSTER = "/videos/supper-club-poster.jpg";

/**
 * Poster uses next/image (AVIF/WebP + responsive srcset). Video plays on top when supported.
 * Source poster is 406×720 — see SETUP.md / deploy notes for recommended master resolution.
 */
export function HeroMedia() {
  return (
    <div className="absolute inset-0">
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover object-center"
      />
      <HeroVideo className="absolute inset-0 h-full w-full object-cover object-center" poster={POSTER} />
    </div>
  );
}
