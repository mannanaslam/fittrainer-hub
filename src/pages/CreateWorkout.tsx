import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Video, 
  Clock, 
  MoveUp, 
  MoveDown,
  Info,
  Activity,
  Zap
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  restTime: string;
  videoUrl?: string;
}

interface WorkoutForm {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  frequency: string;
  workoutType: string;
  exercises: Exercise[];
}

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workoutType, setWorkoutType] = useState("strength");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
  const [workoutFrequency, setWorkoutFrequency] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "ex1",
      name: "",
      description: "",
      sets: "",
      reps: "",
      restTime: "",
    }
  ]);
  
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `ex${exercises.length + 1}`,
        name: "",
        description: "",
        sets: "",
        reps: "",
        restTime: "",
      }
    ]);
  };
  
  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };
  
  const moveExercise = (id: string, direction: "up" | "down") => {
    const index = exercises.findIndex(ex => ex.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === exercises.length - 1)
    ) {
      return;
    }
    
    const newExercises = [...exercises];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newExercises[index], newExercises[targetIndex]] = 
      [newExercises[targetIndex], newExercises[index]];
    
    setExercises(newExercises);
  };
  
  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(
      exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

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
      
      const { data: clients, error: clientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'client')
        .limit(1);
        
      if (clientError) {
        console.error('Error fetching clients:', clientError);
        throw new Error('Unable to fetch clients');
      }
      
      if (!clients || clients.length === 0) {
        toast({ 
          title: "Error", 
          description: "No clients found in the system. Please add a client first.", 
          variant: "destructive" 
        });
        return;
      }
      
      const clientId = clients[0].id;

      const workoutData = {
        trainer_id: user.id,
        client_id: clientId,
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
          
          <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Workout Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Upper Body Power Workout" 
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="e.g., 45" 
                    min="1"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={workoutDifficulty}
                    onChange={(e) => setWorkoutDifficulty(e.target.value)}
                  >
                    <option value="">Select difficulty level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Recommended Frequency</Label>
                  <Input 
                    id="frequency" 
                    placeholder="e.g., 2-3 times per week"
                    value={workoutFrequency}
                    onChange={(e) => setWorkoutFrequency(e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Describe the workout, its benefits, and who it's designed for..."
                    value={workoutDescription}
                    onChange={(e) => setWorkoutDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Workout Type</Label>
                <RadioGroup 
                  value={workoutType} 
                  onValueChange={setWorkoutType}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value="strength" 
                      id="strength" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="strength" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Dumbbell className="h-8 w-8 mb-2" />
                      <span className="font-medium">Strength</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="cardio" 
                      id="cardio" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="cardio" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Activity className="h-8 w-8 mb-2" />
                      <span className="font-medium">Cardio</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="flexibility" 
                      id="flexibility" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="flexibility" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Activity className="h-8 w-8 mb-2" />
                      <span className="font-medium">Flexibility</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="hiit" 
                      id="hiit" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="hiit" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Zap className="h-8 w-8 mb-2" />
                      <span className="font-medium">HIIT</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Exercises</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="max-w-xs">
                        Add all exercises for this workout. Order matters - clients will follow the exercises in the sequence shown here.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-6">
                {exercises.map((exercise, index) => (
                  <div 
                    key={exercise.id} 
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Exercise {index + 1}</h3>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveExercise(exercise.id, "up")}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveExercise(exercise.id, "down")}
                          disabled={index === exercises.length - 1}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeExercise(exercise.id)}
                          disabled={exercises.length === 1}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${exercise.id}`}>Exercise Name</Label>
                        <Input 
                          id={`name-${exercise.id}`} 
                          placeholder="e.g., Barbell Bench Press" 
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                        />
                      </div>
                      
                      <div className="md:flex md:space-x-4">
                        <div className="space-y-2 flex-1 mb-4 md:mb-0">
                          <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                          <Input 
                            id={`sets-${exercise.id}`} 
                            placeholder="e.g., 3" 
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, "sets", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 flex-1 mb-4 md:mb-0">
                          <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                          <Input 
                            id={`reps-${exercise.id}`} 
                            placeholder="e.g., 10-12" 
                            value={exercise.reps}
                            onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 flex-1">
                          <Label htmlFor={`rest-${exercise.id}`}>Rest</Label>
                          <Input 
                            id={`rest-${exercise.id}`} 
                            placeholder="e.g., 60 sec" 
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(exercise.id, "restTime", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${exercise.id}`}>Instructions</Label>
                        <textarea 
                          id={`description-${exercise.id}`} 
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                          placeholder="Step-by-step instructions on how to perform this exercise..."
                          value={exercise.description}
                          onChange={(e) => updateExercise(exercise.id, "description", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`video-${exercise.id}`}>
                          Video URL
                          <span className="text-xs text-muted-foreground ml-2">(optional)</span>
                        </Label>
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id={`video-${exercise.id}`} 
                              placeholder="Paste YouTube or direct video URL" 
                              className="pl-10"
                              value={exercise.videoUrl || ""}
                              onChange={(e) => updateExercise(exercise.id, "videoUrl", e.target.value)}
                            />
                          </div>
                          <Button variant="outline" type="button">
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addExercise} 
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => saveWorkout('draft')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button 
                onClick={() => saveWorkout('published')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Workout'}
              </Button>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateWorkout;
