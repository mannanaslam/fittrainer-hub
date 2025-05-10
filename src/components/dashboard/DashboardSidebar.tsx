import { useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
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
  MessageSquare,
  UserCircle,
  HeartPulse,
  Trophy
} from "lucide-react";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  
  // Get the current tab from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Helper to create URL with tab query parameter
  const createTabUrl = (tab: string) => {
    return `/dashboard?tab=${tab}`;
  };
  
  // Default to client if profile is missing
  const isTrainer = profile?.role === 'trainer';
  
  // Navigation items based on user role
  const trainerNavItems = [
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
  
  const clientNavItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: createTabUrl("overview"),
      active: currentTab === "overview"
    },
    {
      title: "My Workouts",
      icon: Dumbbell,
      href: createTabUrl("workouts"),
      active: currentTab === "workouts"
    },
    {
      title: "My Meal Plan",
      icon: Utensils,
      href: createTabUrl("meals"),
      active: currentTab === "meals"
    },
    {
      title: "Progress",
      icon: Trophy,
      href: createTabUrl("progress"),
      active: currentTab === "progress"
    },
    {
      title: "Health Metrics",
      icon: HeartPulse,
      href: createTabUrl("health"),
      active: currentTab === "health"
    },
    {
      title: "Schedule",
      icon: Calendar,
      href: createTabUrl("schedule"),
      active: currentTab === "schedule"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: createTabUrl("messages"),
      active: currentTab === "messages"
    },
    {
      title: "My Profile",
      icon: UserCircle,
      href: createTabUrl("profile"),
      active: currentTab === "profile"
    },
    {
      title: "Settings",
      icon: Settings,
      href: createTabUrl("settings"),
      active: currentTab === "settings"
    }
  ];
  
  // Select navigation items based on user role
  const navItems = isTrainer ? trainerNavItems : clientNavItems;

  return (
    <aside className="w-64 h-full">
      <SidebarHeader>
        <span className="text-xl font-bold">FitPro</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                isActive={item.active}
                onClick={() => navigate(item.href)}
                tooltip={item.title}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Sign out</span>
        </button>
      </SidebarFooter>
    </aside>
  );
}
