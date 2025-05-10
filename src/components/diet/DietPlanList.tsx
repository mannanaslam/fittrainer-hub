import { useState, useEffect } from 'react';
import type { DietPlan } from '../../types';
import { dietPlanApi } from '../../lib/supabase/api';

interface DietPlanListProps {
  trainerId: string;
  onEdit: (plan: DietPlan) => void;
  onDelete: (planId: string) => void;
}

export default function DietPlanList({ trainerId, onEdit, onDelete }: DietPlanListProps) {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, [trainerId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const fetchedPlans = await dietPlanApi.getDietPlans(trainerId);
      setPlans(fetchedPlans);
      setError('');
    } catch (err) {
      setError('Failed to fetch diet plans. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await dietPlanApi.deleteDietPlan(planId);
        setPlans(plans.filter((plan) => plan.id !== planId));
      } catch (err) {
        setError('Failed to delete diet plan. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No diet plans</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new diet plan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{plan.title}</h3>
              {plan.isPremium && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Premium
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">Duration:</span>{' '}
                <span className="text-gray-900">{plan.duration} days</span>
              </div>
              {plan.isPremium && (
                <div>
                  <span className="text-gray-500">Price:</span>{' '}
                  <span className="text-gray-900">${plan.price}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-gray-500">Meals:</span>{' '}
              <span className="text-gray-900">{plan.meals.length}</span>
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => onEdit(plan)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 