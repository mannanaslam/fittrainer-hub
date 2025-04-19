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

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    if (!workoutName.trim()) {
      toast({ title: "Error", description: "Workout name is required", variant: "destructive" });
      return false;
    }

    if (!workoutDescription.trim()) {
      toast({ title: "Error", description: "Workout description is required", variant: "destructive" });
      return false;
    }

    if (!workoutDuration.trim()) {
      toast({ title: "Error", description: "Workout duration is required", variant: "destructive" });
      return false;
    }

    if (!workoutDifficulty) {
      toast({ title: "Error", description: "Difficulty level is required", variant: "destructive" });
      return false;
    }

    for (const exercise of exercises) {
      if (!exercise.name.trim()) {
        toast({ title: "Error", description: "All exercises must have a name", variant: "destructive" });
        return false;
      }
      if (!exercise.sets.trim()) {
        toast({ title: "Error", description: `Sets are required for exercise: ${exercise.name}`, variant: "destructive" });
        return false;
      }
      if (!exercise.reps.trim()) {
        toast({ title: "Error", description: `Reps are required for exercise: ${exercise.name}`, variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const saveWorkout = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save a workout", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const clientId = user.id;  // Use the current user's ID as client_id temporarily
      
      console.log("Creating workout with trainer_id:", user.id, "and client_id:", clientId);

      const workoutData = {
        trainer_id: user.id,
        client_id: clientId, // Use the current user ID as client
        title: workoutName,
        description: workoutDescription,
        exercises: {
          workoutType,
          duration: workoutDuration,
          difficulty: workoutDifficulty,
          frequency: workoutFrequency,
          status,
          exercises: exercises.map(ex => ({
            name: ex.name,
            description: ex.description,
            sets: ex.sets,
            reps: ex.reps,
            restTime: ex.restTime,
            videoUrl: ex.videoUrl || ""
          }))
        }
      };

      const { data, error } = await supabase
        .from('workouts')
        .insert(workoutData)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      toast({
        title: status === 'published' ? "Workout Published" : "Draft Saved",
        description: status === 'published' ? "Your workout has been published successfully" : "Your workout has been saved as draft"
      });

      if (status === 'published' && data?.id) {
        navigate(`/workout-plan/${data.id}`);
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
  
  const [workoutType, setWorkoutType] = useState("strength");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
  const [workoutFrequency, setWorkoutFrequency] = useState("");
  const [exercises, setExercises] = useState([
    {
      id: "ex1",
      name: "",
      description: "",
      sets: "",
      reps: "",
      restTime: "",
    }
  ]);
  
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
            workoutName={workoutName}
            workoutDescription={workoutDescription}
            workoutDuration={workoutDuration}
            workoutDifficulty={workoutDifficulty}
            workoutFrequency={workoutFrequency}
            workoutType={workoutType}
            exercises={exercises}
            setWorkoutName={setWorkoutName}
            setWorkoutDescription={setWorkoutDescription}
            setWorkoutDuration={setWorkoutDuration}
            setWorkoutDifficulty={setWorkoutDifficulty}
            setWorkoutFrequency={setWorkoutFrequency}
            setWorkoutType={setWorkoutType}
            setExercises={setExercises}
          />
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateWorkout;
