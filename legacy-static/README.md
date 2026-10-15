# Vinay Kumar Dwivedi — MLA website

Single-page bilingual (Hindi / English) site. Plain HTML, no build step.

```
index.html          page structure
assets/data.js      CONTENT: news, gallery (with albums), videos, WhatsApp number, Supabase keys — edit this
assets/app.js       behaviour (forms, portal, e-card, gallery)
assets/styles.css   design
images/             photos
```

To add a news item or photo: drop the image into images/ and add one entry at the top of the list in assets/data.js.

## Run / deploy
- Local preview: `python3 -m http.server` in this folder, open http://localhost:8000
  (opening index.html directly works too, but the e-card needs a server to draw his photo)
- Vercel: push this folder to a GitHub repo → Import in Vercel → Framework "Other" → Deploy.

## Features
| Section | What it does |
| --- | --- |
| Birthday ribbon | Shows automatically 10–20 October, links to the birthday e-card |
| शिकायत portal | Name, mobile, village, category, description, photo, consent. Gives a number like `MHN-261014-4821` |
| स्थिति जानें | Track by complaint number + mobile (both must match) |
| E-card maker | 6 templates (birthday, Diwali, Chhath, Navratri, supporter, national day); user name, post and photo; download PNG or share. Photo never leaves the phone |
| मुलाकात | Meeting request opens WhatsApp with the message ready, to the office number |
| Helplines | Tap-to-call 112, 108, 102, 1076, 1090, 1912, 181 |
| Language | हिं / EN toggle, remembered per visitor |
| Text size | A- / A / A+ for older readers |
| News | Dated cards from `data.js`, first one large |
| Gallery | Album filter chips, lightbox with next/prev and WhatsApp share |
| Videos | Thumbnails linking to his Facebook reels |
| जुड़ें अभियान | Volunteer sign-up → WhatsApp to office |
| अपने विचार भेजें | Suggestions (kept separate from complaints, like UP's IGRS) → WhatsApp |
| Complaint extras | Received / resolved / pending counters, reminder after 7 days, star rating after resolution, list of what is not a complaint |

## Complaint storage
Out of the box the portal runs in **demo mode**: complaints are saved only in the visitor's own browser.
To receive real complaints, connect Supabase (5 minutes):

1. Create a Supabase project. In SQL Editor run:

```sql
create table complaints (
  id bigint generated always as identity primary key,
  complaint_id text unique not null,
  name text not null,
  mobile text not null,
  village text not null,
  block text,
  category text not null,
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

-- status lookup returns only status fields, and only when number + mobile match
create function get_complaint_status(p_id text, p_mobile text)
returns table (category text, village text, status text, office_note text, created_at timestamptz, rating int)
language sql security definer set search_path = public as $$
  select category, village, status, office_note, created_at, rating
  from complaints
  where complaint_id = upper(p_id) and mobile = p_mobile
  limit 1
$$;
grant execute on function get_complaint_status(text, text) to anon;

-- feedback stars after a complaint is resolved
create function submit_feedback(p_id text, p_mobile text, p_rating int)
returns void language sql security definer set search_path = public as $$
  update complaints set rating = p_rating
  where complaint_id = upper(p_id) and mobile = p_mobile and status = 'resolved' and rating is null
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

3. In `assets/data.js`, fill the `config` block:

```js
supabaseUrl: "https://YOUR-PROJECT.supabase.co",
supabaseAnonKey: "YOUR-ANON-KEY",
```

The office updates `status` (received → review → action → resolved) and `office_note` from the Supabase Table Editor; citizens see it instantly in "स्थिति जानें".

## Before going live — confirm with the client
- Jansampark office address (Contact section shows a placeholder)
- Which WhatsApp number receives meeting requests (`CONFIG.officeWhatsApp`, now 9670086000)
- Gallery captions for the two meeting photos
- Any development projects with names, dates and amounts, to add to the "Priorities" section
