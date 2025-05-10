
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth"; // Import from hooks
import { Toaster } from "sonner";
import { ReactNode } from "react";

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

// ProtectedRoute component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { requireAuth } = useAuth();
  return requireAuth(children);
}

// Separate component for routes to ensure hooks are used properly
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
      <Route path="/create-workout" element={<ProtectedRoute><CreateWorkout /></ProtectedRoute>} />
      <Route path="/workout/:id" element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />
      <Route path="/edit-workout/:id" element={<ProtectedRoute><EditWorkout /></ProtectedRoute>} />
      <Route path="/create-meal-plan" element={<ProtectedRoute><CreateMealPlan /></ProtectedRoute>} />
      <Route path="/meal-plan/create" element={<ProtectedRoute><CreateMealPlan /></ProtectedRoute>} />
      <Route path="/create-subscription" element={<ProtectedRoute><CreateSubscription /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
