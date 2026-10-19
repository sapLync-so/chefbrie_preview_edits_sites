# Chef Brie — Demo site revamp notes

**Branch:** `cursor/chef-brie-revamp-demo-0d88` (demo only — do not merge)  
**Base:** `cursor/chef-brie-menus-services-824f`

This document lists what changed in the visual/UX concept versus the current production-style site on the base branch, with before/after notes and a short adoption list for Chef Brie and SapLync.

---

## Design system

| Area | Before | After (demo) |
|------|--------|----------------|
| Typography | System Georgia + system UI stack | **Cormorant Garamond** (display) + **DM Sans** (UI) via `next/font`, clearer type scale (`text-hero`, section spacing tokens) |
| Color | Hard-coded hex in components | **CSS design tokens** in `app/globals.css` mapped in `tailwind.config.ts` (bg, ink, gold, cream surfaces) |
| Components | Ad-hoc button/link classes | Shared **Button**, **Badge**, **Sheet** (Radix Dialog) primitives under `components/ui/` |
| Motion | Minimal CSS transitions | **Framer Motion** `Reveal` on scroll; **`prefers-reduced-motion`** honored in CSS and carousel auto-advance |
| Icons | Text/unicode glyphs | **Lucide** icons in nav and carousel |

---

## Global chrome

| Area | Before | After (demo) |
|------|--------|----------------|
| Demo clarity | No demo indicator | **Demo banner** on all main pages + explicit labels on booking flow |
| Mobile nav | Dropdown panel under header | **Right-side sheet/drawer** with focus trap (Radix) |
| Mobile CTA | Book only in header (hidden on small screens in some cases) | **Sticky bottom “Book an experience”** bar on mobile (`MobileBookBar`) |
| Footer | Contact line + social | Same real contact info + **“Powered by SapLync”** → https://saplync.com |

---

## Home page (`app/page.tsx`)

| Area | Before | After (demo) |
|------|--------|----------------|
| Hero | Static portrait image | **Full-viewport video** (existing supper club reel) with gradient overlay and dual CTAs |
| Services | Text-only cards | **Image-led cards** with real gallery assets, hover scale (motion-safe) |
| Social proof | Stats band only | **“Love From Our Guests”** — all **9 genuine messages** from live site (`data/testimonials.ts`), chat-style cards + disclaimer |
| Gallery | Inline carousel | **`HomeGallery`** — prev/next, frame counter, thumbnail strip (9 images) |
| Menu discovery | Link at bottom of services | **Featured weekly meal prep** block using first week from `data/menus.ts` with price chips |
| Booking | Anchor to `#contact` only | Prominent **demo booking** CTA + contact section retained |
| Imagery | `<img>` tags | **`next/image`** for gallery and about sections |
| Gallery | Custom carousel | Refined gallery with thumbnail strip and `next/image` |

---

## Menu (`app/menu/page.tsx` + `MenuExperience`)

| Area | Before | After (demo) |
|------|--------|----------------|
| Layout | Two long stacked sections | **Tabs:** Meal prep vs catering |
| Catering browse | All sections visible at once | **Category filter chips** (Appetizer, Entrees, etc.) |
| Dietary info | Inline in item names | **Parsed tags** (V, GFO) as badges + cleaned names |
| Prices | Plain text | **Price chips** (badges) on meal prep and catering items |
| CTAs | Contact query links | Demo booking links labeled **“(demo)”** |

All menu copy, prices, and pickup details remain sourced from `data/menus.ts`.

---

## Supper Club (`app/services/supper-club/page.tsx`)

| Area | Before | After (demo) |
|------|--------|----------------|
| Hero | Video + text | Stronger **vignette/radial overlay**, demo waitlist CTA |
| Carousel | Standard aspect ratio | **Cinematic widescreen** (`cinematic` prop), caption from slide alt, filmstrip dots |
| Copy | Unchanged substance | Same real copy; added intro line for gallery behavior |

Carousel component retained and enhanced in `components/ImageCarousel.tsx`.

---

## Demo booking (`app/demo/book/page.tsx`)

| Area | Before | After (demo) |
|------|--------|----------------|
| Flow | Contact form only (live API) | **3-step UI:** service + date → meal/week selection (meal prep) → summary |
| Backend | `/api/chef-brie-contact` | **No submission** — labeled **“Demo — not connected”** throughout |
| Meal data | N/A | Uses real `mealPrepMenu.weeks` for selectable weeks and demo subtotal |

---

## Accessibility & performance

| Area | Before | After (demo) |
|------|--------|----------------|
| Focus | Browser default only | **`:focus-visible`** ring using gold token; Radix sheet focus management |
| Contrast | Generally dark/gold | Cream menu surfaces retain **dark-on-cream** text; badges tested for legibility |
| Motion | Autoplay video/carousel | Carousel auto-advance **disabled when `prefers-reduced-motion: reduce`** |
| Images | Mixed `<img>` / some `Image` | Broader **`next/image`** usage with `sizes` hints |
| Video | Autoplay hero | `playsInline`, `muted`, poster frames; meaningful `aria-label` on home hero |

---

## Recommended to adopt (production)

1. **Design tokens + font pairing** — Low risk; improves consistency without changing content.
2. **Mobile sheet nav + sticky Book CTA** — High impact for conversion on phones.
3. **Menu filters and dietary badges** — Helps catering guests scan menus; data already in item names.
4. **Featured week on home** — Surfaces meal prep without opening full menu.
5. **Testimonials section** — Already uses live copy; optional “read more” for extended message archive.
6. **Demo booking → real flow** — Wire step 3 to existing contact API or a form backend; do not ship demo labels.
7. **“Powered by SapLync”** — Add to production footer if desired by brand agreement.

---

## Explicitly not changed (demo scope)

- Live contact API route and form behavior on `/#contact`
- Menu data, prices, emails, phone numbers (real values preserved)
- No fabricated reviews or client names
