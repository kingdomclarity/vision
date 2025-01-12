-- Drop existing admin profile if it exists
DO $$
BEGIN
  DELETE FROM public.profiles WHERE username = 'admin';
  DELETE FROM auth.users WHERE email = 'admin@cvision.com';
END $$;

-- Create function to handle admin profile creation
CREATE OR REPLACE FUNCTION public.create_admin_profile()
RETURNS void AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Create admin user if not exists
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role
  )
  VALUES (
    'admin@cvision.com',
    crypt('Vision@Admin2024', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"System Admin"}',
    now(),
    now(),
    'authenticated'
  )
  RETURNING id INTO admin_id;

  -- Create admin profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    is_verified,
    is_premium,
    is_creator,
    creator_status,
    created_at,
    updated_at
  )
  VALUES (
    admin_id,
    'admin',
    'System Admin',
    true,
    true,
    true,
    'approved',
    now(),
    now()
  );

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (admin_id, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT public.create_admin_profile();