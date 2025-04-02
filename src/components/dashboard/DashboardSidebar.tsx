
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  Utensils,
  DollarSign,
  User,
  Video,
  PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem 
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const navigate = useNavigate();

  // Menu items for the sidebar
  const menuItems = [
    { title: "Overview", icon: BarChart3, id: "overview" },
    { title: "Clients", icon: Users, id: "clients" },
    { title: "Workouts", icon: Dumbbell, id: "workouts" },
    { title: "Meal Plans", icon: Utensils, id: "meals" },
    { title: "Subscriptions", icon: DollarSign, id: "subscriptions" },
    { title: "Schedule", icon: Calendar, id: "schedule" },
    { title: "Analytics", icon: PieChart, id: "analytics" },
    { title: "Settings", icon: Settings, id: "settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">FitTrainer</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => navigate(`/dashboard?tab=${item.id}`)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/workout/create")}>
                  <Dumbbell className="h-5 w-5 mr-3" />
                  <span>New Workout Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/meal-plan/create")}>
                  <Utensils className="h-5 w-5 mr-3" />
                  <span>New Meal Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/clients/add")}>
                  <User className="h-5 w-5 mr-3" />
                  <span>Add Client</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/videos/upload")}>
                  <Video className="h-5 w-5 mr-3" />
                  <span>Upload Video</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/subscription/create")}>
                  <DollarSign className="h-5 w-5 mr-3" />
                  <span>Create Subscription</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            T
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Trainer Name</p>
            <p className="text-xs text-muted-foreground truncate">trainer@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
