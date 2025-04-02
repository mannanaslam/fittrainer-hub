
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { OverviewTab } from "./tabs/OverviewTab";
import { ClientsTab } from "./tabs/ClientsTab";
import { SubscriptionsTab } from "./tabs/SubscriptionsTab";
import { MealsTab } from "./tabs/MealsTab";
import { WorkoutTab } from "./tabs/WorkoutTab";
import { ComingSoonTab } from "./tabs/ComingSoonTab";

export function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Parse tab from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  return (
    <DashboardLayout>
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "clients" && <ClientsTab />}
      {activeTab === "subscriptions" && <SubscriptionsTab />}
      {activeTab === "meals" && <MealsTab />}
      {activeTab === "schedule" && <ComingSoonTab tabName="schedule" />}
      {activeTab === "workouts" && <WorkoutTab />}
      {activeTab === "analytics" && <ComingSoonTab tabName="analytics" />}
      {activeTab === "settings" && <ComingSoonTab tabName="settings" />}
    </DashboardLayout>
  );
}
