import type { Metadata } from "next";

/** Production site — canonical targets for this preview deployment. */
export const PRODUCTION_SITE_URL = "https://chefbrie.llc";

/** Block indexing of preview/staging; point canonicals at production. */
export const previewRobotsMetadata: Pick<Metadata, "robots"> = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export function productionCanonical(path: string): Pick<Metadata, "alternates"> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return {
    alternates: {
      canonical: normalized,
    },
  };
}
