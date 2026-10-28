import { Badge } from "@/components/ui/badge";

const ZELLE_EMAIL = "chefbrie.01@gmail.com";

export function PaymentZelle({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-3" : "space-y-4 rounded-md border border-gold/35 bg-gold/10 p-5"}>
      {!compact && (
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Payment — Zelle (preferred)</p>
      )}
      <p className="font-sans text-sm leading-relaxed text-ink/75">
        Send payment to Zelle:{" "}
        <a href={`mailto:${ZELLE_EMAIL}`} className="text-gold underline-offset-2 hover:underline">
          {ZELLE_EMAIL}
        </a>
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-md border border-dashed border-gold/40 bg-bg font-sans text-[10px] uppercase tracking-wider text-ink/45"
          aria-hidden
        >
          Zelle QR
          <span className="sr-only">Placeholder for Zelle QR code</span>
        </div>
        <div className="space-y-2 font-sans text-xs text-ink/55">
          <Badge variant="placeholder">Primary payment method</Badge>
          <p>
            <a
              href="https://www.zellepay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-2 hover:underline"
            >
              Open Zelle
            </a>{" "}
            in your banking app and send to the email above.
          </p>
        </div>
      </div>
    </div>
  );
}

export { ZELLE_EMAIL };
