
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Sample weight progress data
const weightData = [
  { date: "Jan 1", value: 180 },
  { date: "Jan 15", value: 178 },
  { date: "Feb 1", value: 176 },
  { date: "Feb 15", value: 175 },
  { date: "Mar 1", value: 173 },
  { date: "Mar 15", value: 170 },
  { date: "Apr 1", value: 169 },
];

// Sample body measurements data
const measurementsData = [
  { date: "Jan 1", chest: 42, waist: 36, hips: 42, arms: 15 },
  { date: "Feb 1", chest: 42, waist: 35, hips: 41.5, arms: 15.2 },
  { date: "Mar 1", chest: 42.5, waist: 34, hips: 41, arms: 15.5 },
  { date: "Apr 1", chest: 43, waist: 33, hips: 40.5, arms: 16 },
];

// Sample strength progress data
const strengthData = [
  { date: "Jan 1", squat: 185, bench: 155, deadlift: 225 },
  { date: "Feb 1", squat: 195, bench: 165, deadlift: 245 },
  { date: "Mar 1", squat: 205, bench: 175, deadlift: 265 },
  { date: "Apr 1", squat: 225, bench: 185, deadlift: 285 },
];

// Sample cardio metrics
const cardioData = [
  { date: "Jan 1", time: 35, distance: 3.2, pace: 10.9 },
  { date: "Jan 15", time: 33, distance: 3.2, pace: 10.3 },
  { date: "Feb 1", time: 32, distance: 3.3, pace: 9.7 },
  { date: "Feb 15", time: 31, distance: 3.3, pace: 9.4 },
  { date: "Mar 1", time: 30, distance: 3.4, pace: 8.8 },
  { date: "Mar 15", time: 29, distance: 3.4, pace: 8.5 },
  { date: "Apr 1", time: 28, distance: 3.5, pace: 8.0 },
];

// Progress metrics
const progressMetrics = [
  {
    title: "Weight",
    current: "169 lbs",
    change: "-11 lbs",
    isPositive: true,
    period: "Last 3 months"
  },
  {
    title: "Body Fat",
    current: "18%",
    change: "-4%",
    isPositive: true,
    period: "Last 3 months"
  },
  {
    title: "Strength",
    current: "+22%",
    change: "+8%",
    isPositive: true,
    period: "Last month"
  },
  {
    title: "Cardio",
    current: "8 min/mile",
    change: "-2.9 min",
    isPositive: true,
    period: "Last 3 months"
  }
];

