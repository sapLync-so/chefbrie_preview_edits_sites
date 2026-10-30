import { MenuExperience } from "@/components/MenuExperience";
import { PageShell } from "@/components/PageShell";
import { previewRobotsMetadata, productionCanonical } from "@/lib/preview-seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...previewRobotsMetadata,
  ...productionCanonical("/menu"),
  title: "Menu | Chef Brie",
  description: "Weekly meal prep menus and catering menu — Chef Brie, Langhorne PA & Princeton NJ.",
};

export default function MenuPage() {
  return (
    <PageShell>
      <MenuExperience />
    </PageShell>
  );
}
