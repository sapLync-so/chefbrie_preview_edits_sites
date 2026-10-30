import { previewRobotsMetadata, productionCanonical } from "@/lib/preview-seo";
import type { Metadata } from "next";

/** Preview-only booking demo — canonical points at production home (no matching route on chefbrie.llc). */
export const metadata: Metadata = {
  ...previewRobotsMetadata,
  ...productionCanonical("/"),
  title: "Book (Preview) | Chef Brie",
};

export default function DemoBookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
