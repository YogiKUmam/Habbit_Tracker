-- ==============================================================================
-- HabitFlow PostgreSQL Database Schema & Row Level Security (RLS) for Supabase
-- ==============================================================================

-- 1. Create habits table
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null,
  description text,
  category text not null default 'Health',
  color text not null default 'emerald',
  icon text not null default 'Droplets',
  target_days_per_week int not null default 7,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Create habit_logs table
create table if not exists public.habit_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  habit_id text not null,
  date text not null, -- YYYY-MM-DD format
  completed boolean not null default true,
  note text,
  timestamp timestamptz not null default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- 4. RLS Policies for 'habits' table
create policy "Users can view their own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can create their own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for 'habit_logs' table
create policy "Users can view their own habit logs"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "Users can create their own habit logs"
  on public.habit_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habit logs"
  on public.habit_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habit logs"
  on public.habit_logs for delete
  using (auth.uid() = user_id);

-- 6. Performance Indexes
create index if not exists idx_habits_user_id on public.habits (user_id);
create index if not exists idx_habit_logs_user_id on public.habit_logs (user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs (habit_id);
create index if not exists idx_habit_logs_date on public.habit_logs (date);
