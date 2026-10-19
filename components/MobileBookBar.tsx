"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MobileBookBar() {
  const pathname = usePathname();
  const bookHref = pathname === "/" ? "/demo/book" : "/demo/book";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg/95 p-3 backdrop-blur-md md:hidden"
      aria-label="Quick booking"
    >
      <Button asChild className="w-full" size="lg">
        <Link href={bookHref}>Book an experience</Link>
      </Button>
    </div>
  );
}
