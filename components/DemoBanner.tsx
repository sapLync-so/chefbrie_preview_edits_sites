import Link from "next/link";

export function DemoBanner() {
  return (
    <div
      role="status"
      className="relative z-[55] border-b border-gold/30 bg-gold/10 px-4 py-2 text-center font-sans text-xs text-ink/90"
    >
      <span className="font-semibold uppercase tracking-[0.15em] text-gold">Demo concept</span>
      <span className="mx-2 hidden sm:inline">·</span>
      <span className="block sm:inline">Visual & UX revamp preview — not connected to live booking.</span>{" "}
      <Link href="/demo/book" className="ml-1 underline decoration-gold/60 underline-offset-2 hover:text-gold">
        Try demo flow
      </Link>
    </div>
  );
}
