
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { fetchUserProfile, signUpUser, signInUser, signOutUser } from '@/lib/auth-api';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Auth state listener
  useEffect(() => {
    setLoading(true);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          try {
            const userProfile = await fetchUserProfile(newSession.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession?.user?.id);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          try {
            const userProfile = await fetchUserProfile(initialSession.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      const { data, error } = await signUpUser(email, password, userData);
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        return { data, error };
      }
      
      toast({
        title: "Signup successful",
        description: "Please check your email to confirm your account."
      });
      
      return { data, error: null };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await signInUser(email, password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { data: null, error };
      } 
      
      // Fetch profile after successful sign in
      if (data?.user) {
        try {
          const userProfile = await fetchUserProfile(data.user.id);
          setProfile(userProfile);
        } catch (profileError) {
          console.error("Error fetching user profile after login:", profileError);
        }
      }
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in."
      });
      
      return { data, error: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await signOutUser();
      
      if (!error) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out."
        });
      } else {
        toast({
          title: "Logout failed",
          description: "An error occurred while logging out.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
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
}
