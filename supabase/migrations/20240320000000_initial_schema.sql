-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  email text not null,
  first_name text,
  last_name text,
  bio text,
  avatar_url text,
  contact_info jsonb,
  role text check (role in ('trainer', 'client')) not null,
  certifications text[],
  specialties text[],
  experience text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create workout_plans table
create table workout_plans (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  duration integer not null,
  is_premium boolean default false,
  price decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exercises table
create table exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_plan_id uuid references workout_plans(id) on delete cascade not null,
  name text not null,
  description text,
  sets integer not null,
  reps integer not null,
  rest_interval integer not null,
  equipment text[],
  video_url text,
  notes text,
  modifications text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create diet_plans table
create table diet_plans (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  duration integer not null,
  is_premium boolean default false,
  price decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create meals table
create table meals (
  id uuid primary key default uuid_generate_v4(),
  diet_plan_id uuid references diet_plans(id) on delete cascade not null,
  name text not null,
  description text,
  macros jsonb not null,
  calories integer not null,
  ingredients text[] not null,
  instructions text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  plan_id uuid not null,
  plan_type text check (plan_type in ('workout', 'diet')) not null,
  status text check (status in ('active', 'cancelled', 'expired')) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  price decimal(10,2) not null,
  payment_status text check (payment_status in ('paid', 'pending', 'failed')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create client_progress table
create table client_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  trainer_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workout_logs table
create table workout_logs (
  id uuid primary key default uuid_generate_v4(),
  client_progress_id uuid references client_progress(id) on delete cascade not null,
  workout_plan_id uuid references workout_plans(id) on delete cascade not null,
  completed_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create workout_log_exercises table
create table workout_log_exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_log_id uuid references workout_logs(id) on delete cascade not null,
  exercise_id uuid references exercises(id) on delete cascade not null,
  completed_sets integer not null,
  completed_reps integer not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create measurements table
create table measurements (
  id uuid primary key default uuid_generate_v4(),
  client_progress_id uuid references client_progress(id) on delete cascade not null,
  type text check (type in ('weight', 'bodyFat', 'muscleMass', 'custom')) not null,
  value decimal(10,2) not null,
  unit text not null,
  date timestamp with time zone not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create goals table
create table goals (
  id uuid primary key default uuid_generate_v4(),
  client_progress_id uuid references client_progress(id) on delete cascade not null,
  type text check (type in ('weight', 'strength', 'endurance', 'custom')) not null,
  target decimal(10,2) not null,
  unit text not null,
  deadline timestamp with time zone not null,
  status text check (status in ('in_progress', 'achieved', 'missed')) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table profiles enable row level security;
alter table workout_plans enable row level security;
alter table exercises enable row level security;
alter table diet_plans enable row level security;
alter table meals enable row level security;
alter table subscriptions enable row level security;
alter table client_progress enable row level security;
alter table workout_logs enable row level security;
alter table workout_log_exercises enable row level security;
alter table measurements enable row level security;
alter table goals enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Workout plans policies
create policy "Trainers can manage their workout plans"
  on workout_plans for all
  using (auth.uid() in (
    select user_id from profiles where id = trainer_id and role = 'trainer'
  ));

create policy "Clients can view subscribed workout plans"
  on workout_plans for select
  using (exists (
    select 1 from subscriptions
    where subscriptions.plan_id = workout_plans.id
    and subscriptions.user_id = auth.uid()
    and subscriptions.status = 'active'
    and subscriptions.plan_type = 'workout'
  ));

-- Similar policies for other tables...

-- Create functions and triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

-- Add similar triggers for other tables... 