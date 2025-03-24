
import { useState } from "react";
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  Plus, 
  Search,
  Video,
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { Container } from "@/components/ui/Container";

// Sample client data
const clients = [
  { id: 1, name: "Alex Johnson", status: "Active", plan: "Strength Training" },
  { id: 2, name: "Maria Garcia", status: "Active", plan: "Weight Loss" },
  { id: 3, name: "Sam Taylor", status: "Inactive", plan: "Muscle Gain" },
  { id: 4, name: "Jamie Wilson", status: "Active", plan: "General Fitness" },
];

// Sample stats data
const stats = [
  { label: "Total Clients", value: "24" },
  { label: "Active Plans", value: "18" },
  { label: "Revenue", value: "$3,240" },
  { label: "Completion Rate", value: "87%" },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Menu items for the sidebar
  const menuItems = [
    { title: "Overview", icon: BarChart3, id: "overview" },
    { title: "Clients", icon: Users, id: "clients" },
    { title: "Workouts", icon: Dumbbell, id: "workouts" },
    { title: "Schedule", icon: Calendar, id: "schedule" },
    { title: "Settings", icon: Settings, id: "settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
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
                        onClick={() => setActiveTab(item.id)}
                        className={activeTab === item.id ? "bg-sidebar-accent text-primary" : ""}
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
                    <SidebarMenuButton>
                      <Plus className="h-5 w-5 mr-3" />
                      <span>New Workout Plan</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <User className="h-5 w-5 mr-3" />
                      <span>Add Client</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Video className="h-5 w-5 mr-3" />
                      <span>Upload Video</span>
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
        
        <div className="flex-1">
          <div className="p-4 h-16 flex items-center border-b justify-between">
            <SidebarTrigger />
            
            <div className="flex items-center space-x-2">
              <div className="relative rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
                T
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Container>
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome back, Trainer</h1>
                <p className="text-muted-foreground">Here's what's happening with your clients today.</p>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-card rounded-xl p-5">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              {/* Recent clients section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Clients</h2>
                  
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text"
                        placeholder="Search clients..."
                        className="pl-9 py-2 pr-4 rounded-lg border bg-background text-sm w-full max-w-xs"
                      />
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Client
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary">
                          <th className="text-left p-4 text-sm font-medium">Name</th>
                          <th className="text-left p-4 text-sm font-medium">Status</th>
                          <th className="text-left p-4 text-sm font-medium">Plan</th>
                          <th className="text-right p-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id} className="border-t border-border">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {client.name.charAt(0)}
                                </div>
                                <span className="font-medium">{client.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                client.status === "Active" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">{client.plan}</td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Recent workouts preview */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="glass-card rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                      <div className="aspect-video bg-muted relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Strength</span>
                        <h3 className="font-medium mt-2 mb-1">Upper Body Workout</h3>
                        <p className="text-sm text-muted-foreground">12 exercises • 45 min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
