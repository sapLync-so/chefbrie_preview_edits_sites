/** Format meal prep order lines for email, Notion, and mailto. */

export type MealPrepWeekSelection = {
  rotationLabel: string;
  breakfast?: string;
  dinner?: string;
  breakfastPrice?: number;
  dinnerPrice?: number;
  breakfastQuantity?: number;
  dinnerQuantity?: number;
};

export function mealLineQuantity(qty: number | undefined): number {
  return qty != null && qty > 0 ? qty : 1;
}

export function mealLineUnitTotal(price: number | undefined, qty: number | undefined): number {
  if (price == null) return 0;
  return price * mealLineQuantity(qty);
}

export function formatMealPrepWeekParts(w: MealPrepWeekSelection): string[] {
  const parts: string[] = [];
  if (w.breakfast != null) {
    const q = mealLineQuantity(w.breakfastQuantity);
    const total = mealLineUnitTotal(w.breakfastPrice, w.breakfastQuantity);
    parts.push(`${q} × ${w.breakfast} (Breakfast) — $${total.toFixed(2)}`);
  }
  if (w.dinner != null) {
    const q = mealLineQuantity(w.dinnerQuantity);
    const total = mealLineUnitTotal(w.dinnerPrice, w.dinnerQuantity);
    parts.push(`${q} × ${w.dinner} (Dinner) — $${total.toFixed(2)}`);
  }
  return parts;
}

export function mealPrepWeekLineTotal(w: MealPrepWeekSelection): number {
  return (
    mealLineUnitTotal(w.breakfastPrice, w.breakfastQuantity) +
    mealLineUnitTotal(w.dinnerPrice, w.dinnerQuantity)
  );
}

export function computeSubtotalFromWeeks(weeks: MealPrepWeekSelection[]): number {
  return weeks.reduce((sum, w) => sum + mealPrepWeekLineTotal(w), 0);
}
