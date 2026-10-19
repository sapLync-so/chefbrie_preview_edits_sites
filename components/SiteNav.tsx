"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { headerNavLinks, resolveNavHref } from "@/lib/site-nav";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const homeAnchor = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5" aria-label="Main">
        <Link
          href="/"
          className="font-sans text-sm font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:text-gold-bright"
        >
          Chef Brie
        </Link>

        <div className="hidden items-center gap-7 font-sans text-[11px] uppercase tracking-[0.18em] text-ink/65 md:flex">
          {headerNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.homeAnchor ? homeAnchor(link.href.replace("/#", "#")) : link.href}
              className="whitespace-nowrap transition-colors hover:text-gold focus-visible:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <Link href="/demo/book">Book</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Site navigation links</SheetDescription>
              <div className="mt-10 flex flex-col gap-5 font-sans text-sm uppercase tracking-[0.2em] text-ink/80">
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={resolveNavHref(link, pathname)}
                    className="border-b border-border pb-3 transition-colors hover:text-gold"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-4 w-full">
                  <Link href="/demo/book" onClick={() => setOpen(false)}>
                    Book an experience
                  </Link>
                </Button>
                <Link
                  href="/menu"
                  className="text-center text-xs normal-case tracking-normal text-ink/50 underline-offset-2 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View full menu
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
