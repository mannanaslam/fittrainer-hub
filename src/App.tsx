
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

// Pages
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
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={requireAuth(<Dashboard />)} />
      <Route path="/profile" element={requireAuth(<Profile />)} />
      <Route path="/clients" element={requireAuth(<Clients />)} />
      <Route path="/clients/:id" element={requireAuth(<ClientDetails />)} />
      <Route path="/create-workout" element={requireAuth(<CreateWorkout />)} />
      <Route path="/workout/:id" element={requireAuth(<WorkoutPlan />)} />
      <Route path="/edit-workout/:id" element={requireAuth(<EditWorkout />)} />
      <Route path="/create-meal-plan" element={requireAuth(<CreateMealPlan />)} />
      <Route path="/meal-plan/create" element={requireAuth(<CreateMealPlan />)} />
      <Route path="/create-subscription" element={requireAuth(<CreateSubscription />)} />
      <Route path="/exercises" element={requireAuth(<Exercises />)} />
      <Route path="/messages" element={requireAuth(<Messaging />)} />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
