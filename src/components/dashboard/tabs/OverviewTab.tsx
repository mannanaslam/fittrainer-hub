
import { Plus, Search, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "../cards/StatsCard";
import { ClientsTable } from "../tables/ClientsTable";
import { SubscriptionsTable } from "../tables/SubscriptionsTable";

// Sample stats data
const stats = [
  { label: "Total Clients", value: "24" },
  { label: "Active Plans", value: "18" },
  { label: "Revenue", value: "$3,240" },
  { label: "Completion Rate", value: "87%" },
];

export function OverviewTab() {
  const navigate = useNavigate();
  
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Trainer</h1>
        <p className="text-muted-foreground">Here's what's happening with your clients today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} label={stat.label} value={stat.value} />
        ))}
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
          {[1, 2, 3].map((item) => (
            <div key={item} className="glass-card rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Strength</span>
                <h3 className="font-medium mt-2 mb-1">Upper Body Workout</h3>
                <p className="text-sm text-muted-foreground">12 exercises • 45 min</p>
              </div>
            </div>
          ))}
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
