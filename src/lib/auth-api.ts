
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import type { AuthError } from '@supabase/supabase-js';

// Fetch user profile data
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
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

// Sign up a new user
export const signUpUser = async (email: string, password: string, userData: any) => {
  try {
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
      return { data, error };
    } 
    
    console.log("Sign up successful:", data);
    
    // Create profile record directly if the trigger doesn't kick in
    if (data.user) {
      console.log("Creating profile record for user:", data.user.id);
      
      // Create a properly structured profile object with all required fields
      const profileData = {
        id: data.user.id,
        email: data.user.email || email,
        name: userData.name || '',
        role: userData.userType || 'client',
        subscription_plan: userData.plan || 'free'
      };
      
      // Add user type specific fields
      if (userData.userType === 'trainer') {
        Object.assign(profileData, {
          specialization: userData.specialization || '',
          experience: userData.experience || 0,
          bio: userData.bio || '',
        });
      } else {
        Object.assign(profileData, {
          goals: userData.goals || [],
          experience_level: userData.experienceLevel || '',
          activity_level: userData.activityLevel || 0,
        });
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        return { data, error: profileError };
      } else {
        console.log("Profile created successfully");
      }
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Error in signUp:", error);
    
    const authError = error as AuthError;
    return { data: null, error: authError };
  }
};

// Sign in an existing user
export const signInUser = async (email: string, password: string) => {
  try {
    console.log("Signing in with:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    } 
    
    console.log("Sign in successful:", data?.user?.id);
    return { data, error: null };
  } catch (error) {
    console.error("Error in signIn:", error);
    
    const authError = error as AuthError;
    return { data: null, error: authError };
  }
};

// Sign out the current user
export const signOutUser = async () => {
  try {
    await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    console.error("Error in signOut:", error);
    return { error };
  }
};
