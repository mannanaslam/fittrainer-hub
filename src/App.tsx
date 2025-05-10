
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ClientDetails from "@/pages/ClientDetails";
import CreateWorkout from "@/pages/CreateWorkout";
import EditWorkout from "@/pages/EditWorkout";
import CreateMealPlan from "@/pages/CreateMealPlan";
import CreateSubscription from "@/pages/CreateSubscription";
import WorkoutPlan from "@/pages/WorkoutPlan";
import Exercises from "@/pages/Exercises";
import Messaging from "@/pages/Messaging";
import Clients from "@/pages/Clients";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}

// Separate component for routes to ensure hooks are used properly
function AppRoutes() {
  const { requireAuth } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route 
        path="/dashboard" 
        element={<RequireAuth><Dashboard /></RequireAuth>} 
      />
      <Route 
        path="/profile" 
        element={<RequireAuth><Profile /></RequireAuth>} 
      />
      <Route 
        path="/clients" 
        element={<RequireAuth><Clients /></RequireAuth>} 
      />
      <Route 
        path="/clients/:id" 
        element={<RequireAuth><ClientDetails /></RequireAuth>} 
      />
      <Route 
        path="/create-workout" 
        element={<RequireAuth><CreateWorkout /></RequireAuth>} 
      />
      <Route 
        path="/workout/:id" 
        element={<RequireAuth><WorkoutPlan /></RequireAuth>} 
      />
      <Route 
        path="/edit-workout/:id" 
        element={<RequireAuth><EditWorkout /></RequireAuth>} 
      />
      <Route 
        path="/create-meal-plan" 
        element={<RequireAuth><CreateMealPlan /></RequireAuth>} 
      />
      <Route 
        path="/create-subscription" 
        element={<RequireAuth><CreateSubscription /></RequireAuth>} 
      />
      <Route 
        path="/exercises" 
        element={<RequireAuth><Exercises /></RequireAuth>} 
      />
      <Route 
        path="/messages" 
        element={<RequireAuth><Messaging /></RequireAuth>} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Auth guard component
function RequireAuth({ children }: { children: JSX.Element }) {
  const { requireAuth } = useAuth();
  return requireAuth(children);
}

export default App;
