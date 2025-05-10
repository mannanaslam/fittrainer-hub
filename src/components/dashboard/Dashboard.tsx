
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { OverviewTab } from "./tabs/OverviewTab";
import { ClientsTab } from "./tabs/ClientsTab";
import { SubscriptionsTab } from "./tabs/SubscriptionsTab";
import { MealsTab } from "./tabs/MealsTab";
import { WorkoutTab } from "./tabs/WorkoutTab";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { ComingSoonTab } from "./tabs/ComingSoonTab";
import { useAuth } from "@/hooks/useAuth";
import { DashboardTabType } from "./TabTypes";

export function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTabType>('overview');
  const { profile, loading } = useAuth();
  
  // Determine if user is a trainer
  const isTrainer = profile?.role === 'trainer';

  // Parse tab from URL on component mount and when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab") as DashboardTabType;
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Render appropriate tab based on active tab and user role
  const renderTab = () => {
    // Common tabs for both user types
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'workouts':
        return <WorkoutTab />;
      case 'meals':
        return <MealsTab />;
      case 'schedule':
        return <ScheduleTab />;
      case 'messages':
        return <ComingSoonTab tabName="messages" />;
      case 'settings':
        return <ComingSoonTab tabName="settings" />;
    }

    // Trainer-specific tabs
    if (isTrainer) {
      switch (activeTab) {
        case 'clients':
          return <ClientsTab />;
        case 'subscriptions':
          return <SubscriptionsTab />;
        case 'analytics':
          return <AnalyticsTab />;
      }
    } 
    // Client-specific tabs
    else {
      switch (activeTab) {
        case 'progress':
          return <ComingSoonTab tabName="progress tracking" />;
        case 'health':
          return <ComingSoonTab tabName="health metrics" />;
        case 'profile':
          return <ComingSoonTab tabName="client profile" />;
      }
    }

    // Default fallback
    return <OverviewTab />;
  };

  return (
    <DashboardLayout>
      {renderTab()}
    </DashboardLayout>
  );
}
