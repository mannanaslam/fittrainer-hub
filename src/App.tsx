
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

// Temporarily modified to allow access without authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Always render children regardless of authentication status
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
              
              {/* Now these routes are accessible without authentication */}
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
