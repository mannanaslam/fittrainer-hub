
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { requireAuth } = useAuth();
  
  return requireAuth(<DashboardComponent />);
};

export default Dashboard;
