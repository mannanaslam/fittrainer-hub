import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WorkoutPlans from './workout/WorkoutPlans';
import DietPlans from './diet/DietPlans';

// Placeholder components for other sections
const Clients = () => <div>Clients Management</div>;
const Analytics = () => <div>Analytics Dashboard</div>;

export default function TrainerDashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Workout Plans', path: '/trainer/workout-plans', component: WorkoutPlans },
    { name: 'Diet Plans', path: '/trainer/diet-plans', component: DietPlans },
    { name: 'Clients', path: '/trainer/clients', component: Clients },
    { name: 'Analytics', path: '/trainer/analytics', component: Analytics },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="text-xl font-semibold">Trainer Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <span className="sr-only">Close sidebar</span>
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

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPath === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src={user?.profile.avatarUrl || 'https://via.placeholder.com/32'}
              alt={user?.profile.firstName + ' ' + user?.profile.lastName}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.profile.firstName} {user?.profile.lastName}
              </p>
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`lg:pl-64 flex flex-col flex-1 ${
          isSidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <span className="sr-only">Open sidebar</span>
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Routes>
                {navigation.map((item) => (
                  <Route
                    key={item.path}
                    path={item.path.replace('/trainer', '')}
                    element={<item.component />}
                  />
                ))}
                <Route path="/" element={<WorkoutPlans />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 