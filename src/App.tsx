import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
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
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
      <Route path="/create-workout" element={<ProtectedRoute><CreateWorkout /></ProtectedRoute>} />
      <Route path="/workout/:id" element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />
      <Route path="/edit-workout/:id" element={<ProtectedRoute><EditWorkout /></ProtectedRoute>} />
      <Route path="/create-meal-plan" element={<ProtectedRoute><CreateMealPlan /></ProtectedRoute>} />
      <Route path="/subscription/create" element={<ProtectedRoute><CreateSubscription /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
