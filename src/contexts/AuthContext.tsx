
import { createContext, ReactNode, useContext } from "react";
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useSupabaseAuth();
  const {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  } = auth;
  
  console.log("AuthProvider loading:", loading, "user:", user ? "exists" : "null");
  
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
