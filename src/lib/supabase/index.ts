// Re-export all modules to maintain backward compatibility
export * from '@/integrations/supabase/client';
export * from './subscriptions';
export * from './messages';
export * from './plans';
export * from './workouts';
export * from './meal-plans';
export * from './profiles';
export * from './auth';

// Export plan-related types and functions
export type {
  Plan,
  Exercise,
  Workout,
  Meal,
  CreatePlanData,
  Subscription,
  CreateSubscriptionData,
} from './plans';

export {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  subscribeToPlan,
  getSubscribedPlans,
  getTrainerPlans,
} from './plans';

// Re-export workout functions
export {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from './workouts';

// Re-export meal plan functions
export {
  getMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from './meal-plans';
