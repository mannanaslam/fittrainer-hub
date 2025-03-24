
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Dumbbell, 
  Clock, 
  CalendarDays, 
  Flame, 
  Users, 
  Play, 
  ChevronDown, 
  ChevronUp,
  CheckCircle
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Sample exercise data
const exercises = [
  {
    id: 1,
    name: "Barbell Bench Press",
    sets: 4,
    reps: "8-10",
    restTime: "90 sec",
    videoUrl: "#",
    description: "Lie on a flat bench, grasp the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, and press it back up to the starting position."
  },
  {
    id: 2,
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: "10-12",
    restTime: "60 sec",
    videoUrl: "#",
    description: "Set an adjustable bench to a 30-45 degree angle. Hold a dumbbell in each hand at shoulder level, press upwards until your arms are extended, then lower back down."
  },
  {
    id: 3,
    name: "Cable Flyes",
    sets: 3,
    reps: "12-15",
    restTime: "60 sec",
    videoUrl: "#",
    description: "Stand in the middle of a cable machine with cables set at shoulder height. With a slight bend in your elbows, bring your hands together in front of your chest."
  },
  {
    id: 4,
    name: "Tricep Pushdowns",
    sets: 3,
    reps: "12-15",
    restTime: "45 sec",
    videoUrl: "#",
    description: "Using a cable machine with a straight or V-bar attachment, push the bar down by extending your elbows until your arms are straight, then return to the starting position."
  },
  {
    id: 5,
    name: "Overhead Tricep Extension",
    sets: 3,
    reps: "10-12",
    restTime: "45 sec",
    videoUrl: "#",
    description: "Hold a dumbbell with both hands above your head. Lower the weight behind your head by bending your elbows, then extend your arms to return to the starting position."
  }
];

const WorkoutPlan = () => {
  const [openExercise, setOpenExercise] = useState<number | null>(null);
  
  const toggleExercise = (id: number) => {
    setOpenExercise(openExercise === id ? null : id);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Strength</Badge>
                  <Badge className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-0">Intermediate</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">Upper Body Power Workout</h1>
                <p className="text-muted-foreground mb-4">
                  A comprehensive chest and tricep workout designed to build strength and muscle mass. 
                  This workout targets all areas of the chest as well as the triceps for balanced upper body development.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>5 Exercises</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>45 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>2-3 times per week</span>
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>350-450 calories</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>1,245 users</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Exercise List</h2>
                
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <Collapsible 
                      key={exercise.id} 
                      open={openExercise === exercise.id}
                      onOpenChange={() => toggleExercise(exercise.id)}
                      className="border rounded-lg overflow-hidden"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/50 text-left">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                            {exercise.id}
                          </div>
                          <div>
                            <h3 className="font-medium">{exercise.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                        </div>
                        {openExercise === exercise.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 pt-0 border-t">
                          <div className="aspect-video bg-muted rounded-lg relative flex items-center justify-center mb-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button size="icon" className="rounded-full bg-primary/90 hover:bg-primary w-12 h-12">
                                <Play className="h-5 w-5 text-white ml-1" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-secondary/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">Sets</p>
                              <p className="text-lg font-medium">{exercise.sets}</p>
                            </div>
                            <div className="bg-secondary/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">Reps</p>
                              <p className="text-lg font-medium">{exercise.reps}</p>
                            </div>
                            <div className="bg-secondary/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">Rest</p>
                              <p className="text-lg font-medium">{exercise.restTime}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Instructions</h4>
                            <p className="text-muted-foreground text-sm">{exercise.description}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Mark Complete</Button>
                            <Button size="sm">Log Set</Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card rounded-xl border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <span className="text-sm font-medium">2/5</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">Barbell Bench Press</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">Incline Dumbbell Press</span>
                  </div>
                  <div className="flex items-center opacity-50">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Cable Flyes</span>
                  </div>
                  <div className="flex items-center opacity-50">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Tricep Pushdowns</span>
                  </div>
                  <div className="flex items-center opacity-50">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span className="text-sm">Overhead Tricep Extension</span>
                  </div>
                </div>
                
                <Button className="w-full">Continue Workout</Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkoutPlan;
