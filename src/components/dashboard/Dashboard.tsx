import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
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

export function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, user, loading } = useAuth();
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const isTrainer = profile?.role === 'trainer';

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  if (activeTab === "overview") {
    return (
      <DashboardLayout>
        <OverviewTab />
      </DashboardLayout>
    );
  }
  
  if (activeTab === "workouts") {
    return (
      <DashboardLayout>
        <WorkoutTab />
      </DashboardLayout>
    );
  }
  
  if (activeTab === "meals") {
    return (
      <DashboardLayout>
        <MealsTab />
      </DashboardLayout>
    );
  }
  
  if (activeTab === "schedule") {
    return (
      <DashboardLayout>
        <ScheduleTab />
      </DashboardLayout>
    );
  }
  
  if (activeTab === "messages") {
    return (
      <DashboardLayout>
        <ComingSoonTab tabName="messages" />
      </DashboardLayout>
    );
  }
  
  if (activeTab === "settings") {
    return (
      <DashboardLayout>
        <ComingSoonTab tabName="settings" />
      </DashboardLayout>
    );
  }
  
  if (isTrainer) {
    if (activeTab === "clients") {
      return (
        <DashboardLayout>
          <ClientsTab />
        </DashboardLayout>
      );
    }
    
    if (activeTab === "subscriptions") {
      return (
        <DashboardLayout>
          <SubscriptionsTab />
        </DashboardLayout>
      );
    }
    
    if (activeTab === "analytics") {
      return (
        <DashboardLayout>
          <AnalyticsTab />
        </DashboardLayout>
      );
    }
  }
  
  if (!isTrainer) {
    if (activeTab === "progress") {
      return (
        <DashboardLayout>
          <ComingSoonTab tabName="progress tracking" />
        </DashboardLayout>
      );
    }
    
    if (activeTab === "health") {
      return (
        <DashboardLayout>
          <ComingSoonTab tabName="health metrics" />
        </DashboardLayout>
      );
    }
    
    if (activeTab === "profile") {
      return (
        <DashboardLayout>
          <ComingSoonTab tabName="client profile" />
        </DashboardLayout>
      );
    }
  }

  return (
    <DashboardLayout>
      <OverviewTab />
    </DashboardLayout>
  );
}
