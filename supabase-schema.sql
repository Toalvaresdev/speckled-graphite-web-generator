-- Speckled Graphite Database Schema for Supabase
-- Run this in your Supabase Dashboard -> SQL Editor

-- 1. Feedback Table (Community comments & suggestions)
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  author text not null default 'Anonymous Designer',
  email text,
  location text default 'Global Visitor',
  category text not null default 'idea',
  comment text not null,
  sentiment text not null default '😍',
  upvotes integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If you already created the table without email, simply run this 1-line query:
-- alter table public.feedback add column if not exists email text;

-- Enable Row Level Security (RLS)
alter table public.feedback enable row level security;

-- Policies for public access on feedback
create policy "Allow public read access on feedback" 
  on public.feedback for select 
  using (true);

create policy "Allow public insert on feedback" 
  on public.feedback for insert 
  with check (true);

create policy "Allow public update upvotes on feedback" 
  on public.feedback for update 
  using (true);


-- 2. Downloads Table (Track download events and copies)
create table if not exists public.downloads (
  id uuid default gen_random_uuid() primary key,
  format text not null, -- 'png', 'svg', 'webp', 'jpg', 'css_copy', 'tailwind_copy', 'react_copy'
  resolution text,      -- e.g. '1920x1080', '3840x2160'
  ratio text,           -- '16:9', '1:1', '9:16', '4:3'
  tone text,            -- 'silver', 'dark', 'mixed'
  seed bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.downloads enable row level security;

-- Policies for public access on downloads
create policy "Allow public read access on downloads" 
  on public.downloads for select 
  using (true);

create policy "Allow public insert on downloads" 
  on public.downloads for insert 
  with check (true);

-- Optional: create index for faster count queries
create index if not exists idx_downloads_created_at on public.downloads(created_at desc);
create index if not exists idx_feedback_created_at on public.feedback(created_at desc);
