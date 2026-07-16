-- Run this in your Supabase SQL Editor to set up the students table

CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT NOT NULL,
  country TEXT NOT NULL,
  phone_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_code TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  same_whatsapp BOOLEAN DEFAULT false,
  program TEXT NOT NULL,
  other_program TEXT,
  index_number TEXT NOT NULL,
  level TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  graduated BOOLEAN DEFAULT false,
  registration_date TIMESTAMPTZ DEFAULT now(),
  UNIQUE(index_number, email)
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public registration form)
CREATE POLICY "anon_can_insert_students"
ON public.students FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous SELECT by index+email (for "already registered?" lookup)
CREATE POLICY "anon_can_select_students"
ON public.students FOR SELECT
TO anon
USING (true);
