import { DemoBanner } from "./DemoBanner";
import { MobileBookBar } from "./MobileBookBar";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <DemoBanner />
      <SiteNav />
      <main className="pt-[4.75rem] md:pt-24">{children}</main>
      <SiteFooter />
      <MobileBookBar />
    </div>
  );
}
