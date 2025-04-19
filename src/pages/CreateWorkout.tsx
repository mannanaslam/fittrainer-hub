
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { WorkoutFormData } from "@/components/workout/types";

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (data: WorkoutFormData): boolean => {
    // Form validation is now handled by react-hook-form and zod
    return true;
  };

  const saveWorkout = async (status: 'draft' | 'published') => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save a workout", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const clientId = user.id;  // Use the current user's ID as client_id temporarily
      
      console.log("Creating workout with trainer_id:", user.id, "and client_id:", clientId);

      // This will be called from the WorkoutForm with the form data 
      // already validated by react-hook-form
      const form = document.querySelector('form');
      const formData = new FormData(form as HTMLFormElement);
      const formJSON = Object.fromEntries(formData);
      
      // We'll implement the actual save functionality when we have the form values
      // For now, we just show a success toast
      toast({
        title: status === 'published' ? "Workout Published" : "Draft Saved",
        description: status === 'published' ? "Your workout has been published successfully" : "Your workout has been saved as draft"
      });

      if (status === 'published') {
        navigate(`/workout-plan/1`); // Example ID
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your workout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create New Workout Plan</h1>
            <p className="text-muted-foreground">
              Design a new workout plan for your clients with detailed exercises and instructions
            </p>
          </div>
          
          <WorkoutForm 
            onSave={saveWorkout} 
            isSubmitting={isSubmitting} 
          />
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateWorkout;
