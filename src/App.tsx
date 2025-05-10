
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import CreateWorkout from "./pages/CreateWorkout";
import EditWorkout from "./pages/EditWorkout";
import WorkoutPlan from "./pages/WorkoutPlan";
import CreateMealPlan from "./pages/CreateMealPlan";
import CreateSubscription from "./pages/CreateSubscription";
import Exercises from "./pages/Exercises";
import Messaging from "./pages/Messaging"; // Add this import

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/workout-plan/create" element={<CreateWorkout />} />
          <Route path="/workout-plan/edit/:id" element={<EditWorkout />} />
          <Route path="/workout-plan/:id" element={<WorkoutPlan />} />
          <Route path="/meal-plan/create" element={<CreateMealPlan />} />
          <Route path="/subscription/create" element={<CreateSubscription />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/messaging/:contactId" element={<Messaging />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
