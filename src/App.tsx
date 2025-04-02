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
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/subscription/create" element={<CreateSubscription />} />
        <Route path="/meal-plan/create" element={<CreateMealPlan />} />
        <Route path="/workout-plan/create" element={<CreateWorkout />} />
        <Route path="/workout-plan/:id" element={<WorkoutPlan />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
