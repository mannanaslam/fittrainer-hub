import { useState } from 'react';
import type { DietPlan, Meal } from '../../types';
import { dietPlanApi, mealApi } from '../../lib/supabase/api';

interface DietPlanFormProps {
  initialData?: DietPlan;
  trainerId: string;
  onSubmit: (plan: DietPlan) => void;
  onCancel: () => void;
}

export default function DietPlanForm({
  initialData,
  trainerId,
  onSubmit,
  onCancel,
}: DietPlanFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [meals, setMeals] = useState<Meal[]>(initialData?.meals || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const planData = {
        trainerId,
        title,
        description,
        duration,
        isPremium,
        price: isPremium ? price : undefined,
        meals,
      };

      let plan: DietPlan;
      if (initialData) {
        plan = await dietPlanApi.updateDietPlan(initialData.id, planData);
      } else {
        plan = await dietPlanApi.createDietPlan(planData);
      }

      onSubmit(plan);
    } catch (err) {
      setError('Failed to save diet plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      {
        id: '',
        name: '',
        description: '',
        macros: {
          protein: 0,
          carbs: 0,
          fats: 0,
        },
        calories: 0,
        ingredients: [],
        instructions: [],
      },
    ]);
  };

  const handleUpdateMeal = (index: number, updates: Partial<Meal>) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = { ...updatedMeals[index], ...updates };
    setMeals(updatedMeals);
  };

  const handleRemoveMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleAddIngredient = (mealIndex: number) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients.push('');
    setMeals(updatedMeals);
  };

  const handleUpdateIngredient = (mealIndex: number, ingredientIndex: number, value: string) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients[ingredientIndex] = value;
    setMeals(updatedMeals);
  };

  const handleRemoveIngredient = (mealIndex: number, ingredientIndex: number) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].ingredients = updatedMeals[mealIndex].ingredients.filter(
      (_, i) => i !== ingredientIndex
    );
    setMeals(updatedMeals);
  };

  const handleAddInstruction = (mealIndex: number) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].instructions.push('');
    setMeals(updatedMeals);
  };

  const handleUpdateInstruction = (mealIndex: number, instructionIndex: number, value: string) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].instructions[instructionIndex] = value;
    setMeals(updatedMeals);
  };

  const handleRemoveInstruction = (mealIndex: number, instructionIndex: number) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].instructions = updatedMeals[mealIndex].instructions.filter(
      (_, i) => i !== instructionIndex
    );
    setMeals(updatedMeals);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (days)
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={1}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPremium"
          checked={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-900">
          Premium Plan
        </label>
      </div>

      {isPremium && (
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={0.01}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Meals</h3>
          <button
            type="button"
            onClick={handleAddMeal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Meal
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-medium text-gray-900">Meal {mealIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveMeal(mealIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => handleUpdateMeal(mealIndex, { name: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={meal.description}
                    onChange={(e) => handleUpdateMeal(mealIndex, { description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Calories</label>
                  <input
                    type="number"
                    value={meal.calories}
                    onChange={(e) => handleUpdateMeal(mealIndex, { calories: Number(e.target.value) })}
                    min={0}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                  <input
                    type="number"
                    value={meal.macros.protein}
                    onChange={(e) =>
                      handleUpdateMeal(mealIndex, {
                        macros: { ...meal.macros, protein: Number(e.target.value) },
                      })
                    }
                    min={0}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                  <input
                    type="number"
                    value={meal.macros.carbs}
                    onChange={(e) =>
                      handleUpdateMeal(mealIndex, {
                        macros: { ...meal.macros, carbs: Number(e.target.value) },
                      })
                    }
                    min={0}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fats (g)</label>
                  <input
                    type="number"
                    value={meal.macros.fats}
                    onChange={(e) =>
                      handleUpdateMeal(mealIndex, {
                        macros: { ...meal.macros, fats: Number(e.target.value) },
                      })
                    }
                    min={0}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">Ingredients</h5>
                  <button
                    type="button"
                    onClick={() => handleAddIngredient(mealIndex)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Add Ingredient
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {meal.ingredients.map((ingredient, ingredientIndex) => (
                    <div key={ingredientIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) =>
                          handleUpdateIngredient(mealIndex, ingredientIndex, e.target.value)
                        }
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(mealIndex, ingredientIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">Instructions</h5>
                  <button
                    type="button"
                    onClick={() => handleAddInstruction(mealIndex)}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Add Step
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {meal.instructions.map((instruction, instructionIndex) => (
                    <div key={instructionIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) =>
                          handleUpdateInstruction(mealIndex, instructionIndex, e.target.value)
                        }
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(mealIndex, instructionIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
} 