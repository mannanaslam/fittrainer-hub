
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useContext } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import WorkoutPlan from "./pages/WorkoutPlan";
import CreateWorkout from "./pages/CreateWorkout";
import CreateMealPlan from "./pages/CreateMealPlan";
import CreateSubscription from "./pages/CreateSubscription";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";

const queryClient = new QueryClient();

// Update auth context with Supabase types and profile
export const AuthContext = createContext<ReturnType<typeof useSupabaseAuth>>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  
  // If still loading, show nothing
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // For demo purposes, we'll still allow access without authentication
  // In a real app, you'd use this:
  // return user ? children : <Navigate to="/login" />;
  return <>{children}</>;
};

const App = () => {
  const auth = useSupabaseAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={auth}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/workout/:id" element={
                <ProtectedRoute>
                  <WorkoutPlan />
                </ProtectedRoute>
              } />
              <Route path="/workout/create" element={
                <ProtectedRoute>
                  <CreateWorkout />
                </ProtectedRoute>
              } />
              <Route path="/meal-plan/create" element={
                <ProtectedRoute>
                  <CreateMealPlan />
                </ProtectedRoute>
              } />
              <Route path="/subscription/create" element={
                <ProtectedRoute>
                  <CreateSubscription />
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="/clients/:id" element={
                <ProtectedRoute>
                  <ClientDetails />
                </ProtectedRoute>
              } />
              
              {/* Placeholder routes for footer links */}
              <Route path="/help" element={<NotFound />} />
              <Route path="/blog" element={<NotFound />} />
              <Route path="/tutorials" element={<NotFound />} />
              <Route path="/about" element={<NotFound />} />
              <Route path="/careers" element={<NotFound />} />
              <Route path="/contact" element={<NotFound />} />
              <Route path="/privacy" element={<NotFound />} />
              <Route path="/terms" element={<NotFound />} />
              <Route path="/cookies" element={<NotFound />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
