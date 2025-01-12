-- Create function to log access with explicit schema references and search path
CREATE OR REPLACE FUNCTION public.log_access()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.access_logs (user_id, action, ip_address)
  VALUES (auth.uid(), TG_ARGV[0], inet_client_addr()::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to check system health with explicit schema references and search path
CREATE OR REPLACE FUNCTION public.check_system_health()
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
  FROM public.system_health h
  WHERE h.timestamp = (
    SELECT MAX(timestamp)
    FROM public.system_health h2
    WHERE h2.component = h.component
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update increment_video_views function with explicit schema references and search path
CREATE OR REPLACE FUNCTION public.increment_video_views(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.videos
  SET views = views + 1
  WHERE id = video_id;
  
  UPDATE public.video_analytics
  SET 
    views = views + 1,
    updated_at = now()
  WHERE video_id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update update_updated_at_column function with explicit schema references and search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;