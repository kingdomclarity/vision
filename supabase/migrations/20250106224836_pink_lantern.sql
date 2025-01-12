/*
  # Content Moderation System Tables

  1. New Tables
    - `moderation_queue`
      - `id` (uuid, primary key)
      - `content_id` (uuid, reference to content)
      - `content_type` (text) - video/comment
      - `status` (text) - approved/pending/rejected
      - `confidence` (float)
      - `categories` (text[])
      - `review_priority` (text)
      - `timestamp` (float, optional)
      - `reviewed_by` (uuid, optional)
      - `reviewed_at` (timestamptz, optional)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create enum types
CREATE TYPE moderation_status AS ENUM ('approved', 'pending', 'rejected');
CREATE TYPE moderation_type AS ENUM ('video', 'comment');
CREATE TYPE review_priority AS ENUM ('high', 'medium', 'low');

-- Create moderation queue table
CREATE TABLE IF NOT EXISTS moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type moderation_type NOT NULL,
  status moderation_status NOT NULL DEFAULT 'pending',
  confidence float NOT NULL,
  categories text[] NOT NULL,
  review_priority review_priority NOT NULL,
  timestamp float,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  -- Add constraint to ensure timestamp exists for videos
  CONSTRAINT timestamp_required_for_videos 
    CHECK (content_type != 'video' OR timestamp IS NOT NULL)
);

-- Enable RLS
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read
CREATE POLICY "Admins can read moderation queue"
  ON moderation_queue
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for admins to update
CREATE POLICY "Admins can update moderation queue"
  ON moderation_queue
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX moderation_queue_status_idx ON moderation_queue(status);
CREATE INDEX moderation_queue_priority_idx ON moderation_queue(review_priority);
CREATE INDEX moderation_queue_created_at_idx ON moderation_queue(created_at);