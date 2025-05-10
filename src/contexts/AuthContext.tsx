import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
  requireAuth: (children: React.ReactNode) => React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => ({ data: null, error: new Error("Auth not initialized") }),
  signUp: async () => ({ data: null, error: new Error("Auth not initialized") }),
  signOut: async () => {},
  requireAuth: (children) => children,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (error) throw error;
        setUser(user);
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          setProfile(profileData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get current user'));
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to sign in') };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to sign up') };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
    }
  };

  const requireAuth = (children: React.ReactNode) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      navigate('/login');
      return null;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signUp, signOut, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
