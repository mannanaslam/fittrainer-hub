import { useState } from 'react';
import type { WorkoutPlan } from '../../types';
import WorkoutPlanForm from '../../components/workout/WorkoutPlanForm';
import WorkoutPlanList from '../../components/workout/WorkoutPlanList';
import { useAuth } from '../../contexts/AuthContext';

export default function WorkoutPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsCreating(true);
  };

  const handleEdit = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedPlan(null);
    setIsCreating(false);
  };

  const handleSubmit = (plan: WorkoutPlan) => {
    setSelectedPlan(null);
    setIsCreating(false);
  };

  const handleDelete = (planId: string) => {
    // Handle deletion success
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Workout Plans
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleCreate}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create Plan
          </button>
        </div>
      </div>

      <div className="mt-8">
        {isCreating ? (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedPlan ? 'Edit Workout Plan' : 'Create Workout Plan'}
              </h3>
              <div className="mt-5">
                <WorkoutPlanForm
                  initialData={selectedPlan || undefined}
                  trainerId={user.id}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        ) : (
          <WorkoutPlanList
            trainerId={user.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
} 