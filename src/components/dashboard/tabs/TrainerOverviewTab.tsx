import { useState, useEffect } from "react";
import { Plus, Search, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "../cards/StatsCard";
import { ClientsTable } from "../tables/ClientsTable";
import { SubscriptionsTable } from "../tables/SubscriptionsTable";
import { useAuth } from "@/hooks/useAuth";
import { getAllClients } from "@/lib/supabase/profiles";
import { getWorkouts } from "@/lib/supabase/workouts";
import { getSubscriptionsWithPlanAndUser } from "@/lib/supabase/subscriptions";
import { Workout, Profile } from "@/types/supabase";

export function TrainerOverviewTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: "Total Clients", value: "0" },
    { label: "Active Plans", value: "0" },
    { label: "Revenue", value: "$0" },
    { label: "Completion Rate", value: "0%" },
  ]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          // Get clients
          const clients = await getAllClients();
          
          // Get workouts created by this trainer
          const workouts = await getWorkouts({ trainerId: user.id });
          
          // Get subscriptions
          const subscriptions = await getSubscriptionsWithPlanAndUser();
          
          // Set recent workouts
          setRecentWorkouts(workouts.slice(0, 3));
          
          // Calculate stats
          const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
          const totalRevenue = activeSubscriptions.reduce((acc, sub) => {
            // Extract numeric value from plan (assuming format like "19.99")
            const planPrice = parseFloat(sub.plan?.price || 0);
            return acc + planPrice;
          }, 0);
          
          // Update stats
          setStats([
            { label: "Total Clients", value: clients.length.toString() },
            { label: "Active Plans", value: activeSubscriptions.length.toString() },
            { label: "Revenue", value: `$${totalRevenue.toFixed(0)}` },
            { label: "Completion Rate", value: "87%" }, // This would need a more complex calculation based on workout completion
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);
  
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.email || 'Trainer'}</h1>
        <p className="text-muted-foreground">Here's what's happening with your clients today.</p>
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
      
      {/* Recent clients section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Clients</h2>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search clients..."
                className="pl-9 py-2 pr-4 rounded-lg border bg-background text-sm w-full max-w-xs"
              />
            </div>
            <Button size="sm" onClick={() => navigate("/clients/add")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Client
            </Button>
          </div>
        </div>
        
        <ClientsTable />
      </div>
      
      {/* Recent workouts preview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="glass-card rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-40 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
              </div>
            ))
          ) : recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <div key={workout.id} className="glass-card rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {workout.description?.toLowerCase().includes("cardio") ? "Cardio" : "Strength"}
                  </span>
                  <h3 className="font-medium mt-2 mb-1">{workout.title}</h3>
                  <p className="text-sm text-muted-foreground">{workout.exercises?.length || 0} exercises • 45 min</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 glass-card rounded-xl">
              <p className="text-muted-foreground">No workouts available. Create your first workout.</p>
              <Button className="mt-4" size="sm" onClick={() => navigate("/workout-plan/create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create Workout
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscriptions section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/subscription/create")}>
            <Plus className="h-4 w-4 mr-1" />
            New Plan
          </Button>
        </div>
        <SubscriptionsTable />
      </div>
    </Container>
  );
}
