import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function setupAdmin() {
  try {
    // Create admin user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@vision.com',
      password: 'Vision@Admin2024'
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user created');

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: 'admin',
        display_name: 'System Admin',
        is_verified: true
      });

    if (profileError) throw profileError;

    // Assign admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: 'admin'
      });

    if (roleError) throw roleError;

    console.log('Admin account created successfully!');
    console.log('Email: admin@vision.com');
    console.log('Password: Vision@Admin2024');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin();