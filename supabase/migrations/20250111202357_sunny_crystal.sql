-- Create function to check user role with explicit schema references
CREATE OR REPLACE FUNCTION public.check_user_role(role_to_check text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = role_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;