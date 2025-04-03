
import { createContext, useState, useEffect, ReactNode } from "react";
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
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
      console.log("User not authenticated, redirecting to login");
      // If not authenticated, redirect to login page
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Check if profile exists for the authenticated user
    if (!profile && !loading) {
      console.log("User authenticated but no profile found, might need to recreate profile");
      // You could add logic here to recreate a profile if needed
    }
    
    // If authenticated, render the children
    console.log("User authenticated, rendering content");
    return <>{children}</>;
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log("Auth context state updated:", { user, profile, loading });
  }, [user, profile, loading]);

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
