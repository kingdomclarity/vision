/*
  # Admin and Creator Management Tables

  1. New Tables
    - `profiles`
      - Extended user profile information
      - Creator-specific fields
    - `videos`
      - Video content and metadata
    - `banners`
      - Featured banner management
    - `categories`
      - Content category management
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  banner_url text,
  is_verified boolean DEFAULT false,
  is_creator boolean DEFAULT false,
  creator_status text CHECK (creator_status IN ('pending', 'approved', 'rejected')),
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text NOT NULL,
  preview_url text,
  duration integer,
  category text NOT NULL,
  visibility text DEFAULT 'private' CHECK (visibility IN ('private', 'public', 'unlisted')),
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  is_premium boolean DEFAULT false,
  views bigint DEFAULT 0,
  likes bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  link text NOT NULL,
  category text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Videos policies
CREATE POLICY "Public videos are viewable by everyone"
  ON videos FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Creators can insert videos"
  ON videos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_creator = true
      AND creator_status = 'approved'
    )
  );

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Banners policies
CREATE POLICY "Banners are viewable by everyone"
  ON banners FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify banners"
  ON banners
  USING (auth.jwt() ->> 'role' = 'admin');

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX videos_user_id_idx ON videos(user_id);
CREATE INDEX videos_category_idx ON videos(category);
CREATE INDEX videos_visibility_idx ON videos(visibility);
CREATE INDEX banners_category_idx ON banners(category);
CREATE INDEX banners_active_idx ON banners(is_active);