/*
  # Add Event Check In System

  1. New Tables
    - `live_events` - Base table for live events
    - `event_checkins` - Stores user check-ins for events
    - `event_actions` - Stores available actions for each event
    - `event_action_completions` - Tracks completed actions by users
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create live_events table first
CREATE TABLE IF NOT EXISTS live_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  category text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  is_ppv boolean DEFAULT false,
  price decimal(10,2),
  chat_enabled boolean DEFAULT true,
  chat_permissions text DEFAULT 'everyone',
  chat_delay integer DEFAULT 0,
  chat_reactions_enabled boolean DEFAULT true,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  stream_type text DEFAULT 'software',
  viewer_count bigint DEFAULT 0,
  checkin_enabled boolean DEFAULT false,
  checkin_qr_code text,
  checkin_prize text,
  checkin_terms text,
  checkin_privacy_policy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_checkins table
CREATE TABLE IF NOT EXISTS event_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES live_events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  zip_code text NOT NULL,
  receive_notifications boolean DEFAULT false,
  terms_accepted boolean NOT NULL,
  checked_in_at timestamptz DEFAULT now(),
  
  -- Ensure one check-in per user per event
  UNIQUE(event_id, user_id)
);

-- Create event_actions table
CREATE TABLE IF NOT EXISTS event_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES live_events(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  action_type text NOT NULL CHECK (action_type IN (
    'check_in', 'book_now', 'learn_more', 'watch_more',
    'listen_now', 'stream_now', 'get_yours', 'buy_now',
    'download_app', 'download_now', 'free_download',
    'try_now', 'free_trial', 'free_quote'
  )),
  link text NOT NULL,
  sponsor_name text,
  sponsor_logo text,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create event_action_completions table
CREATE TABLE IF NOT EXISTS event_action_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id uuid REFERENCES event_actions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  
  -- Ensure one completion per user per action
  UNIQUE(action_id, user_id)
);

-- Enable RLS
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_action_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for live_events
CREATE POLICY "Live events are viewable by everyone"
  ON live_events FOR SELECT
  USING (visibility = 'public' OR visibility = 'unlisted' OR user_id = auth.uid());

CREATE POLICY "Creators can insert live events"
  ON live_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_creator = true
      AND creator_status = 'approved'
    )
  );

CREATE POLICY "Users can update own live events"
  ON live_events FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for event_checkins
CREATE POLICY "Users can view their own check-ins"
  ON event_checkins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own check-ins"
  ON event_checkins FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for event_actions
CREATE POLICY "Event actions are viewable by everyone"
  ON event_actions FOR SELECT
  USING (true);

-- Create policies for event_action_completions
CREATE POLICY "Users can view their own action completions"
  ON event_action_completions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own action completions"
  ON event_action_completions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX live_events_user_id_idx ON live_events(user_id);
CREATE INDEX live_events_status_idx ON live_events(status);
CREATE INDEX event_checkins_event_id_idx ON event_checkins(event_id);
CREATE INDEX event_checkins_user_id_idx ON event_checkins(user_id);
CREATE INDEX event_actions_event_id_idx ON event_actions(event_id);
CREATE INDEX event_action_completions_action_id_idx ON event_action_completions(action_id);
CREATE INDEX event_action_completions_user_id_idx ON event_action_completions(user_id);

-- Create updated_at trigger for live_events
CREATE TRIGGER update_live_events_updated_at
    BEFORE UPDATE ON live_events
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();