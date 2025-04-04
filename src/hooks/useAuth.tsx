
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Helper function to require authentication
  const requireAuth = (children: React.ReactNode) => {
    const { user, loading } = context;
    
    if (loading) {
      // Return a loading state while checking authentication
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  return {
    ...context,
    requireAuth
  };
};
