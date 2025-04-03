
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { StatsCard } from "../cards/StatsCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getWorkouts, getMealPlans } from "@/lib/supabase";
import { Plus, ChevronRight, Dumbbell, Utensils, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ClientOverviewTab() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Workouts Completed", value: "0" },
    { label: "Current Streak", value: "0 days" },
    { label: "Calories Burned", value: "0" },
    { label: "Weekly Goal", value: "0%" },
  ]);
  const [upcomingWorkout, setUpcomingWorkout] = useState(null);
  const [upcomingMeal, setUpcomingMeal] = useState(null);
  
  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        if (profile?.id) {
          // Get client's workouts
          const workouts = await getWorkouts({ clientId: profile.id });
          
          // Get client's meal plans
          const mealPlans = await getMealPlans({ clientId: profile.id });
          
          // Set most recent workout as upcoming (in a real app, you'd filter by date)
          if (workouts.length > 0) {
            setUpcomingWorkout(workouts[0]);
          }
          
          // Set most recent meal plan as upcoming
          if (mealPlans.length > 0) {
            setUpcomingMeal(mealPlans[0]);
          }
          
          // In a real app, we'd calculate these values from actual data
          setStats([
            { label: "Workouts Completed", value: `${Math.min(workouts.length, 12)}` },
            { label: "Current Streak", value: "3 days" },
            { label: "Calories Burned", value: "1,240" },
            { label: "Weekly Goal", value: "68%" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [profile]);
  
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.name || 'Client'}</h1>
        <p className="text-muted-foreground">Your fitness journey is waiting. Here's what's up today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="glass-card rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))
        )}
      </div>
      
      {/* Today's Schedule */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Schedule</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard?tab=schedule")}>
            View Full Schedule <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upcoming Workout */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Today's Workout</h3>
            </div>
            
            {upcomingWorkout ? (
              <div>
                <h4 className="text-lg font-semibold mb-1">{upcomingWorkout.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{upcomingWorkout.description}</p>
                <div className="flex justify-between">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">45 minutes</span>
                  <Button size="sm" onClick={() => navigate(`/workout-plan/${upcomingWorkout.id}`)}>
                    Start Workout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-3">No workout scheduled for today</p>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard?tab=workouts")}>
                  Browse Workouts
                </Button>
              </div>
            )}
          </div>
          
          {/* Today's Meals */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium">Today's Meals</h3>
            </div>
            
            {upcomingMeal ? (
              <div>
                <h4 className="text-lg font-semibold mb-1">{upcomingMeal.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{upcomingMeal.description}</p>
                <div className="flex justify-between">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">3 meals planned</span>
                  <Button size="sm" onClick={() => navigate("/dashboard?tab=meals")}>
                    View Meal Plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-3">No meal plan available</p>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard?tab=meals")}>
                  View Meal Options
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard?tab=schedule")}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-48 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No upcoming sessions scheduled</p>
              <Button variant="outline" onClick={() => navigate("/dashboard?tab=schedule")}>
                <Plus className="h-4 w-4 mr-2" />
                Book a Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
