/*
  # Final Platform Setup

  1. New Tables
    - `analytics_data` - Stores platform analytics
    - `access_logs` - Tracks system access
    - `user_consent` - Stores user consent records
    - `backup_logs` - Tracks backup operations
    - `system_health` - Stores health check results

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add audit logging
*/

-- Create analytics_data table
CREATE TABLE IF NOT EXISTS analytics_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  ip_address text,
  user_agent text,
  timestamp timestamptz DEFAULT now()
);

-- Create user_consent table
CREATE TABLE IF NOT EXISTS user_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  consent_type text NOT NULL,
  granted boolean NOT NULL,
  timestamp timestamptz DEFAULT now(),
  UNIQUE(user_id, consent_type)
);

-- Create backup_logs table
CREATE TABLE IF NOT EXISTS backup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id text NOT NULL,
  status text NOT NULL,
  size_bytes bigint,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error text
);

-- Create system_health table
CREATE TABLE IF NOT EXISTS system_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component text NOT NULL,
  status text NOT NULL,
  details jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can access analytics"
  ON analytics_data
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can access logs"
  ON access_logs
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view their own consent"
  ON user_consent
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can access backup logs"
  ON backup_logs
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can access health data"
  ON system_health
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes
CREATE INDEX analytics_event_type_idx ON analytics_data(event_type);
CREATE INDEX analytics_created_at_idx ON analytics_data(created_at);
CREATE INDEX access_logs_timestamp_idx ON access_logs(timestamp);
CREATE INDEX access_logs_user_id_idx ON access_logs(user_id);
CREATE INDEX user_consent_user_id_idx ON user_consent(user_id);
CREATE INDEX backup_logs_status_idx ON backup_logs(status);
CREATE INDEX system_health_component_idx ON system_health(component);
CREATE INDEX system_health_timestamp_idx ON system_health(timestamp);

-- Create function to log access
CREATE OR REPLACE FUNCTION log_access()
RETURNS trigger AS $$
BEGIN
  INSERT INTO access_logs (user_id, action, ip_address)
  VALUES (auth.uid(), TG_ARGV[0], inet_client_addr()::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check system health
CREATE OR REPLACE FUNCTION check_system_health()
RETURNS TABLE (
  component text,
  status text,
  last_check timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.component,
    h.status,
    h.timestamp
  FROM system_health h
  WHERE h.timestamp = (
    SELECT MAX(timestamp)
    FROM system_health h2
    WHERE h2.component = h.component
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;