export function ClientProgress() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Progress</CardTitle>
              <CardDescription>Track fitness and performance metrics</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Measurement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {progressMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="text-xl font-bold mt-1">{metric.current}</h3>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center ${metric.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                  >
                    {metric.isPositive ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">
                    {metric.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="strength">Strength</TabsTrigger>
              <TabsTrigger value="cardio">Cardio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Weight Progress</h3>
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Weight (lbs)",
                          color: "#9b87f5"
                        }
                      }}
                    >
                      <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                        <Line type="monotone" dataKey="value" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Strength Progress</h3>
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        squat: {
                          label: "Squat (lbs)",
                          color: "#10b981"
                        },
                        bench: {
                          label: "Bench (lbs)",
                          color: "#3b82f6"
                        },
                        deadlift: {
                          label: "Deadlift (lbs)",
                          color: "#ef4444"
                        }
                      }}
                    >
                      <LineChart data={strengthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                        <Line type="monotone" dataKey="squat" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="bench" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="deadlift" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Recent Measurements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Date</th>
                        <th className="text-left py-2 px-4 font-medium">Weight</th>
                        <th className="text-left py-2 px-4 font-medium">Body Fat</th>
                        <th className="text-left py-2 px-4 font-medium">Chest</th>
                        <th className="text-left py-2 px-4 font-medium">Waist</th>
                        <th className="text-left py-2 px-4 font-medium">Hips</th>
                        <th className="text-left py-2 px-4 font-medium">Arms</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">Apr 1, 2023</td>
                        <td className="py-2 px-4">169 lbs</td>
                        <td className="py-2 px-4">18%</td>
                        <td className="py-2 px-4">43"</td>
                        <td className="py-2 px-4">33"</td>
                        <td className="py-2 px-4">40.5"</td>
                        <td className="py-2 px-4">16"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">Mar 1, 2023</td>
                        <td className="py-2 px-4">173 lbs</td>
                        <td className="py-2 px-4">19%</td>
                        <td className="py-2 px-4">42.5"</td>
                        <td className="py-2 px-4">34"</td>
                        <td className="py-2 px-4">41"</td>
                        <td className="py-2 px-4">15.5"</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Feb 1, 2023</td>
                        <td className="py-2 px-4">176 lbs</td>
                        <td className="py-2 px-4">21%</td>
                        <td className="py-2 px-4">42"</td>
                        <td className="py-2 px-4">35"</td>
                        <td className="py-2 px-4">41.5"</td>
                        <td className="py-2 px-4">15.2"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="weight">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Weight History</h3>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Weight (lbs)",
                          color: "#9b87f5"
                        }
                      }}
                    >
                      <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                        <Line type="monotone" dataKey="value" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Starting Weight</h4>
                    <p className="text-xl font-bold mt-1">180 lbs</p>
                    <p className="text-xs text-muted-foreground mt-1">Jan 1, 2023</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Weight</h4>
                    <p className="text-xl font-bold mt-1">169 lbs</p>
                    <p className="text-xs text-muted-foreground mt-1">Apr 1, 2023</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Weight Loss</h4>
                    <p className="text-xl font-bold mt-1 text-green-600">-11 lbs</p>
                    <p className="text-xs text-muted-foreground mt-1">3 months</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="measurements">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Date</th>
                      <th className="text-left py-2 px-4 font-medium">Chest</th>
                      <th className="text-left py-2 px-4 font-medium">Waist</th>
                      <th className="text-left py-2 px-4 font-medium">Hips</th>
                      <th className="text-left py-2 px-4 font-medium">Arms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurementsData.map((measurement, index) => (
                      <tr key={index} className={index < measurementsData.length - 1 ? "border-b" : ""}>
                        <td className="py-2 px-4">{measurement.date}</td>
                        <td className="py-2 px-4">{measurement.chest}"</td>
                        <td className="py-2 px-4">{measurement.waist}"</td>
                        <td className="py-2 px-4">{measurement.hips}"</td>
                        <td className="py-2 px-4">{measurement.arms}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Waist Measurement Trend</h3>
                <div className="h-[250px]">
                  <ChartContainer
                    config={{
                      waist: {
                        label: "Waist (inches)",
                        color: "#9b87f5"
                      }
                    }}
                  >
                    <LineChart data={measurementsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Line type="monotone" dataKey="waist" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strength">
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    squat: {
                      label: "Squat (lbs)",
                      color: "#10b981"
                    },
                    bench: {
                      label: "Bench (lbs)",
                      color: "#3b82f6"
                    },
                    deadlift: {
                      label: "Deadlift (lbs)",
                      color: "#ef4444"
                    }
                  }}
                >
                  <LineChart data={strengthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                    <Line type="monotone" dataKey="squat" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="bench" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="deadlift" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Squat Progress</h4>
                  <p className="text-xl font-bold mt-1">225 lbs</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="flex items-center text-green-600 bg-green-50">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +40 lbs
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      Last 3 months
                    </span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Bench Progress</h4>
                  <p className="text-xl font-bold mt-1">185 lbs</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="flex items-center text-green-600 bg-green-50">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +30 lbs
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      Last 3 months
                    </span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground">Deadlift Progress</h4>
                  <p className="text-xl font-bold mt-1">285 lbs</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="flex items-center text-green-600 bg-green-50">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +60 lbs
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      Last 3 months
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cardio">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">3-Mile Run Performance</h3>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        pace: {
                          label: "Pace (min/mile)",
                          color: "#3b82f6"
                        }
                      }}
                    >
                      <LineChart data={cardioData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                        <Line type="monotone" dataKey="pace" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Starting Pace</h4>
                    <p className="text-xl font-bold mt-1">10.9 min/mile</p>
                    <p className="text-xs text-muted-foreground mt-1">Jan 1, 2023</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Pace</h4>
                    <p className="text-xl font-bold mt-1">8.0 min/mile</p>
                    <p className="text-xs text-muted-foreground mt-1">Apr 1, 2023</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Improvement</h4>
                    <p className="text-xl font-bold mt-1 text-green-600">-2.9 min/mile</p>
                    <p className="text-xs text-muted-foreground mt-1">3 months</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
