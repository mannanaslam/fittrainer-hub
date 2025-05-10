
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { ClientsTab } from "@/components/dashboard/tabs/ClientsTab";
import { WorkoutTab } from "@/components/dashboard/tabs/WorkoutTab";
import { MealsTab } from "@/components/dashboard/tabs/MealsTab";
import { SubscriptionsTab } from "@/components/dashboard/tabs/SubscriptionsTab";
import { ScheduleTab } from "@/components/dashboard/tabs/ScheduleTab";
import { AnalyticsTab } from "@/components/dashboard/tabs/AnalyticsTab";
import { MessagesTab } from "@/components/dashboard/tabs/MessagesTab"; // Add this line

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "clients"
    | "workouts"
    | "meals"
    | "subscriptions"
    | "schedule"
    | "analytics"
    | "messages"
    | null
  >("overview");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab === "overview" ||
      tab === "clients" ||
      tab === "workouts" ||
      tab === "meals" ||
      tab === "subscriptions" ||
      tab === "schedule" ||
      tab === "analytics" ||
      tab === "messages"
    ) {
      setActiveTab(tab);
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "clients" && <ClientsTab />}
      {activeTab === "workouts" && <WorkoutTab />}
      {activeTab === "meals" && <MealsTab />}
      {activeTab === "subscriptions" && <SubscriptionsTab />}
      {activeTab === "schedule" && <ScheduleTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "messages" && <MessagesTab />}
    </DashboardLayout>
  );
};

export default Dashboard;
