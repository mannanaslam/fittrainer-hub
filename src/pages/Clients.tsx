
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Plus, 
  Filter, 
  UserPlus, 
  Mail, 
  MoreHorizontal,
  ChevronDown,
  Check
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Sample client data
const initialClients = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    plan: "Premium",
    status: "active",
    joinDate: "Jun 15, 2023",
    lastActive: "Today"
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    plan: "Premium",
    status: "active",
    joinDate: "Aug 3, 2023",
    lastActive: "Yesterday"
  },
  {
    id: "3",
    name: "Sam Taylor",
    email: "sam.taylor@example.com",
    plan: "Basic",
    status: "inactive",
    joinDate: "Mar 22, 2023",
    lastActive: "3 weeks ago"
  },
  {
    id: "4",
    name: "Jamie Wilson",
    email: "jamie.wilson@example.com",
    plan: "Premium",
    status: "active",
    joinDate: "Sep 10, 2023",
    lastActive: "2 days ago"
  },
  {
    id: "5",
    name: "Noah Brown",
    email: "noah.brown@example.com",
    plan: "Basic",
    status: "active",
    joinDate: "Oct 5, 2023",
    lastActive: "Today"
  }
];

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [planFilter, setPlanFilter] = useState<string[]>([]);
  
  const filteredClients = initialClients.filter((client) => {
    // Search filter
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter.length === 0 || statusFilter.includes(client.status);
    
    // Plan filter
    const matchesPlan = 
      planFilter.length === 0 || planFilter.includes(client.plan);
    
    return matchesSearch && matchesStatus && matchesPlan;
  });
  
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(current => 
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };
  
  const togglePlanFilter = (plan: string) => {
    setPlanFilter(current => 
      current.includes(plan)
        ? current.filter(p => p !== plan)
        : [...current, plan]
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Clients</h1>
              <p className="text-muted-foreground">Manage your client relationships</p>
            </div>
            
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {(statusFilter.length > 0 || planFilter.length > 0) && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {statusFilter.length + planFilter.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Status</h4>
                      <div className="space-y-2">
                        <button
                          className="flex items-center w-full"
                          onClick={() => toggleStatusFilter("active")}
                        >
                          <div className={`h-4 w-4 border rounded mr-2 flex items-center justify-center ${
                            statusFilter.includes("active") 
                              ? "bg-primary border-primary text-white" 
                              : "border-input"
                          }`}>
                            {statusFilter.includes("active") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span>Active</span>
                        </button>
                        <button
                          className="flex items-center w-full"
                          onClick={() => toggleStatusFilter("inactive")}
                        >
                          <div className={`h-4 w-4 border rounded mr-2 flex items-center justify-center ${
                            statusFilter.includes("inactive") 
                              ? "bg-primary border-primary text-white" 
                              : "border-input"
                          }`}>
                            {statusFilter.includes("inactive") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span>Inactive</span>
                        </button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Plan</h4>
                      <div className="space-y-2">
                        <button
                          className="flex items-center w-full"
                          onClick={() => togglePlanFilter("Premium")}
                        >
                          <div className={`h-4 w-4 border rounded mr-2 flex items-center justify-center ${
                            planFilter.includes("Premium") 
                              ? "bg-primary border-primary text-white" 
                              : "border-input"
                          }`}>
                            {planFilter.includes("Premium") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span>Premium</span>
                        </button>
                        <button
                          className="flex items-center w-full"
                          onClick={() => togglePlanFilter("Basic")}
                        >
                          <div className={`h-4 w-4 border rounded mr-2 flex items-center justify-center ${
                            planFilter.includes("Basic") 
                              ? "bg-primary border-primary text-white" 
                              : "border-input"
                          }`}>
                            {planFilter.includes("Basic") && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span>Basic</span>
                        </button>
                      </div>
                    </div>
                    
                    {(statusFilter.length > 0 || planFilter.length > 0) && (
                      <>
                        <Separator />
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center text-sm h-8"
                          onClick={() => {
                            setStatusFilter([]);
                            setPlanFilter([]);
                          }}
                        >
                          Clear all filters
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-4 text-sm font-medium">Name</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-sm font-medium">Plan</th>
                    <th className="text-left p-4 text-sm font-medium">Joined</th>
                    <th className="text-left p-4 text-sm font-medium">Last Active</th>
                    <th className="text-right p-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="border-t border-border">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={client.status === "active" ? "default" : "secondary"} className={client.status === "active" ? "bg-green-500" : ""}>
                            {client.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{client.plan}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{client.joinDate}</td>
                        <td className="p-4 text-muted-foreground">{client.lastActive}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`/clients/${client.id}`}>
                              <Button variant="ghost" size="sm">View</Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No clients found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Clients;
