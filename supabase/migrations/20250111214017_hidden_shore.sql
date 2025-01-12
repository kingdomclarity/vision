-- Create storage buckets for different content types
DO $$
BEGIN
  -- Videos bucket
  INSERT INTO storage.buckets (id, name, public)
  VALUES (
    'videos',
    'videos',
    false
  ) ON CONFLICT DO NOTHING;

  -- Thumbnails bucket
  INSERT INTO storage.buckets (id, name, public)
  VALUES (
    'thumbnails',
    'thumbnails',
    true
  ) ON CONFLICT DO NOTHING;

  -- User content bucket (avatars, banners, etc)
  INSERT INTO storage.buckets (id, name, public)
  VALUES (
    'user-content',
    'user-content',
    true
  ) ON CONFLICT DO NOTHING;

  -- Backups bucket (private)
  INSERT INTO storage.buckets (id, name, public)
  VALUES (
    'backups',
    'backups',
    false
  ) ON CONFLICT DO NOTHING;

  -- Temporary uploads bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'temp-uploads',
    'temp-uploads',
    false,
    52428800, -- 50MB limit
    ARRAY['video/*', 'image/*']::text[]
  ) ON CONFLICT DO NOTHING;
END $$;

-- Set up storage policies

-- Videos bucket policies
CREATE POLICY "Videos are viewable by everyone with access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos' AND (storage.foldername(name))[1] = 'public');

CREATE POLICY "Creators can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_creator = true
      AND creator_status = 'approved'
    )
  );

CREATE POLICY "Users can update their own videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Thumbnails bucket policies
CREATE POLICY "Thumbnails are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Creators can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thumbnails' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_creator = true
      AND creator_status = 'approved'
    )
  );

-- User content bucket policies
CREATE POLICY "User content is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-content');

CREATE POLICY "Users can upload their own content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-content' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-content' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Backups bucket policies
CREATE POLICY "Only admins can access backups"
  ON storage.objects
  USING (
    bucket_id = 'backups' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_id = 'admin'
    )
  );

-- Temp uploads bucket policies
CREATE POLICY "Authenticated users can upload temp files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'temp-uploads' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can only access their own temp files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'temp-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create cleanup function for temp uploads
CREATE OR REPLACE FUNCTION storage.cleanup_temp_uploads()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'temp-uploads'
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run cleanup daily
CREATE OR REPLACE FUNCTION storage.trigger_cleanup_temp_uploads()
RETURNS trigger AS $$
BEGIN
  PERFORM storage.cleanup_temp_uploads();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER cleanup_temp_uploads_trigger
  AFTER INSERT ON storage.objects
  FOR EACH STATEMENT
  WHEN (NEW.bucket_id = 'temp-uploads')
  EXECUTE FUNCTION storage.trigger_cleanup_temp_uploads();