
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        .single();

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
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };
    
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

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
      
      const maxRetries = 3;
      let lastError = null;
      let retryDelay = 1000; // Start with 1 second delay
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Use custom fetch timeouts to prevent hanging requests
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error(`Sign in error (attempt ${attempt}/${maxRetries}):`, error);
            lastError = error;
            
            // Only retry for network errors, not auth errors
            if (!error.message.includes('fetch') && !error.message.includes('network')) {
              throw error;
            }
          } else {
            console.log("Sign in successful:", data);
            
            if (data.user) {
              const userProfile = await fetchProfile(data.user.id);
              if (userProfile) setProfile(userProfile);
            }
            
            return { data, error: null };
          }
          
          if (attempt < maxRetries) {
            // Exponential backoff with jitter for better retry performance
            const jitter = Math.random() * 0.3;
            const delay = retryDelay * (1 + jitter);
            retryDelay *= 2; // Double the delay for next time
            
            console.log(`Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (e) {
          lastError = e;
          if (attempt === maxRetries || (!(e as any).message?.includes('fetch') && !(e as any).message?.includes('network'))) {
            throw e;
          }
        }
      }
      
      throw lastError;
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
        formattedError.message = 'Connection error. Please check your internet connection and try again.';
        formattedError.name = 'NetworkError';
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
