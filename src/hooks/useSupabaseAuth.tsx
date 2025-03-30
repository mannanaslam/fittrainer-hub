
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // Default mock profile for demonstration when not authenticated
  const [profile, setProfile] = useState<Profile | null>({
    id: "mock-user-id",
    email: "demo@example.com",
    name: "Demo User",
    role: "trainer", // Can be changed to "client" as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  // Fetch user profile data - not actively used in demo mode
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

  // Auth state listener - disabled in demo mode
  useEffect(() => {
    console.log("Auth is temporarily disabled for demo purposes");
    setLoading(false);
  }, []);

  // These functions will not actually perform authentication in demo mode
  const signUp = async (email: string, password: string, userData: any) => {
    console.log("Sign up is temporarily disabled for demo purposes");
    return { data: null, error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log("Sign in is temporarily disabled for demo purposes");
    
    // Set mock profile based on email (to simulate different user types)
    if (email.includes('trainer')) {
      setProfile({
        id: "trainer-mock-id",
        email: "trainer@example.com",
        name: "Demo Trainer",
        role: "trainer",
        specialization: "Strength Training",
        experience: 5,
        bio: "Professional trainer with 5 years of experience",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      setProfile({
        id: "client-mock-id",
        email: "client@example.com",
        name: "Demo Client",
        role: "client",
        goals: ["Weight Loss", "Muscle Gain"],
        experience_level: "intermediate",
        activity_level: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { data: null, error: null };
  };

  const signOut = async () => {
    console.log("Sign out is temporarily disabled for demo purposes");
    // Don't actually sign out in demo mode
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
