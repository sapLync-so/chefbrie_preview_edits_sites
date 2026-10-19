import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-gold/40 bg-gold/10 text-gold",
        price: "border-ink-cream/20 bg-ink-cream/5 text-ink-cream font-semibold",
        dietary: "border-emerald-700/40 bg-emerald-950/30 text-emerald-200",
        placeholder: "border-dashed border-ink/25 bg-bg-elevated text-ink-subtle italic normal-case tracking-normal text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
