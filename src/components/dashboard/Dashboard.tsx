
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
  User,
  DollarSign,
  Utensils,
  Bell,
  PieChart,
  Activity,
  CheckCircle
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
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Sample client data
const clients = [
  { id: 1, name: "Alex Johnson", status: "Active", plan: "Strength Training", progress: 75 },
  { id: 2, name: "Maria Garcia", status: "Active", plan: "Weight Loss", progress: 60 },
  { id: 3, name: "Sam Taylor", status: "Inactive", plan: "Muscle Gain", progress: 30 },
  { id: 4, name: "Jamie Wilson", status: "Active", plan: "General Fitness", progress: 85 },
];

// Sample stats data
const stats = [
  { label: "Total Clients", value: "24" },
  { label: "Active Plans", value: "18" },
  { label: "Revenue", value: "$3,240" },
  { label: "Completion Rate", value: "87%" },
];

// Sample subscription data
const subscriptions = [
  { id: 1, name: "Basic Fitness", subscribers: 15, price: "$9.99", status: "active" },
  { id: 2, name: "Premium Strength", subscribers: 8, price: "$19.99", status: "active" },
  { id: 3, name: "Elite Performance", subscribers: 3, price: "$29.99", status: "active" },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
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
        
        <div className="flex-1">
          <div className="p-4 h-16 flex items-center border-b justify-between">
            <SidebarTrigger />
            
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">3</span>
              </button>
              <div className="relative rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white">
                T
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Container>
              {activeTab === "overview" && (
                <>
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
                        <Button size="sm" onClick={() => navigate("/clients/add")}>
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
                              <th className="text-left p-4 text-sm font-medium">Progress</th>
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
                                <td className="p-4">
                                  <div className="flex items-center">
                                    <div className="w-full bg-muted rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${client.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground w-8">{client.progress}%</span>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>View</Button>
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
                  <div className="mb-8">
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
                  
                  {/* Subscriptions section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Active Subscriptions</h2>
                      <Button size="sm" variant="outline" onClick={() => navigate("/subscription/create")}>
                        <Plus className="h-4 w-4 mr-1" />
                        New Plan
                      </Button>
                    </div>
                    <div className="glass-card rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-secondary">
                              <th className="text-left p-4 text-sm font-medium">Plan Name</th>
                              <th className="text-left p-4 text-sm font-medium">Subscribers</th>
                              <th className="text-left p-4 text-sm font-medium">Price</th>
                              <th className="text-left p-4 text-sm font-medium">Status</th>
                              <th className="text-right p-4 text-sm font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscriptions.map((sub) => (
                              <tr key={sub.id} className="border-t border-border">
                                <td className="p-4 font-medium">{sub.name}</td>
                                <td className="p-4">{sub.subscribers}</td>
                                <td className="p-4">{sub.price}/month</td>
                                <td className="p-4">
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                    Active
                                  </Badge>
                                </td>
                                <td className="p-4 text-right">
                                  <Button variant="ghost" size="sm">Edit</Button>
                                  <Button variant="ghost" size="sm">View</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "clients" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Client Management</h1>
                    <Button onClick={() => navigate("/clients/add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Manage all your client relationships, track progress, and assign workout plans.
                  </p>
                  <div className="mb-4">
                    <Button variant="outline" className="mr-2">All Clients</Button>
                    <Button variant="outline" className="mr-2">Active</Button>
                    <Button variant="outline">Inactive</Button>
                  </div>
                  <div className="glass-card rounded-xl p-4 mb-6">
                    <p className="text-center py-6">Click on "Clients" in the main navigation to see the full client management page.</p>
                  </div>
                </div>
              )}
              
              {activeTab === "subscriptions" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Subscription Plans</h1>
                    <Button onClick={() => navigate("/subscription/create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Plan
                    </Button>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Manage your subscription offerings, pricing, and monitor subscriber metrics.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="border rounded-xl p-6 flex flex-col">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">Basic Plan</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$9.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <div className="space-y-2 flex-1 mb-6">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Access to basic workout plans</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Diet plan recommendations</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Email support</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Edit Plan</Button>
                    </div>
                    
                    <div className="border rounded-xl p-6 flex flex-col bg-primary/5 border-primary/30 relative">
                      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">Premium Plan</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$19.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <div className="space-y-2 flex-1 mb-6">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>All basic features</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Advanced workout plans</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Video demonstrations</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Priority support</span>
                        </div>
                      </div>
                      <Button className="w-full">Edit Plan</Button>
                    </div>
                    
                    <div className="border rounded-xl p-6 flex flex-col">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">Elite Plan</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">$29.99</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <div className="space-y-2 flex-1 mb-6">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>All premium features</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>1-on-1 virtual sessions</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Personalized meal plans</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <span>Progress analytics</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">Edit Plan</Button>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4">Subscriber Analytics</h2>
                  <div className="glass-card rounded-xl p-6 mb-6">
                    <div className="h-60 flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">Subscription analytics will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "meals" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Meal Plans</h1>
                    <Button onClick={() => navigate("/meal-plan/create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Meal Plan
                    </Button>
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Create and manage nutritional plans for your clients.
                  </p>
                  
                  <div className="glass-card rounded-xl p-6 mb-6">
                    <p className="text-center py-12">
                      This is where your meal plans will appear. 
                      <br />Create your first meal plan by clicking the button above.
                    </p>
                  </div>
                </div>
              )}
              
              {(activeTab === "schedule" || activeTab === "workouts" || activeTab === "analytics" || activeTab === "settings") && (
                <div className="glass-card rounded-xl p-6">
                  <div className="text-center py-16">
                    <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
                    <p className="text-muted-foreground">
                      The {activeTab} page is currently in development. Check back soon!
                    </p>
                  </div>
                </div>
              )}
            </Container>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
