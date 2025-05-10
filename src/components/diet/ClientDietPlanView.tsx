import { useState, useEffect } from 'react';
import type { DietPlan } from '../../types';
import { dietPlanApi } from '../../lib/supabase/api';

interface ClientDietPlanViewProps {
  clientId: string;
}

export default function ClientDietPlanView({ clientId }: ClientDietPlanViewProps) {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [clientId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const fetchedPlans = await dietPlanApi.getDietPlans(clientId);
      setPlans(fetchedPlans);
      setError('');
    } catch (err) {
      setError('Failed to fetch diet plans. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No diet plans assigned</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your trainer will assign diet plans to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => setSelectedPlan(plan)}
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
                <div>
                  <span className="text-gray-500">Meals:</span>{' '}
                  <span className="text-gray-900">{plan.meals.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedPlan.title}</h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">{selectedPlan.description}</p>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="space-y-6">
                {selectedPlan.meals.map((meal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900">{meal.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{meal.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <span className="text-sm text-gray-500">Calories</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {meal.calories}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Protein</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {meal.macros.protein}g
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Carbs</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {meal.macros.carbs}g
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Fats</span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {meal.macros.fats}g
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900">Ingredients</h5>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                        {meal.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900">Instructions</h5>
                      <ol className="mt-2 list-decimal list-inside text-sm text-gray-500">
                        {meal.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 