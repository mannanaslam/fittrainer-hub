import { useState } from 'react';
import type { DietPlan } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import DietPlanForm from '../../components/diet/DietPlanForm';
import DietPlanList from '../../components/diet/DietPlanList';

export default function DietPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  if (!user) {
    return null;
  }

  const handleCreate = () => {
    setSelectedPlan(undefined);
    setIsCreating(true);
  };

  const handleEdit = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setSelectedPlan(undefined);
    setIsCreating(false);
  };

  const handleSubmit = (plan: DietPlan) => {
    setSelectedPlan(undefined);
    setIsCreating(false);
  };

  const handleDelete = (planId: string) => {
    // The list component handles the actual deletion
    setSelectedPlan(undefined);
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Diet Plans
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
          <DietPlanForm
            initialData={selectedPlan}
            trainerId={user.id}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <DietPlanList
            trainerId={user.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
} 