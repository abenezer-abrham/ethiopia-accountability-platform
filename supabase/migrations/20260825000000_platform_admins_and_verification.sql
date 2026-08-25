-- Migration: 20260825000000_platform_admins_and_verification.sql
-- Description: Creates the platform_admins table for login cross-referencing and adds email verification tracking.

-- 1. Create PLATFORM_ADMINS table
CREATE TABLE IF NOT EXISTS public.platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin', -- 'ceo_founder', 'admin', 'moderator'
    name TEXT NOT NULL,
    assigned_by TEXT DEFAULT 'system_root',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- 2. Insert primary Root CEO (Abenezer Abrham)
INSERT INTO public.platform_admins (email, role, name, assigned_by)
VALUES ('abenezerabrham61@gmail.com', 'ceo_founder', 'Abenezer Abrham', 'system_root')
ON CONFLICT (email) DO UPDATE 
SET role = 'ceo_founder', name = 'Abenezer Abrham';

-- 3. Add email verification columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Ensure Abenezer is verified
UPDATE public.profiles
SET email = 'abenezerabrham61@gmail.com', email_verified = TRUE, role = 'ceo_founder', display_name = 'Abenezer Abrham'
WHERE email = 'abenezerabrham61@gmail.com' OR username = 'abenezer';
