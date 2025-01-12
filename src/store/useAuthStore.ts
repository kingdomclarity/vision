import { create } from 'zustand';
import { db } from '../lib/db';
import type { User } from '../types';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await db.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Get user profile
      const { data: profile, error: profileError } = await db.client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // Create profile if it doesn't exist
        const username = email.split('@')[0];
        const { data: newProfile, error: insertError } = await db.client
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            display_name: username,
            is_verified: false,
            is_premium: false,
            is_creator: false
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            username,
            isVerified: false,
            isPremium: false,
            createdAt: data.user.created_at,
            profile: newProfile
          },
          isAuthenticated: true
        });
      } else {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            username: profile.username,
            isVerified: profile.is_verified,
            isPremium: profile.is_premium,
            createdAt: data.user.created_at,
            profile
          },
          isAuthenticated: true
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await db.client.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Create initial profile
      const username = email.split('@')[0];
      const { data: profile, error: profileError } = await db.client
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          display_name: username,
          is_verified: false,
          is_premium: false,
          is_creator: false
        })
        .select()
        .single();

      if (profileError) throw profileError;

      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          username,
          isVerified: false,
          isPremium: false,
          createdAt: data.user.created_at,
          profile
        },
        isAuthenticated: true
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  signOut: async () => {
    await db.client.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));