"use client";

import { Reveal } from "@/components/motion/Reveal";
import { guestTestimonials, testimonialsDisclaimer } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const reactionEmojis = ["💙", "💕", "🔥", "🙌🏾", "😍"];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof guestTestimonials)[number];
  index: number;
}) {
  const isOutgoing = testimonial.tone === "outgoing";

  return (
    <article className="relative rounded-xl border border-border bg-bg-elevated p-5 shadow-glow">
      <span
        className="absolute -right-1 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#0f6fff] text-base shadow-soft"
        aria-hidden
      >
        {reactionEmojis[index % reactionEmojis.length]}
      </span>
      {testimonial.label ? (
        <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.18em] text-gold/85">{testimonial.label}</p>
      ) : null}
      <div
        className={cn(
          "relative max-w-[95%] rounded-2xl px-4 py-3.5 font-sans text-sm leading-relaxed shadow-soft",
          isOutgoing
            ? "ml-auto rounded-br-sm bg-[#0877ff] text-white"
            : "rounded-bl-sm bg-[#252525] text-ink"
        )}
      >
        {testimonial.message}
      </div>
    </article>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative scroll-mt-28 overflow-hidden px-5 py-section" aria-labelledby="testimonials-heading">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgb(var(--color-gold)) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <p className="font-serif text-xl italic text-gold">Real words. Real love.</p>
          <h2 id="testimonials-heading" className="mt-3 text-4xl font-light md:text-5xl">
            Love From Our Guests
          </h2>
          <div className="mx-auto my-6 flex max-w-[180px] items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-gold/50" />
            <span className="text-gold">♥</span>
            <span className="h-px flex-1 bg-gold/50" />
          </div>
          <p className="font-sans text-sm leading-relaxed text-ink/65 md:text-base">
            Heartfelt messages from guests who experienced Chef Brie&apos;s food, hospitality, and unforgettable
            gatherings.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guestTestimonials.map((testimonial, index) => (
            <Reveal key={testimonial.message} delay={index * 0.04}>
              <TestimonialCard testimonial={testimonial} index={index} />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center font-sans text-xs leading-relaxed text-ink/40">
          {testimonialsDisclaimer}
        </p>
      </div>
    </section>
  );
}
