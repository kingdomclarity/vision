import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function setupAdmin() {
  try {
    // Create admin user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@vision.com',
      password: 'Vision@Admin2024'
    });

    if (signUpError) throw signUpError;

    if (!authData.user) {
      throw new Error('No user data returned');
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: 'admin',
        display_name: 'System Admin',
        is_verified: true
      });

    if (profileError) throw profileError;

    // Assign admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role_id: 'admin'
      });

    if (roleError) throw roleError;

    return {
      email: 'admin@vision.com',
      password: 'Vision@Admin2024'
    };
  } catch (error) {
    console.error('Error setting up admin:', error);
    throw error;
  }
}