
import { useAuth } from "@/hooks/useAuth";
import { ClientOverviewTab } from "./ClientOverviewTab";
import { TrainerOverviewTab } from "./TrainerOverviewTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function OverviewTab() {
  const { profile, user, loading } = useAuth();
  
  // If still loading profile/auth data, show a loading state
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // If user is authenticated but profile is missing, show an alert
  if (user && !profile) {
    return (
      <div className="p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Profile Missing</AlertTitle>
          <AlertDescription>
            We couldn't load your profile information. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
        
        {/* Default to ClientOverviewTab when profile is missing */}
        <ClientOverviewTab />
      </div>
    );
  }
  
  const isTrainer = profile?.role === 'trainer';
  return isTrainer ? <TrainerOverviewTab /> : <ClientOverviewTab />;
}
