import { useAuth as useAuthContext } from "@/contexts/AuthContext";

/**
 * Custom hook for authentication
 * Provides a safe wrapper around the context's useAuth
 */
export function useAuth() {
  try {
    // Attempt to use the auth context
    return useAuthContext();
  } catch (error) {
    // Return default values if used outside AuthProvider
    return {
      user: null,
      profile: null,
      loading: false,
      error: null,
      signIn: async () => ({ data: null, error: new Error("Auth not initialized") }),
      signUp: async () => ({ data: null, error: new Error("Auth not initialized") }),
      signOut: async () => {},
      requireAuth: (children) => children,
    };
  }
}
