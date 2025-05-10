
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { WorkoutFormData } from "@/components/workout/types";
import { createWorkout } from "@/lib/supabase";

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveWorkout = async (data: WorkoutFormData, status: 'draft' | 'published') => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save a workout", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Determine client_id based on the user role
      let clientId = null;
      
      if (profile?.role === 'trainer') {
        // For trainers, client_id can be selected or null for template workouts
        clientId = data.clientId || null;
      } else {
        // For clients, their own ID is used
        clientId = user.id;
      }
      
      console.log("Creating workout with trainer_id:", profile?.role === 'trainer' ? user.id : null, "and client_id:", clientId);

      // Format exercises data for Supabase
      const formattedExercises = data.exercises.map(exercise => ({
        name: exercise.name,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps),
        weight: exercise.weight ? parseInt(exercise.weight) : undefined,
        duration: exercise.duration ? parseInt(exercise.duration) : undefined,
        notes: exercise.notes,
        restTime: exercise.restTime ? parseInt(exercise.restTime) : undefined,
        videoUrl: exercise.videoUrl || undefined
      }));

      // Create workout object for database
      const workoutData = {
        title: data.title,
        description: data.description,
        trainer_id: profile?.role === 'trainer' ? user.id : null,
        client_id: clientId,
        exercises: formattedExercises
      };

      // Save to database
      const savedWorkout = await createWorkout(workoutData);
      
      if (!savedWorkout) {
        throw new Error("Failed to save workout");
      }

      toast({
        title: status === 'published' ? "Workout Published" : "Draft Saved",
        description: status === 'published' ? "Your workout has been published successfully" : "Your workout has been saved as draft"
      });

      if (status === 'published') {
        navigate(`/workout-plan/${savedWorkout.id}`);
      } else {
        navigate('/dashboard?tab=workouts');
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
