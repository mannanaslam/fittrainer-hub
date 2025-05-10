import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

interface DashboardStats {
  totalClients: number;
  activePlans: number;
  upcomingSessions: number;
  unreadMessages: number;
}

export const TrainerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activePlans: 0,
    upcomingSessions: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total clients
        const { count: clientsCount } = await supabase
          .from('client_profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch active plans
        const { count: plansCount } = await supabase
          .from('plans')
          .select('*', { count: 'exact', head: true });

        // Fetch upcoming sessions (you'll need to implement this based on your calendar system)
        const upcomingSessions = 0; // Placeholder

        // Fetch unread messages
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);

        setStats({
          totalClients: clientsCount || 0,
          activePlans: plansCount || 0,
          upcomingSessions,
          unreadMessages: messagesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-500',
      action: () => navigate('/clients'),
    },
    {
      title: 'Active Plans',
      value: stats.activePlans,
      icon: Calendar,
      color: 'text-green-500',
      action: () => navigate('/plans'),
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: TrendingUp,
      color: 'text-purple-500',
      action: () => navigate('/calendar'),
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: 'text-orange-500',
      action: () => navigate('/messages'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate('/plans/new')}>Create New Plan</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="clients">Client Progress</TabsTrigger>
          <TabsTrigger value="plans">Active Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your clients</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add recent activity list here */}
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Progress</CardTitle>
              <CardDescription>Overview of client achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add client progress list here */}
              <p className="text-muted-foreground">No client progress data</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Plans</CardTitle>
              <CardDescription>Currently active training plans</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add active plans list here */}
              <p className="text-muted-foreground">No active plans</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 