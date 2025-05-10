import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { StatsCard } from "../cards/StatsCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getWorkouts } from "@/lib/supabase/workouts";
import { getMealPlans } from "@/lib/supabase/meal-plans";
import { Plus, ChevronRight, Dumbbell, Utensils, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClientOverviewTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeWorkouts: 0,
    completedWorkouts: 0,
    upcomingSessions: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch active workouts
        const workouts = await getWorkouts();
        const activeWorkouts = workouts?.length || 0;

        // Fetch meal plans
        const mealPlans = await getMealPlans();
        const completedWorkouts = mealPlans?.length || 0;

        setStats({
          activeWorkouts,
          completedWorkouts,
          upcomingSessions: 0, // TODO: Implement upcoming sessions
          unreadMessages: 0, // TODO: Implement unread messages
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <Container>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Active Workouts"
          value={stats.activeWorkouts.toString()}
        />
        <StatsCard
          label="Completed Workouts"
          value={stats.completedWorkouts.toString()}
        />
        <StatsCard
          label="Upcoming Sessions"
          value={stats.upcomingSessions.toString()}
        />
        <StatsCard
          label="Unread Messages"
          value={stats.unreadMessages.toString()}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Start Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate("/workouts")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Workout
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>View Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => navigate("/meal-plans")}
              >
                <Utensils className="mr-2 h-4 w-4" />
                View Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
