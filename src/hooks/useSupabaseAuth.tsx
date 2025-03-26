import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthError } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };
    
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              role: userData.userType,
              name: userData.name,
              ...userData,
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw profileError;
        }
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
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error(`Sign in error (attempt ${attempt}/${maxRetries}):`, error);
            lastError = error;
            if (error.message !== 'Failed to fetch') {
              throw error;
            }
          } else {
            console.log("Sign in successful:", data);
            return { data, error: null };
          }
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          }
        } catch (e) {
          lastError = e;
          if (attempt === maxRetries) {
            throw e;
          }
        }
      }
      
      throw lastError;
    } catch (error) {
      console.error("Sign in caught error:", error);
      return { 
        data: null, 
        error: {
          name: error.name || 'AuthError',
          message: error.message || 'Authentication failed. Please try again.',
          status: error.status || 500
        }
      };
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
