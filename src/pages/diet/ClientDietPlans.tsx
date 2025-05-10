import { useAuth } from '../../contexts/AuthContext';
import ClientDietPlanView from '../../components/diet/ClientDietPlanView';

export default function ClientDietPlans() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Diet Plans
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <ClientDietPlanView clientId={user.id} />
      </div>
    </div>
  );
} 