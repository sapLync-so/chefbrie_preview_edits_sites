# Menu data

Weekly meal prep and catering menus live in **`menus.ts`**. Update that file when Brie rotates menus — no layout or page code changes are required.

## Weekly meal prep

Edit the `mealPrepMenu.weeks` array. Each week needs:

- `id` — stable slug, e.g. `"rotation-1"` (menus are weekly rotations, not calendar dates)
- `breakfast.name` and `breakfast.price` (number, dollars per meal)
- `dinner.name` and `dinner.price`

Pickup days and contact info are in `mealPrepMenu.pickup`.

## Catering menu

Edit `cateringMenu.sections`. Each section has `title` and `items` with:

- `name` — dish name (include `(V)` / `(V, GFO)` tags as shown on the printed menu)
- `price` — e.g. `"$4pp"` or `"Custom Pricing"`; leave `""` for sides listed under the section price
- optional `note` — variants, descriptions, or add-ons

Update `cateringMenu.legend` and `cateringMenu.customItemsNote` if those lines change.

## After editing

Run `npm run build` locally to confirm TypeScript is valid, then deploy as usual.
