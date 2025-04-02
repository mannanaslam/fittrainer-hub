
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarNav } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Dumbbell, 
  Utensils, 
  Calendar,
  Settings,
  LogOut,
  BarChart,
  MessageSquare
} from "lucide-react";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // Get the current tab from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Helper to create URL with tab query parameter
  const createTabUrl = (tab: string) => {
    return `/dashboard?tab=${tab}`;
  };
  
  // Navigation items
  const navItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: createTabUrl("overview"),
      active: currentTab === "overview"
    },
    {
      title: "Clients",
      icon: Users,
      href: createTabUrl("clients"),
      active: currentTab === "clients"
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      href: createTabUrl("subscriptions"),
      active: currentTab === "subscriptions"
    },
    {
      title: "Workouts",
      icon: Dumbbell,
      href: createTabUrl("workouts"),
      active: currentTab === "workouts"
    },
    {
      title: "Meal Plans",
      icon: Utensils,
      href: createTabUrl("meals"),
      active: currentTab === "meals"
    },
    {
      title: "Schedule",
      icon: Calendar,
      href: createTabUrl("schedule"),
      active: currentTab === "schedule"
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: createTabUrl("analytics"),
      active: currentTab === "analytics"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: createTabUrl("messages"),
      active: currentTab === "messages"
    },
    {
      title: "Settings",
      icon: Settings,
      href: createTabUrl("settings"),
      active: currentTab === "settings"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="text-xl font-bold">FitPro</span>
      </SidebarHeader>
      
      <SidebarNav 
        items={navItems} 
        onSelect={(href) => navigate(href)}
      />
      
      <SidebarFooter>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Sign out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
