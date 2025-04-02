
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Calendar, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Sample data for client growth chart
const clientGrowthData = [
  { month: "Jan", clients: 42 },
  { month: "Feb", clients: 47 },
  { month: "Mar", clients: 53 },
  { month: "Apr", clients: 59 },
  { month: "May", clients: 64 },
  { month: "Jun", clients: 71 },
  { month: "Jul", clients: 77 },
];

// Sample data for revenue chart
const revenueData = [
  { month: "Jan", revenue: 2500 },
  { month: "Feb", revenue: 2800 },
  { month: "Mar", revenue: 3200 },
  { month: "Apr", revenue: 3600 },
  { month: "May", revenue: 4100 },
  { month: "Jun", revenue: 4700 },
  { month: "Jul", revenue: 5200 },
];

// Sample data for session completion
const sessionCompletionData = [
  { day: "Mon", completed: 12, missed: 2 },
  { day: "Tue", completed: 14, missed: 1 },
  { day: "Wed", completed: 10, missed: 3 },
  { day: "Thu", completed: 15, missed: 0 },
  { day: "Fri", completed: 13, missed: 2 },
  { day: "Sat", completed: 8, missed: 1 },
  { day: "Sun", completed: 5, missed: 0 },
];

// Sample stats
const stats = [
  { 
    title: "Total Clients", 
    value: "77", 
    change: "+12%", 
    isPositive: true,
    description: "compared to last month",
    icon: Users
  },
  { 
    title: "Monthly Revenue", 
    value: "$5,200", 
    change: "+10.5%", 
    isPositive: true,
    description: "compared to last month",
    icon: DollarSign
  },
  { 
    title: "Session Completion", 
    value: "94%", 
    change: "+2.3%", 
    isPositive: true,
    description: "compared to last month",
    icon: Calendar
  },
  { 
    title: "Avg. Client Retention", 
    value: "8.3", 
    change: "-0.5", 
    isPositive: false,
    description: "months compared to last quarter",
    icon: Users
  }
];

export function AnalyticsTab() {
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your business performance and client engagement
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Badge 
                  variant="outline" 
                  className={`flex items-center ${stat.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                >
                  {stat.isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>Client acquisition trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      clients: {
                        label: "Clients",
                        color: "#7E69AB"
                      }
                    }}
                  >
                    <AreaChart data={clientGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Area
                        type="monotone"
                        dataKey="clients"
                        stroke="#7E69AB"
                        fill="#7E69AB"
                        fillOpacity={0.2}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue in USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "#9b87f5"
                      }
                    }}
                  >
                    <AreaChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#9b87f5"
                        fill="#9b87f5"
                        fillOpacity={0.2}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Session Completion</CardTitle>
                <CardDescription>Weekly session completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      completed: {
                        label: "Completed",
                        color: "#10b981"
                      },
                      missed: {
                        label: "Missed",
                        color: "#ef4444"
                      }
                    }}
                  >
                    <BarChart data={sessionCompletionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Bar dataKey="completed" fill="#10b981" stackId="a" />
                      <Bar dataKey="missed" fill="#ef4444" stackId="a" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Demographics</CardTitle>
              <CardDescription>Detailed client analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[400px]">
                <p className="text-muted-foreground">
                  Detailed client analytics will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[400px]">
                <p className="text-muted-foreground">
                  Detailed revenue analytics will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Analytics</CardTitle>
              <CardDescription>Session completion and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[400px]">
                <p className="text-muted-foreground">
                  Detailed session analytics will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
