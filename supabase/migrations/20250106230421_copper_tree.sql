/*
  # Create roles and user roles tables

  1. New Tables
    - roles: Store system roles (admin, creator)
    - user_roles: Link users to roles
  
  2. Security
    - Enable RLS on both tables
    - Add policies for role-based access
    - Create helper function for role checking
*/

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id),
  role_id text REFERENCES roles(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
  ('admin', 'Administrator', 'Full system access'),
  ('creator', 'Content Creator', 'Creator dashboard access')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON user_roles;

-- Create policies
CREATE POLICY "Roles are viewable by everyone"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "User roles are viewable by everyone"
  ON user_roles FOR SELECT
  USING (true);

-- Create or replace function to check user role
CREATE OR REPLACE FUNCTION auth.check_user_role(role_to_check text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = role_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS user_roles_user_id_idx;
DROP INDEX IF EXISTS user_roles_role_id_idx;

-- Create indexes
CREATE INDEX user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX user_roles_role_id_idx ON user_roles(role_id);