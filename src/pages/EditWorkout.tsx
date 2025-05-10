
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { WorkoutForm } from "@/components/workout/WorkoutForm";
import { WorkoutFormData } from "@/components/workout/types";
import { getWorkoutById, updateWorkout } from "@/lib/supabase";
import { Workout } from "@/types/supabase";

const EditWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState<WorkoutFormData | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        const workoutData = await getWorkoutById(id);
        
        if (!workoutData) {
          toast({
            title: "Workout Not Found",
            description: "The requested workout could not be found",
            variant: "destructive"
          });
          navigate('/dashboard?tab=workouts');
          return;
        }
        
        // Check if user has permission to edit this workout
        if (
          profile?.role === 'trainer' && workoutData.trainer_id !== user?.id ||
          profile?.role === 'client' && workoutData.client_id !== user?.id
        ) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to edit this workout",
            variant: "destructive"
          });
          navigate('/dashboard?tab=workouts');
          return;
        }
        
        setWorkout(workoutData);
        
        // Format data for the form
        if (workoutData.exercises && Array.isArray(workoutData.exercises)) {
          const exercises = workoutData.exercises.map((exercise: any, index) => ({
            id: `ex${index + 1}`,
            name: exercise.name || "",
            description: exercise.description || "",
            sets: exercise.sets?.toString() || "",
            reps: exercise.reps?.toString() || "",
            weight: exercise.weight?.toString() || "",
            duration: exercise.duration?.toString() || "",
            restTime: exercise.restTime?.toString() || "",
            videoUrl: exercise.videoUrl || "",
            notes: exercise.notes || ""
          }));
          
          setFormData({
            title: workoutData.title || "",
            description: workoutData.description || "",
            clientId: workoutData.client_id || "",
            workoutType: (workoutData as any).workoutType || "strength",
            difficulty: (workoutData as any).difficulty || "",
            duration: (workoutData as any).duration || "",
            frequency: (workoutData as any).frequency || "",
            exercises
          });
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast({
          title: "Error",
          description: "Failed to load workout details",
          variant: "destructive"
        });
        navigate('/dashboard?tab=workouts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id, navigate, user, profile]);

  const saveWorkout = async (data: WorkoutFormData, status: 'draft' | 'published') => {
    if (!user || !workout) {
      toast({ title: "Error", description: "Unable to update workout", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Determine client_id based on the user role and form data
      let clientId = workout.client_id;
      
      if (profile?.role === 'trainer') {
        // For trainers, client_id can be selected or null for template workouts
        clientId = data.clientId || null;
      }
      
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
        client_id: clientId,
        exercises: formattedExercises,
        // Include any metadata from the form
        workoutType: data.workoutType,
        difficulty: data.difficulty,
        duration: data.duration,
        frequency: data.frequency
      };

      // Update in database
      const updatedWorkout = await updateWorkout(workout.id, workoutData);
      
      if (!updatedWorkout) {
        throw new Error("Failed to update workout");
      }

      toast({
        title: "Workout Updated",
        description: "Your workout has been updated successfully"
      });

      navigate(`/workout-plan/${workout.id}`);
    } catch (error) {
      console.error('Error updating workout:', error);
      toast({
        title: "Error",
        description: "There was a problem updating your workout. Please try again.",
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
            <Link to={`/workout-plan/${id}`} className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workout
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Edit Workout Plan</h1>
            <p className="text-muted-foreground">
              Update your workout plan details and exercises
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : formData ? (
            <WorkoutForm 
              onSave={saveWorkout} 
              isSubmitting={isSubmitting}
              defaultValues={formData}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load workout data</p>
            </div>
          )}
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditWorkout;
