
import { useAuth } from "@/hooks/useAuth";
import { ClientOverviewTab } from "./ClientOverviewTab";
import { TrainerOverviewTab } from "./TrainerOverviewTab";

export function OverviewTab() {
  const { profile } = useAuth();
  const isTrainer = profile?.role === 'trainer';
  
  return isTrainer ? <TrainerOverviewTab /> : <ClientOverviewTab />;
}
