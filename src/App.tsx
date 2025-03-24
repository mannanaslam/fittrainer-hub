
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import WorkoutPlan from "./pages/WorkoutPlan";
import CreateWorkout from "./pages/CreateWorkout";
import CreateMealPlan from "./pages/CreateMealPlan";
import CreateSubscription from "./pages/CreateSubscription";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create auth context - this would be replaced with real auth from Supabase
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = { isAuthenticated: localStorage.getItem("isLoggedIn") === "true", isLoading: false };
  
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: localStorage.getItem("isLoggedIn") === "true",
    isLoading: false,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  });
  
  // Simulated auth methods - would be replaced with real auth
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple validation
    if (!email.includes('@') || password.length < 6) {
      throw new Error("Invalid credentials");
    }
    
    // Create mock user
    const user = {
      id: "user-1",
      email,
      name: email.split('@')[0],
      role: email.includes('trainer') ? 'trainer' : 'client'
    };
    
    // Store in localStorage (temporary, would use Supabase auth)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user
    });
  };
  
  const register = async (userData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create user
    const user = {
      id: "user-" + Math.floor(Math.random() * 1000),
      ...userData,
      role: userData.userType
    };
    
    // Store in localStorage (temporary, would use Supabase auth)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
    
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user
    });
  };
  
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ 
        ...authState, 
        login, 
        register, 
        logout
      }}>
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
