import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ServiceValue } from "@/lib/booking";

type ServiceCtaProps = {
  service: ServiceValue;
  primaryLabel?: string;
  menuHref?: string;
};

export function ServiceCta({
  service,
  primaryLabel = "Book Now",
  menuHref,
}: ServiceCtaProps) {
  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Button asChild>
        <Link href={`/?service=${service}#contact`}>{primaryLabel}</Link>
      </Button>
      {menuHref && (
        <Button asChild variant="outline">
          <Link href={menuHref}>View Menu</Link>
        </Button>
      )}
    </div>
  );
}
