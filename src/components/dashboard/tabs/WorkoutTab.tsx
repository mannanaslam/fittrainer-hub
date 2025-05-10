import { useState, useEffect } from "react";
import { Plus, Filter, Search, Trash2, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { getWorkouts } from "@/lib/supabase/workouts";
import { Workout } from "@/types/supabase";

export function WorkoutTab() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'assigned' | 'templates'>('all');

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        let fetchedWorkouts: Workout[] = [];
        
        if (profile?.role === 'trainer') {
          // Trainers see workouts they created
          fetchedWorkouts = await getWorkouts({ trainerId: user?.id });
        } else {
          // Clients see workouts assigned to them
          fetchedWorkouts = await getWorkouts({ clientId: user?.id });
        }
        
        setWorkouts(fetchedWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        toast({
          title: "Error",
          description: "Failed to load workouts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user, profile]);

  const filteredWorkouts = workouts.filter(workout => {
    // Filter by search term
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (workout.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by type (for trainers only)
    if (profile?.role === 'trainer') {
      if (activeFilter === 'assigned') {
        return matchesSearch && workout.client_id !== null;
      } else if (activeFilter === 'templates') {
        return matchesSearch && workout.client_id === null;
      }
    }
    
    return matchesSearch;
  });

  const handleCreateWorkout = () => {
    navigate("/workout-plan/create");
  };
  
  const handleViewWorkout = (id: string) => {
    navigate(`/workout-plan/${id}`);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workout Plans</h1>
          <p className="text-muted-foreground">
            {profile?.role === 'trainer' 
              ? "Create and manage workout plans for your clients" 
              : "View and track your assigned workout plans"}
          </p>
        </div>
        
        {profile?.role === 'trainer' && (
          <Button onClick={handleCreateWorkout}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        )}
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search workouts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {profile?.role === 'trainer' && (
          <Tabs 
            defaultValue="all" 
            className="w-full sm:w-auto"
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as 'all' | 'assigned' | 'templates')}
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleViewWorkout(workout.id)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{workout.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {workout.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(workout.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {(workout.exercises as any[]).length} exercises
                    </Badge>
                    {workout.client_id === null && profile?.role === 'trainer' && (
                      <Badge variant="outline">Template</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/workout-plan/edit/${workout.id}`);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-lg font-medium mb-2">No workouts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? "Try a different search term" : profile?.role === 'trainer' 
              ? "Create your first workout plan to get started" 
              : "You don't have any assigned workouts yet"
            }
          </p>
          
          {profile?.role === 'trainer' && !searchTerm && (
            <Button onClick={handleCreateWorkout}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workout
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
