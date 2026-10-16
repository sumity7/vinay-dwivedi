-- One-time setup for real complaint storage (e-shikayat). Paste the whole file into
-- Supabase → SQL Editor → New query → Run. Safe to run once on a fresh project.
-- Same schema as the README "Complaint storage" section, plus the photo bucket.

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

-- private bucket for complaint photos: the public may upload, only the office can view
insert into storage.buckets (id, name, public) values ('complaint-photos', 'complaint-photos', false)
on conflict (id) do nothing;
create policy "public can upload complaint photos" on storage.objects
  for insert to anon with check (bucket_id = 'complaint-photos');
