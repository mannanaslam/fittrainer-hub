import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Dumbbell, Calendar, TrendingUp, MessageSquare } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

interface DashboardStats {
  activeWorkouts: number;
  completedWorkouts: number;
  upcomingSessions: number;
  unreadMessages: number;
  progress: {
    weight: number;
    bodyFat: number;
    workoutCompletion: number;
  };
}

export const ClientDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeWorkouts: 0,
    completedWorkouts: 0,
    upcomingSessions: 0,
    unreadMessages: 0,
    progress: {
      weight: 0,
      bodyFat: 0,
      workoutCompletion: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch active workouts
        const { count: activeWorkouts } = await supabase
          .from('workouts')
          .select('*', { count: 'exact', head: true });

        // Fetch completed workouts
        const { count: completedWorkouts } = await supabase
          .from('progress')
          .select('*', { count: 'exact', head: true })
          .eq('workout_completion', 100);

        // Fetch upcoming sessions
        const upcomingSessions = 0; // Placeholder

        // Fetch unread messages
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);

        // Fetch latest progress
        const { data: latestProgress } = await supabase
          .from('progress')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        setStats({
          activeWorkouts: activeWorkouts || 0,
          completedWorkouts: completedWorkouts || 0,
          upcomingSessions,
          unreadMessages: messagesCount || 0,
          progress: {
            weight: latestProgress?.weight || 0,
            bodyFat: latestProgress?.body_fat || 0,
            workoutCompletion: latestProgress?.workout_completion || 0,
          },
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
      title: 'Active Workouts',
      value: stats.activeWorkouts,
      icon: Dumbbell,
      color: 'text-blue-500',
      action: () => navigate('/workouts'),
    },
    {
      title: 'Completed Workouts',
      value: stats.completedWorkouts,
      icon: TrendingUp,
      color: 'text-green-500',
      action: () => navigate('/progress'),
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Calendar,
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
        <Button onClick={() => navigate('/workouts')}>Start Workout</Button>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Your current fitness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Weight</span>
                <span className="text-sm text-muted-foreground">{stats.progress.weight} kg</span>
              </div>
              <Progress value={stats.progress.weight} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Body Fat</span>
                <span className="text-sm text-muted-foreground">{stats.progress.bodyFat}%</span>
              </div>
              <Progress value={stats.progress.bodyFat} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Workout Completion</span>
                <span className="text-sm text-muted-foreground">{stats.progress.workoutCompletion}%</span>
              </div>
              <Progress value={stats.progress.workoutCompletion} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Workout</CardTitle>
            <CardDescription>Your scheduled workout for today</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add today's workout details here */}
            <p className="text-muted-foreground">No workout scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progress History</TabsTrigger>
          <TabsTrigger value="workouts">Recent Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
              <CardDescription>Track your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add progress history chart here */}
              <p className="text-muted-foreground">No progress data available</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
              <CardDescription>Your completed workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add recent workouts list here */}
              <p className="text-muted-foreground">No recent workouts</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Plan</CardTitle>
              <CardDescription>Your current meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add nutrition plan details here */}
              <p className="text-muted-foreground">No nutrition plan available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 