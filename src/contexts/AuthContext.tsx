
import { createContext, ReactNode, useContext } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, useLocation } from "react-router-dom";
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<any>;
  signOut: () => Promise<void>;
  requireAuth: (children: ReactNode) => JSX.Element;
};

// Create context with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSupabaseAuth();
  
  const requireAuth = (children: ReactNode) => {
    const location = useLocation();
    
    if (auth.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!auth.user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
  };
  
  return (
    <AuthContext.Provider
      value={{
        ...auth,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
