import { useState } from 'react';
import type { WorkoutPlan, Exercise } from '../../types';
import { workoutPlanApi, exerciseApi } from '../../lib/supabase/api';

interface WorkoutPlanFormProps {
  initialData?: WorkoutPlan;
  trainerId: string;
  onSubmit: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export default function WorkoutPlanForm({
  initialData,
  trainerId,
  onSubmit,
  onCancel,
}: WorkoutPlanFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || []);
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
        exercises,
      };

      let plan: WorkoutPlan;
      if (initialData) {
        plan = await workoutPlanApi.updateWorkoutPlan(initialData.id, planData);
      } else {
        plan = await workoutPlanApi.createWorkoutPlan(planData);
      }

      onSubmit(plan);
    } catch (err) {
      setError('Failed to save workout plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: '',
        name: '',
        description: '',
        sets: 3,
        reps: 10,
        restInterval: 60,
        equipment: [],
        videoUrl: '',
        notes: '',
        modifications: [],
      },
    ]);
  };

  const handleUpdateExercise = (index: number, updates: Partial<Exercise>) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], ...updates };
    setExercises(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
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
          <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
          <button
            type="button"
            onClick={handleAddExercise}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Exercise
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-medium text-gray-900">Exercise {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(index)}
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
                    value={exercise.name}
                    onChange={(e) => handleUpdateExercise(index, { name: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={exercise.description}
                    onChange={(e) => handleUpdateExercise(index, { description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Sets</label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleUpdateExercise(index, { sets: Number(e.target.value) })}
                    min={1}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reps</label>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleUpdateExercise(index, { reps: Number(e.target.value) })}
                    min={1}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rest Interval (seconds)</label>
                  <input
                    type="number"
                    value={exercise.restInterval}
                    onChange={(e) => handleUpdateExercise(index, { restInterval: Number(e.target.value) })}
                    min={0}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Video URL</label>
                  <input
                    type="url"
                    value={exercise.videoUrl}
                    onChange={(e) => handleUpdateExercise(index, { videoUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
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