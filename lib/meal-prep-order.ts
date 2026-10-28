export const MEAL_PREP_MIN_ORDER = 75;
export const NJ_SALES_TAX_RATE = 0.066;

export function mealPrepSalesTax(subtotal: number): number {
  return Math.round(subtotal * NJ_SALES_TAX_RATE * 100) / 100;
}

export function mealPrepEstimatedTotal(subtotal: number): number {
  return Math.round((subtotal + mealPrepSalesTax(subtotal)) * 100) / 100;
}

export type MealPrepServiceKey = "breakfast" | "dinner";

export function serviceSubtotal(
  quantities: Record<string, number>,
  weeks: { id: string; breakfast: { price: number }; dinner: { price: number } }[],
  service: MealPrepServiceKey
): number {
  return weeks.reduce((sum, w) => {
    const qty = quantities[w.id] ?? 0;
    if (qty <= 0) return sum;
    const price = service === "breakfast" ? w.breakfast.price : w.dinner.price;
    return sum + qty * price;
  }, 0);
}

export function totalMealQuantity(quantities: Record<string, number>): number {
  return Object.values(quantities).reduce((sum, q) => sum + (q > 0 ? q : 0), 0);
}

export function meetsOrderMinimum(subtotal: number): boolean {
  return subtotal >= MEAL_PREP_MIN_ORDER;
}

export function minimumOrderMessage(subtotal: number): string {
  const remaining = Math.max(0, MEAL_PREP_MIN_ORDER - subtotal);
  return `Orders require a $${MEAL_PREP_MIN_ORDER} minimum. Add ${formatUsd(remaining)} more.`;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
