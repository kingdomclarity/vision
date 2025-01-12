/*
  # Fix Profiles Schema

  1. Changes
    - Add missing is_premium column to profiles table
    - Add missing bio column to profiles table
    - Add missing banner_url column to profiles table
    - Add missing social_links column to profiles table
    - Add missing creator_status column to profiles table
    - Add missing is_creator column to profiles table

  2. Security
    - No changes to existing RLS policies
*/

-- Add missing columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_creator boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS creator_status text CHECK (creator_status IN ('pending', 'approved', 'rejected'));

-- Ensure is_premium column exists
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;