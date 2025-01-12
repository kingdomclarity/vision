/*
  # Add Video Features

  1. New Tables
    - video_chapters: Stores chapter information for videos
    - video_interactions: Stores interactive elements like polls, quizzes, etc.
    - video_sponsorships: Stores sponsorship information for videos

  2. Changes
    - Add support for chapters, interactions, and sponsorships
    - Add RLS policies for new tables
    - Add indexes for performance

  3. Security
    - Enable RLS on all new tables
    - Add policies for creators to manage their content
*/

-- Create video_chapters table
CREATE TABLE IF NOT EXISTS video_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_time integer NOT NULL, -- in seconds
  end_time integer NOT NULL, -- in seconds
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create video_interactions table
CREATE TABLE IF NOT EXISTS video_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES video_chapters(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('quiz', 'poll', 'challenge', 'ar', 'game', 'comment')),
  title text NOT NULL,
  description text,
  start_time integer NOT NULL, -- in seconds
  content jsonb NOT NULL, -- stores interaction-specific data
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_sponsorships table
CREATE TABLE IF NOT EXISTS video_sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  brand_url text NOT NULL,
  description text,
  start_time integer, -- optional, for mid-roll sponsorships
  end_time integer, -- optional, for mid-roll sponsorships
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- If times are provided, ensure valid range
  CONSTRAINT valid_time_range CHECK (
    (start_time IS NULL AND end_time IS NULL) OR
    (start_time < end_time)
  )
);

-- Create interaction_responses table for storing user responses
CREATE TABLE IF NOT EXISTS interaction_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id uuid REFERENCES video_interactions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  response jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure one response per user per interaction
  UNIQUE(interaction_id, user_id)
);

-- Enable RLS
ALTER TABLE video_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for video_chapters
CREATE POLICY "Video chapters are viewable by everyone"
  ON video_chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND (visibility = 'public' OR visibility = 'unlisted')
    )
  );

CREATE POLICY "Creators can manage their video chapters"
  ON video_chapters
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Create policies for video_interactions
CREATE POLICY "Video interactions are viewable by everyone"
  ON video_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND (visibility = 'public' OR visibility = 'unlisted')
    )
  );

CREATE POLICY "Creators can manage their video interactions"
  ON video_interactions
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Create policies for video_sponsorships
CREATE POLICY "Video sponsorships are viewable by everyone"
  ON video_sponsorships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND (visibility = 'public' OR visibility = 'unlisted')
    )
  );

CREATE POLICY "Creators can manage their video sponsorships"
  ON video_sponsorships
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Create policies for interaction_responses
CREATE POLICY "Users can view their own responses"
  ON interaction_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON interaction_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX video_chapters_video_id_idx ON video_chapters(video_id);
CREATE INDEX video_chapters_start_time_idx ON video_chapters(start_time);
CREATE INDEX video_interactions_video_id_idx ON video_interactions(video_id);
CREATE INDEX video_interactions_chapter_id_idx ON video_interactions(chapter_id);
CREATE INDEX video_interactions_type_idx ON video_interactions(type);
CREATE INDEX video_sponsorships_video_id_idx ON video_sponsorships(video_id);
CREATE INDEX interaction_responses_interaction_id_idx ON interaction_responses(interaction_id);
CREATE INDEX interaction_responses_user_id_idx ON interaction_responses(user_id);

-- Create updated_at triggers
CREATE TRIGGER update_video_chapters_updated_at
    BEFORE UPDATE ON video_chapters
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_video_interactions_updated_at
    BEFORE UPDATE ON video_interactions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_video_sponsorships_updated_at
    BEFORE UPDATE ON video_sponsorships
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();