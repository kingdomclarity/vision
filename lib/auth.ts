import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function checkRole(role: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_user_role', {
      role_to_check: role
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

export async function requireRole(role: string): Promise<void> {
  const hasRole = await checkRole(role);
  if (!hasRole) {
    throw new Error('Unauthorized');
  }
}