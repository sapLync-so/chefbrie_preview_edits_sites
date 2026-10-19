export type DietaryTag = "V" | "GFO";

const TAG_PATTERN = /\(([^)]+)\)/;

export function extractDietaryTags(name: string): { cleanName: string; tags: DietaryTag[] } {
  const match = name.match(TAG_PATTERN);
  if (!match) return { cleanName: name.trim(), tags: [] };

  const raw = match[1];
  const tags: DietaryTag[] = [];
  if (/\bV\b/.test(raw)) tags.push("V");
  if (/GFO/.test(raw)) tags.push("GFO");

  const cleanName = name.replace(TAG_PATTERN, "").replace(/\s+/g, " ").trim();
  return { cleanName, tags };
}

export function formatMealPrepPrice(price: number) {
  return `$${price}`;
}
