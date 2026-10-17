# Vinay Kumar Dwivedi — MLA website

Multi-page bilingual site (Hindi at `/hi`, English at `/en`). Next.js (App Router) + TypeScript.
`/` redirects to `/hi`.

## Pages
| Path | Page |
| --- | --- |
| `/hi` | Home: hero slider, election figures, biography, journey, events, complaint & e-card tiles, Facebook + YouTube feeds, contact form |
| `/hi/about` | Biography, vision, roles, journey, milestones, priorities |
| `/hi/e-shikayat` | Register a complaint (ticket number, photo, consent, helplines) |
| `/hi/e-shikayat/track` | Track by ticket number + last 4 digits of mobile; reminder after 7 days; star rating after resolution |
| `/hi/e-card` | 16 occasions + upcoming anniversaries of our ideals (with countdown); name, village, photo; download / share |
| `/hi/updates`, `/hi/updates/[slug]` | Updates (events) with photo albums |
| `/hi/media`, `/hi/media/meetings` | Media (photo gallery, lightbox, videos), meetings & interactions |
| `/hi/vimarsh`, `/hi/vichar`, `/hi/vichar/[slug]` | Development & Ideas overview, scheme articles with category filter |
| `/hi/vikas-yatra` | Development figures (then/now, with sources) and UP / regional milestones |
| `/hi/ideals` | Quotes by category, thought of the day |
| `/hi/contact` | Enquiry form (general, meeting request, invitation, volunteer, suggestion, media) → WhatsApp |
| Every page | Side quick-action rail, “Ask assistant” AI chat, birthday ribbon 10–20 Oct |

## Where things live
```
lib/content/profile.ts   biography, facts, journey, milestones, roles, priorities, election stats
lib/content/events.ts    events (title, text, photos); newest first, `featured` leads
lib/content/media.ts     meetings & interactions, extra gallery photos
lib/content/articles.ts  Ideas & Articles (scheme explainers, with sources)
lib/content/vikas.ts     Vikas Yatra figures (each with its source)
lib/content/ideals.ts    Our Ideals quotes + anniversary dates (used by the e-card)
lib/content/ecard.ts     e-card occasions and card colours
lib/images.ts            every photo import (files live in /images)
lib/site.ts              phones, email, WhatsApp number, social accounts, YouTube channel id
lib/assistant-context.ts what the AI assistant knows (built from the content files) + its instructions
app/[lang]/…             pages        app/api/assistant/route.ts   AI assistant endpoint
components/              UI           app/globals.css              design (colours at the top)
legacy-static/           the original plain-HTML version, kept for reference — safe to delete
```

To add an event: put the photos in `images/`, import them in `lib/images.ts`, and add an entry at the top
of `lib/content/events.ts`. The gallery, home page and assistant pick it up automatically.

YouTube videos load automatically from the channel’s public feed (refreshed hourly, no API key).
The Facebook box uses Facebook’s page plugin; if a visitor’s browser blocks it, a “Open the Facebook page” card shows instead.

## Run / deploy
- Install: `npm install`
- Local dev: `npm run dev`, open http://localhost:3000
- Production build: `npm run build && npm start`
- Type check only: `npm run typecheck`
- Vercel: push this folder to a GitHub repo → Import in Vercel (detected as Next.js) → add the environment variables below → Deploy.

### Environment variables
Copy `.env.example` to `.env.local` (and add the same keys in Vercel → Settings → Environment Variables):

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Turns on the “Ask assistant” chat (Claude). Without it the chat shows a polite “not switched on yet” message with links |
| `ASSISTANT_MODEL` | Optional. Defaults to `claude-opus-5-5`; set e.g. `claude-haiku-5-5` for a cheaper model |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — enables real complaint storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://vinaydwivedi.in` — used in share links, social previews, `sitemap.xml` and `robots.txt`. If empty on Vercel, the project's production domain is used |

The assistant answers only from the site’s own content, in the visitor’s language, keeps answers short,
and is limited to 20 questions per visitor per 10 minutes (per server instance).

## Complaint storage
Out of the box the portal runs in **demo mode**: complaints are saved only in the visitor’s own browser.
To receive real complaints, connect Supabase:

