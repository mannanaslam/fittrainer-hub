
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getWorkoutById, deleteWorkout } from "@/lib/supabase/workouts";
import { getUserProfileById } from "@/lib/supabase/profiles";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Workout, Profile } from "@/types/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WorkoutPlan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [clientProfile, setClientProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        const workoutData = await getWorkoutById(id);
        if (workoutData) {
          setWorkout(workoutData);
          
          // Fetch client profile if this is a trainer viewing an assigned workout
          if (workoutData.client_id && profile?.role === 'trainer') {
            const client = await getUserProfileById(workoutData.client_id);
            setClientProfile(client);
          }
        } else {
          toast({
            title: "Not Found",
            description: "The requested workout could not be found",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast({
          title: "Error",
          description: "Failed to load workout details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkout();
  }, [id, navigate, profile]);

  const handleDelete = async () => {
    if (!workout) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteWorkout(workout.id);
      if (success) {
        toast({
          title: "Workout Deleted",
          description: "The workout has been deleted successfully"
        });
        navigate('/dashboard?tab=workouts');
      } else {
        throw new Error("Failed to delete workout");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <Container>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Workout Not Found</h1>
              <p className="text-muted-foreground mb-6">The requested workout plan could not be found</p>
              <Button asChild>
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard?tab=workouts" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workouts
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{workout.title}</h1>
              <p className="text-muted-foreground">
                {workout.description || "No description provided"}
              </p>
            </div>
            
            {profile?.role === 'trainer' && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/workout-plan/edit/${workout.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the workout plan
                        {clientProfile && ` assigned to ${clientProfile.name}`}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
          {profile?.role === 'trainer' && clientProfile && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {clientProfile.name ? clientProfile.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <p className="font-medium">{clientProfile.name || 'Client'}</p>
                    <p className="text-sm text-muted-foreground">{clientProfile.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="bg-card border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Workout Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Exercises</p>
                <p className="font-medium text-lg">{exercises.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Exercise List</h2>
            <div className="space-y-6">
              {exercises.map((exercise: any, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <h3 className="font-medium">{exercise.name}</h3>
                    </div>
                  </div>
                  
                  {exercise.description && (
                    <p className="text-muted-foreground mb-3 text-sm">{exercise.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">
                      {exercise.sets} sets
                    </Badge>
                    <Badge variant="secondary">
                      {exercise.reps} reps
                    </Badge>
                    {exercise.weight && (
                      <Badge variant="secondary">
                        {exercise.weight} lbs
                      </Badge>
                    )}
                    {exercise.duration && (
                      <Badge variant="secondary">
                        {exercise.duration} sec
                      </Badge>
                    )}
                    {exercise.restTime && (
                      <Badge variant="outline">
                        Rest: {exercise.restTime} sec
                      </Badge>
                    )}
                  </div>
                  
                  {exercise.notes && (
                    <>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <span className="font-medium">Notes: </span>
                        {exercise.notes}
                      </div>
                    </>
                  )}
                  
                  {exercise.videoUrl && (
                    <>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <a 
                          href={exercise.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Watch demonstration video
                        </a>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {exercises.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No exercises added to this workout</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkoutPlan;
