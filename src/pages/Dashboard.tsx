
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { loading } = useAuth();
  
  return (
    <DashboardComponent />
  );
};

export default Dashboard;
