
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }

      console.log("Profile data:", data);
      return data as Profile;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  };

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
          const userProfile = await fetchProfile(newSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession?.user?.id);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        const userProfile = await fetchProfile(initialSession.user.id);
        setProfile(userProfile);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      console.log("Signing up user:", email, userData);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        return { data, error };
      } 
      
      console.log("Sign up successful:", data);
      
      // Create profile record directly if the trigger doesn't kick in
      // This is a safety measure
      if (data.user) {
        console.log("Creating profile record for user:", data.user.id);
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            role: userData.userType,
            ...(userData.userType === 'trainer' ? {
              specialization: userData.specialization,
              experience: userData.experience,
              bio: userData.bio,
            } : {
              goals: userData.goals,
              experience_level: userData.experienceLevel,
              activity_level: userData.activityLevel,
            }),
            subscription_plan: userData.plan
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast({
            title: "Profile creation issue",
            description: "Your account was created but there was an issue with your profile. Please contact support.",
            variant: "destructive"
          });
        } else {
          console.log("Profile created successfully");
        }
      }
      
      toast({
        title: "Signup successful",
        description: "Please check your email to confirm your account."
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Error in signUp:", error);
      
      const authError = error as AuthError;
      toast({
        title: "Signup failed",
        description: authError.message || "An unknown error occurred",
        variant: "destructive"
      });
      
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Signing in with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { data: null, error };
      } 
      
      console.log("Sign in successful:", data?.user?.id);
      
      // Fetch profile after successful sign in
      if (data?.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in."
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Error in signIn:", error);
      
      const authError = error as AuthError;
      toast({
        title: "Login failed",
        description: authError.message || "An unknown error occurred",
        variant: "destructive"
      });
      
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Error in signOut:", error);
      
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
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
};
