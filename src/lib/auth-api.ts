
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';
import type { AuthError } from '@supabase/supabase-js';

// Fetch user profile data
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as Profile;
  } catch (error) {
    return null;
  }
};

// Sign up a new user
export const signUpUser = async (
  email: string, 
  password: string, 
  userData: Record<string, any>
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name || '',
          userType: userData.userType || 'client',
          ...userData
        }
      }
    });
    
    if (error) {
      return { data, error };
    } 
    
    // Create profile record directly if the trigger doesn't kick in
    if (data.user) {
      try {
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
        
        await supabase
          .from('profiles')
          .upsert(profileData);
      } catch (profileErr) {
        // Handle silently
      }
    }
    
    return { data, error: null };
  } catch (error) {
    const authError = error as AuthError;
    return { data: null, error: authError };
  }
};

// Sign in an existing user
export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { data: null, error };
    } 
    
    return { data, error: null };
  } catch (error) {
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
    return { error };
  }
};
