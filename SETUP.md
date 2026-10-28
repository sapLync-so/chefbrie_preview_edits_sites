# Chef Brie — contact & submission backend

Public repo: **no secrets in git**. Copy `.env.example` to `.env.local` (local) or set variables in **Vercel → chefbrie-preview → Environment Variables**.

All forms POST to `/api/chef-brie-contact`. When **Resend, Notion, and Supabase are all unset**, the API returns **503** `{ preview: true }` and the UI falls back to **mailto:chefbrie.01@gmail.com**.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender (e.g. `Chef Brie <hello@yourdomain.com>`) |
| `CHEF_BRIE_NOTIFY_EMAIL` | Recipient (default **`chefbrie.01@gmail.com`**) |
| `NOTION_TOKEN` | Notion integration secret |
| `NOTION_SUBMISSIONS_DATABASE_ID` | Target database ID |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (**never** expose to client) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Optional Turnstile secret (required with site key) |

## Resend

1. Create a [Resend](https://resend.com) account and verify your domain.
2. Create an API key → `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to a verified address on that domain.
4. Leave `CHEF_BRIE_NOTIFY_EMAIL` empty to use **chefbrie.01@gmail.com**, or override if needed.

Meal prep intake emails include the **signature PNG attachment**.

## Notion database

Create a database with these properties (**names and types must match exactly**):

| Property | Type |
|----------|------|
| Name | Title |
| Email or Phone | Rich text |
| Allergies | Rich text |
| Acknowledgment Name | Rich text |
| Signature Date | Date |
| Weeks Picked | Rich text |
| Subtotal | Number (dollars) |
| Payment Note | Rich text |
| Signature Reference | Rich text (Supabase object path, or `captured in email`) |
| Form Type | Select: `Meal Prep Intake`, `Contact`, `Quote Request`, `Artist Application`, `Booking`, `Other` |
| Submitted At | Date (include time) |

**Setup:**

1. [Notion integrations](https://www.notion.so/my-integrations) → New integration → copy **Internal Integration Secret** → `NOTION_TOKEN`.
2. Open the database → **⋯** → **Connections** → add your integration.
3. Copy database ID from the URL → `NOTION_SUBMISSIONS_DATABASE_ID`.

Extra message text is appended in the **page body** (paragraph blocks).

## Supabase

1. Create a project.
2. Run SQL in `supabase/migrations/20261024120000_create_submissions.sql` (SQL editor or `supabase db push`).
3. Confirm **`submissions`** table exists with **`raw_json`**, RLS **enabled**, **no public policies**.
4. Confirm private storage bucket **`signatures`** (PNG only).
5. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.

## Pipeline (server)

For each submission (`lib/contact/process-submission.ts`):

1. **Supabase** — insert row + upload signature PNG (meal prep only).
2. **Resend** — HTML + plain email to notify address.
3. **Notion** — new database page.

Steps are **independent**; failures are logged. HTTP **200** if **any** of the three succeeds.

## Spam protection (API)

- Hidden honeypot `company_website` (must be empty)
- Minimum **3s** between `formStartedAt` (client) and submit
- Per-IP rate limit (`lib/contact/rate-limit.ts`)
- Zod validation + **~500KB** cap on signature data URL; **~750KB** max JSON body
- **Turnstile** when `TURNSTILE_SECRET_KEY` is set

## Local dev

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without `.env.local`, preview mailto fallback still works.
