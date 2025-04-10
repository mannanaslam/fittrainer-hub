
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientDetails from "@/pages/ClientDetails";
import CreateSubscription from "@/pages/CreateSubscription";
import CreateMealPlan from "@/pages/CreateMealPlan";
import CreateWorkout from "@/pages/CreateWorkout";
import WorkoutPlan from "@/pages/WorkoutPlan";
import Exercises from "@/pages/Exercises";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { requireAuth } = useAuth();
  return requireAuth(children);
};

// We need this wrapper because useAuth can only be used inside the AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientDetails /></ProtectedRoute>} />
      <Route path="/subscription/create" element={<ProtectedRoute><CreateSubscription /></ProtectedRoute>} />
      <Route path="/meal-plan/create" element={<ProtectedRoute><CreateMealPlan /></ProtectedRoute>} />
      <Route path="/workout-plan/create" element={<ProtectedRoute><CreateWorkout /></ProtectedRoute>} />
      <Route path="/workout-plan/:id" element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
