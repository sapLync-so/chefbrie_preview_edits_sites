"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Sheet({ ...props }: Dialog.DialogProps) {
  return <Dialog.Root {...props} />;
}

export function SheetTrigger(props: Dialog.DialogTriggerProps) {
  return <Dialog.Trigger {...props} />;
}

export function SheetClose(props: Dialog.DialogCloseProps) {
  return <Dialog.Close {...props} />;
}

export function SheetPortal(props: Dialog.DialogPortalProps) {
  return <Dialog.Portal {...props} />;
}

export function SheetOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: "right" | "left" }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        className={cn(
          "fixed z-[70] flex h-full w-[min(100vw,22rem)] flex-col border-l border-border bg-bg-elevated p-6 shadow-soft outline-none",
          side === "right" ? "right-0 top-0" : "left-0 top-0",
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close
          className="absolute right-4 top-4 rounded-md p-2 text-ink/60 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold-bright"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" aria-hidden />
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  );
}

export function SheetTitle(props: React.ComponentPropsWithoutRef<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("font-sans text-sm uppercase tracking-[0.25em] text-gold", props.className)} {...props} />;
}

export function SheetDescription(props: React.ComponentPropsWithoutRef<typeof Dialog.Description>) {
  return <Dialog.Description className={cn("sr-only", props.className)} {...props} />;
}
