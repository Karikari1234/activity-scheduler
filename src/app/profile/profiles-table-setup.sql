-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone_number text,
  designation text,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
-- Allow users to view their own profile
create policy "Users can view their own profile" 
on profiles for select 
using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile" 
on profiles for update 
using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "Users can insert their own profile" 
on profiles for insert 
using (auth.uid() = id);

-- Optional: Create a trigger to create empty profiles when users sign up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
