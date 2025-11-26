-- =============================================================================
-- UPDATE PROFILES TABLE FOR EMAIL VERIFICATION
-- =============================================================================
-- Run this in your Supabase SQL Editor
-- This adds email verification tracking columns
-- =============================================================================

-- Add new columns for email verification tracking
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMPTZ;

-- Update existing users to mark them as verified (they already have access)
UPDATE profiles
SET email_verified = TRUE
WHERE email_verified IS NULL;

-- Create or update RLS policy for profiles table
-- Allow users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Allow admins to insert new profiles
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
CREATE POLICY "Admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (TRUE); -- Allow insert for new signups

-- Allow admins to delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
