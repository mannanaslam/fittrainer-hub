
import { createContext, ReactNode } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate, useLocation } from "react-router-dom";

type AuthContextType = {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  requireAuth: (children: ReactNode) => JSX.Element;
};

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => {},
  requireAuth: () => <></>,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  } = useSupabaseAuth();

  // Function to require authentication for protected routes
  const requireAuth = (children: ReactNode) => {
    const location = useLocation();
    
    if (loading) {
      // Show loading state while checking auth
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      // If not authenticated, redirect to login page with location state
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Check if profile exists for the authenticated user
    if (!profile && !loading) {
      console.log("User authenticated but no profile found, might need to recreate profile");
      // In a real app, you might want to handle this case better
    }
    
    // If authenticated, render the children
    console.log("User authenticated, rendering content");
    return <>{children}</>;
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
