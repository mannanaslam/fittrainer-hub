import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlan } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';

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

export const CreatePlanPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workout' as 'workout' | 'diet' | 'combined',
    duration: 30,
    isPremium: false,
    price: 0,
    workouts: [] as Workout[],
    meals: [] as Meal[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkoutChange = (index: number, field: keyof Workout, value: any) => {
    setFormData(prev => ({
      ...prev,
      workouts: prev.workouts.map((workout, i) =>
        i === index ? { ...workout, [field]: value } : workout
      ),
    }));
  };

  const handleExerciseChange = (workoutIndex: number, exerciseIndex: number, field: keyof Exercise, value: any) => {
    setFormData(prev => ({
      ...prev,
      workouts: prev.workouts.map((workout, i) =>
        i === workoutIndex
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise, j) =>
                j === exerciseIndex ? { ...exercise, [field]: value } : exercise
              ),
            }
          : workout
      ),
    }));
  };

  const handleMealChange = (index: number, field: keyof Meal, value: any) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, i) =>
        i === index ? { ...meal, [field]: value } : meal
      ),
    }));
  };

  const addWorkout = () => {
    setFormData(prev => ({
      ...prev,
      workouts: [
        ...prev.workouts,
        {
          name: '',
          description: '',
          duration: 30,
          difficulty: 'beginner',
          exercises: [],
        },
      ],
    }));
  };

  const addExercise = (workoutIndex: number) => {
    setFormData(prev => ({
      ...prev,
      workouts: prev.workouts.map((workout, i) =>
        i === workoutIndex
          ? {
              ...workout,
              exercises: [
                ...workout.exercises,
                {
                  name: '',
                  description: '',
                  sets: 3,
                  reps: 10,
                  restInterval: 60,
                  equipment: [],
                },
              ],
            }
          : workout
      ),
    }));
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [
        ...prev.meals,
        {
          name: '',
          description: '',
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          ingredients: [],
          instructions: [],
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await createPlan(formData);
      if (error) throw error;
      navigate('/plans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Plan</h1>
        <Button onClick={() => navigate('/plans')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Basic information about your plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Plan Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'workout' | 'diet' | 'combined' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workout">Workout Plan</SelectItem>
                    <SelectItem value="diet">Diet Plan</SelectItem>
                    <SelectItem value="combined">Combined Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremium: checked }))}
              />
              <Label htmlFor="isPremium">Premium Plan</Label>
            </div>
            {formData.isPremium && (
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        {(formData.type === 'workout' || formData.type === 'combined') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workouts</CardTitle>
                  <CardDescription>Add workout routines to your plan</CardDescription>
                </div>
                <Button type="button" onClick={addWorkout}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workout
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.workouts.map((workout, workoutIndex) => (
                <Card key={workoutIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Input
                          placeholder="Workout Name"
                          value={workout.name}
                          onChange={(e) => handleWorkoutChange(workoutIndex, 'name', e.target.value)}
                          required
                        />
                        <Textarea
                          placeholder="Workout Description"
                          value={workout.description}
                          onChange={(e) => handleWorkoutChange(workoutIndex, 'description', e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            workouts: prev.workouts.filter((_, i) => i !== workoutIndex),
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={workout.duration}
                          onChange={(e) => handleWorkoutChange(workoutIndex, 'duration', parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Select
                          value={workout.difficulty}
                          onValueChange={(value) => handleWorkoutChange(workoutIndex, 'difficulty', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Exercises</h3>
                        <Button type="button" onClick={() => addExercise(workoutIndex)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Exercise
                        </Button>
                      </div>
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <Card key={exerciseIndex}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder="Exercise Name"
                                value={exercise.name}
                                onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'name', e.target.value)}
                                required
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    workouts: prev.workouts.map((w, i) =>
                                      i === workoutIndex
                                        ? {
                                            ...w,
                                            exercises: w.exercises.filter((_, j) => j !== exerciseIndex),
                                          }
                                        : w
                                    ),
                                  }));
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Textarea
                              placeholder="Exercise Description"
                              value={exercise.description}
                              onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'description', e.target.value)}
                              required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  value={exercise.sets}
                                  onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'sets', parseInt(e.target.value))}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Reps</Label>
                                <Input
                                  type="number"
                                  value={exercise.reps}
                                  onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'reps', parseInt(e.target.value))}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Rest Interval (seconds)</Label>
                                <Input
                                  type="number"
                                  value={exercise.restInterval}
                                  onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'restInterval', parseInt(e.target.value))}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Equipment (comma-separated)</Label>
                              <Input
                                value={exercise.equipment.join(', ')}
                                onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'equipment', e.target.value.split(',').map(item => item.trim()))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Video URL (optional)</Label>
                              <Input
                                type="url"
                                value={exercise.videoUrl}
                                onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'videoUrl', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Notes (optional)</Label>
                              <Textarea
                                value={exercise.notes}
                                onChange={(e) => handleExerciseChange(workoutIndex, exerciseIndex, 'notes', e.target.value)}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {(formData.type === 'diet' || formData.type === 'combined') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meal Plan</CardTitle>
                  <CardDescription>Add meals to your plan</CardDescription>
                </div>
                <Button type="button" onClick={addMeal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.meals.map((meal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Input
                          placeholder="Meal Name"
                          value={meal.name}
                          onChange={(e) => handleMealChange(index, 'name', e.target.value)}
                          required
                        />
                        <Textarea
                          placeholder="Meal Description"
                          value={meal.description}
                          onChange={(e) => handleMealChange(index, 'description', e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            meals: prev.meals.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Calories</Label>
                        <Input
                          type="number"
                          value={meal.calories}
                          onChange={(e) => handleMealChange(index, 'calories', parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Protein (g)</Label>
                        <Input
                          type="number"
                          value={meal.protein}
                          onChange={(e) => handleMealChange(index, 'protein', parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Carbs (g)</Label>
                        <Input
                          type="number"
                          value={meal.carbs}
                          onChange={(e) => handleMealChange(index, 'carbs', parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fats (g)</Label>
                        <Input
                          type="number"
                          value={meal.fats}
                          onChange={(e) => handleMealChange(index, 'fats', parseFloat(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ingredients (one per line)</Label>
                      <Textarea
                        value={meal.ingredients.join('\n')}
                        onChange={(e) => handleMealChange(index, 'ingredients', e.target.value.split('\n'))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instructions (one per line)</Label>
                      <Textarea
                        value={meal.instructions.join('\n')}
                        onChange={(e) => handleMealChange(index, 'instructions', e.target.value.split('\n'))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL (optional)</Label>
                      <Input
                        type="url"
                        value={meal.imageUrl}
                        onChange={(e) => handleMealChange(index, 'imageUrl', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/plans')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Plan...' : 'Create Plan'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}; 