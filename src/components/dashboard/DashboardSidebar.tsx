
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
  Trophy,
  LucideIcon
} from "lucide-react";
import { DashboardTabType } from "./TabTypes";

interface NavItem {
  title: string;
  icon: LucideIcon;
  tab: DashboardTabType;
}

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  
  // Get the current tab from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') || 'overview') as DashboardTabType;
  
  // Helper to create URL with tab query parameter
  const createTabUrl = (tab: DashboardTabType) => {
    return `/dashboard?tab=${tab}`;
  };
  
  // Default to client if profile is missing
  const isTrainer = profile?.role === 'trainer';
  
  // Navigation items based on user role
  const trainerNavItems: NavItem[] = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      tab: "overview"
    },
    {
      title: "Clients",
      icon: Users,
      tab: "clients"
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      tab: "subscriptions"
    },
    {
      title: "Workouts",
      icon: Dumbbell,
      tab: "workouts"
    },
    {
      title: "Meal Plans",
      icon: Utensils,
      tab: "meals"
    },
    {
      title: "Schedule",
      icon: Calendar,
      tab: "schedule"
    },
    {
      title: "Analytics",
      icon: BarChart,
      tab: "analytics"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      tab: "messages"
    },
    {
      title: "Settings",
      icon: Settings,
      tab: "settings"
    }
  ];
  
  const clientNavItems: NavItem[] = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      tab: "overview"
    },
    {
      title: "My Workouts",
      icon: Dumbbell,
      tab: "workouts"
    },
    {
      title: "My Meal Plan",
      icon: Utensils,
      tab: "meals"
    },
    {
      title: "Progress",
      icon: Trophy,
      tab: "progress"
    },
    {
      title: "Health Metrics",
      icon: HeartPulse,
      tab: "health"
    },
    {
      title: "Schedule",
      icon: Calendar,
      tab: "schedule"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      tab: "messages"
    },
    {
      title: "My Profile",
      icon: UserCircle,
      tab: "profile"
    },
    {
      title: "Settings",
      icon: Settings,
      tab: "settings"
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
                isActive={item.tab === currentTab}
                onClick={() => navigate(createTabUrl(item.tab))}
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
