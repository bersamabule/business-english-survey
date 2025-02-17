-- Create the business_english_surveys table
create table if not exists business_english_surveys (
    id uuid default gen_random_uuid() primary key,
    client_name text not null,
    responses jsonb not null,
    submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed boolean default false,
    current_section integer default 0,
    last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table business_english_surveys enable row level security;

-- Create policy to allow anonymous inserts
create policy "Allow anonymous survey submissions"
on business_english_surveys
for insert
to anon
with check (true);

-- Create policy to allow reading own submissions
create policy "Allow reading own submissions"
on business_english_surveys
for select
to anon
using (true);