1. Create a Supabase project. In SQL Editor run the whole of [`supabase/setup.sql`](supabase/setup.sql) (it is the SQL below plus the photo bucket), or run the two blocks below by hand:

```sql
create table complaints (
  id bigint generated always as identity primary key,
  complaint_id text unique not null,
  name text not null,
  mobile text not null,
  village text not null,
  category text not null,
  subject text not null,
  description text not null,
  photo_path text,
  status text not null default 'received'
    check (status in ('received','review','action','resolved')),
  office_note text,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);
alter table complaints enable row level security;

-- the public can only file new complaints, never read the table
create policy "public can file" on complaints
  for insert to anon
  with check (status = 'received' and office_note is null and rating is null);

-- status lookup: ticket number + last 4 digits of the mobile; returns status fields only
create function get_complaint_status(p_id text, p_last4 text)
returns table (category text, village text, subject text, status text, office_note text, created_at timestamptz, rating int)
language sql security definer set search_path = public as $$
  select category, village, subject, status, office_note, created_at, rating
  from complaints
  where complaint_id = upper(p_id) and right(mobile, 4) = p_last4
  limit 1
$$;
grant execute on function get_complaint_status(text, text) to anon;

-- feedback stars after a complaint is resolved
create function submit_feedback(p_id text, p_last4 text, p_rating int)
returns void language sql security definer set search_path = public as $$
  update complaints set rating = p_rating
  where complaint_id = upper(p_id) and right(mobile, 4) = p_last4 and status = 'resolved' and rating is null
$$;
grant execute on function submit_feedback(text, text, int) to anon;

-- public dashboard counts (no personal data)
create function complaint_counts()
returns table (total bigint, resolved bigint) language sql security definer set search_path = public as $$
  select count(*), count(*) filter (where status = 'resolved') from complaints
$$;
grant execute on function complaint_counts() to anon;
```

2. Storage → New bucket `complaint-photos` (private). Then run:

```sql
create policy "public can upload complaint photos" on storage.objects
  for insert to anon with check (bucket_id = 'complaint-photos');
```

3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then rebuild / redeploy (they are baked in at build time).

The office updates `status` (received → review → action → resolved) and `office_note` from the Supabase Table Editor; citizens see it at once on the tracking page.

## Admin dashboard (`/admin`)
A password-protected page where the office lists, searches and filters complaints, changes their status and writes the reply
citizens see on the tracking page. One shared password, no user accounts. Set these (locally in `.env.local`, and in Vercel →
Settings → Environment Variables, then redeploy):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | The login password, at least 6 characters. Empty or shorter = admin is switched off |
| `ADMIN_SESSION_SECRET` | Optional. Signs the login cookie; if empty the password is used, so changing the password logs everyone out |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role`. Server only (never `NEXT_PUBLIC_`): the complaints table is closed to the public, so this key is how the admin reads and updates it |

Login lasts 12 hours (httpOnly cookie) and is limited to 10 attempts per 15 minutes per IP. `/admin` is excluded from `robots.txt` and marked `noindex`.

## Launch checklist (Vercel)
1. Push to GitHub, import the repo in Vercel (it is detected as Next.js).
2. Settings → Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (and `ANTHROPIC_API_KEY` to switch the assistant on). Deploy again after changing them: the `NEXT_PUBLIC_*` values are baked in at build time.
3. Run `supabase/setup.sql` once in Supabase. Until then the complaint form shows an error, because the table does not exist yet.
4. Check `/sitemap.xml` and `/robots.txt` on the live domain, and submit the sitemap in Google Search Console.
5. Add the next year's festival dates (Diwali, Chhath, Holi, Mahashivratri) to `lib/content/ecard.ts` (`dates`): they move every year and drive the green banner at the top.

## Before going live — confirm with the client
- Jansampark office address (shown as “to be added”)
- WhatsApp number that receives contact-form messages and reminders (`officeWhatsApp` in `lib/site.ts`, now 9670086000)
- Captions of the photos taken from Facebook (written from the photos; check against the original posts) and event dates
- Figures in Vikas Yatra and the scheme articles: each cites its source; re-check before publishing
- Whether to add an X (Twitter) account to the social links
