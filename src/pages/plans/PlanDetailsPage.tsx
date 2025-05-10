import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanById, subscribeToPlan } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { Dumbbell, Utensils, Calendar, Clock, User, DollarSign } from 'lucide-react';

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  restInterval: number;
  equipment: string[];
  videoUrl?: string;
  notes?: string;
}

interface Workout {
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
}

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number;
  isPremium: boolean;
  price: number;
  created_at: string;
  trainer: {
    id: string;
    first_name: string;
    last_name: string;
    bio: string;
  };
  workouts: Workout[];
  meals: Meal[];
}

export const PlanDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const { data, error } = await getPlanById(id!);
      if (error) throw error;
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plan details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/plans/${id}` } });
      return;
    }

    setSubscribing(true);
    try {
      const { error } = await subscribeToPlan(id!, user.id);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to plan');
    } finally {
      setSubscribing(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      workout: 'bg-blue-500',
      diet: 'bg-green-500',
      combined: 'bg-purple-500',
    };
    return (
      <Badge className={`${colors[type as keyof typeof colors]} text-white`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Plan not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          <p className="text-gray-500">{plan.description}</p>
        </div>
        {getTypeBadge(plan.type)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <CardDescription>{plan.duration} days</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <CardDescription>
                {new Date(plan.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-sm font-medium">Trainer</CardTitle>
              <CardDescription>
                {plan.trainer.first_name} {plan.trainer.last_name}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <div>
              <CardTitle className="text-sm font-medium">Price</CardTitle>
              <CardDescription>
                {plan.isPremium ? `$${plan.price}` : 'Free'}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {(plan.type === 'workout' || plan.type === 'combined') && (
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
          )}
          {(plan.type === 'diet' || plan.type === 'combined') && (
            <TabsTrigger value="meals">Meal Plan</TabsTrigger>
          )}
          <TabsTrigger value="trainer">Trainer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{plan.description}</p>
                {(plan.type === 'workout' || plan.type === 'combined') && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Workout Program</h3>
                    <ul className="list-disc pl-6">
                      {plan.workouts.map((workout, index) => (
                        <li key={index}>
                          {workout.name} - {workout.duration} minutes
                          <span className="ml-2 text-sm text-gray-500">
                            ({workout.difficulty})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(plan.type === 'diet' || plan.type === 'combined') && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">Meal Plan</h3>
                    <ul className="list-disc pl-6">
                      {plan.meals.map((meal, index) => (
                        <li key={index}>
                          {meal.name} - {meal.calories} calories
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(plan.type === 'workout' || plan.type === 'combined') && (
          <TabsContent value="workouts" className="space-y-4">
            {plan.workouts.map((workout, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{workout.name}</CardTitle>
                      <CardDescription>{workout.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{workout.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{workout.duration} minutes</span>
                    </div>
                    <div className="space-y-4">
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="border rounded-lg p-4">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {exercise.description}
                          </p>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">Sets:</span>{' '}
                              {exercise.sets}
                            </div>
                            <div>
                              <span className="text-gray-500">Reps:</span>{' '}
                              {exercise.reps}
                            </div>
                            <div>
                              <span className="text-gray-500">Rest:</span>{' '}
                              {exercise.restInterval}s
                            </div>
                          </div>
                          {exercise.equipment.length > 0 && (
                            <div className="mt-2">
                              <span className="text-gray-500">Equipment:</span>{' '}
                              {exercise.equipment.join(', ')}
                            </div>
                          )}
                          {exercise.videoUrl && (
                            <div className="mt-2">
                              <a
                                href={exercise.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Watch Demo
                              </a>
                            </div>
                          )}
                          {exercise.notes && (
                            <div className="mt-2 text-sm text-gray-500">
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}

        {(plan.type === 'diet' || plan.type === 'combined') && (
          <TabsContent value="meals" className="space-y-4">
            {plan.meals.map((meal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Calories</span>
                        <p className="font-medium">{meal.calories}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Protein</span>
                        <p className="font-medium">{meal.protein}g</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Carbs</span>
                        <p className="font-medium">{meal.carbs}g</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Fats</span>
                        <p className="font-medium">{meal.fats}g</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Ingredients</h4>
                      <ul className="list-disc pl-6 text-sm">
                        {meal.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Instructions</h4>
                      <ol className="list-decimal pl-6 text-sm">
                        {meal.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                    {meal.imageUrl && (
                      <div className="mt-4">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="rounded-lg w-full max-w-md"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}

        <TabsContent value="trainer">
          <Card>
            <CardHeader>
              <CardTitle>About the Trainer</CardTitle>
              <CardDescription>
                {plan.trainer.first_name} {plan.trainer.last_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{plan.trainer.bio}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/plans')}
        >
          Back to Plans
        </Button>
        <Button
          onClick={handleSubscribe}
          disabled={subscribing}
        >
          {subscribing ? 'Subscribing...' : plan.isPremium ? `Subscribe for $${plan.price}` : 'Start Plan'}
        </Button>
      </CardFooter>
    </div>
  );
}; 