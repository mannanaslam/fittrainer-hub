
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Defer profile fetch to avoid Supabase auth recursion
        setTimeout(async () => {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }, 0);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });
    
    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log("Checking for initial session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Initial session check:", session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Initial session check error:", error);
        setLoading(false);
      }
    };
    
    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Sign up attempt for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }

      console.log("Sign up successful:", data);

      // The profile will be created automatically through the database trigger
      // Just wait a moment for the database trigger to complete
      if (data.user) {
        setTimeout(async () => {
          const userProfile = await fetchProfile(data.user!.id);
          if (userProfile) setProfile(userProfile);
        }, 1000);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      
      // Clear any existing session first to avoid potential conflicts
      await supabase.auth.signOut();
      
      // Add a small delay to ensure the signOut completes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      
      // The onAuthStateChange handler will update the user and profile states
      
      return { data, error: null };
    } catch (error) {
      console.error("Sign in caught error:", error);
      
      // Format the error to be more helpful
      const formattedError = {
        name: (error as any).name || 'AuthError',
        message: (error as any).message || 'Authentication failed. Please try again.',
        status: (error as any).status || 500
      };
      
      // Add special handling for network errors
      if ((error as any).message?.includes('fetch') || (error as any).status === 0) {
        formattedError.name = 'NetworkError';
        formattedError.message = 'Connection error. Please check your internet connection and try again.';
      }
      
      return { data: null, error: formattedError };
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out attempt");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      console.log("Sign out successful");
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
