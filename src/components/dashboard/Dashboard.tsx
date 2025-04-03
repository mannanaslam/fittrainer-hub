
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

export function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useAuth();
  
  const isTrainer = profile?.role === 'trainer';

  // Parse tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Common tabs for both trainer and client
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
  
  // Trainer-specific tabs
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
  
  // Client-specific tabs
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

  // Default/fallback view
  return (
    <DashboardLayout>
      <OverviewTab />
    </DashboardLayout>
  );
}
