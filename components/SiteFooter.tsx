"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNavLinks, resolveNavHref } from "@/lib/site-nav";

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-border bg-bg px-6 pb-24 pt-12 md:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-sans text-xs uppercase tracking-[0.18em] text-ink/40"
        >
          {footerNavLinks.map((link) => (
            <Link
              key={link.label}
              href={resolveNavHref(link, pathname)}
              className="transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/demo/book" className="transition-colors hover:text-gold">
            Demo booking
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link
            href="/"
            className="font-sans text-sm uppercase tracking-[0.28em] text-gold transition-colors hover:text-gold-bright"
          >
            Chef Brie
          </Link>
          <p className="text-center font-sans text-xs text-ink/30">
            New Jersey & Pennsylvania · chefbrie.01@gmail.com · 609-213-4778
          </p>
          <div className="flex gap-5">
            <a
              href="https://instagram.com/bellavita_015"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-[0.18em] text-ink/35 transition-colors hover:text-gold"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@chef.brie8"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-[0.18em] text-ink/35 transition-colors hover:text-gold"
            >
              TikTok
            </a>
          </div>
        </div>
        <p className="text-center font-sans text-xs text-ink/25">
          <a
            href="https://saplync.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            Powered by SapLync
          </a>
        </p>
      </div>
    </footer>
  );
}
