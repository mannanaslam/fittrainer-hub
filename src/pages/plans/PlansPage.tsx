import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlans } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number;
  isPremium: boolean;
  price: number;
  created_at: string;
  trainer: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    duration: 'all',
    price: 'all',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await getPlans();
      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.type === 'all' || plan.type === filters.type;
    const matchesDuration = filters.duration === 'all' || plan.duration <= parseInt(filters.duration);
    const matchesPrice = filters.price === 'all' || 
      (filters.price === 'free' && !plan.isPremium) ||
      (filters.price === 'premium' && plan.isPremium);

    return matchesSearch && matchesType && matchesDuration && matchesPrice;
  });

  const getTypeBadge = (type: string) => {
    const colors = {
      workout: 'bg-blue-500',
      diet: 'bg-green-500',
      combined: 'bg-purple-500',
    };
    return (
      <Badge className={`${colors[type as keyof typeof colors]} text-white`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fitness Plans</h1>
        <Button asChild>
          <Link to="/plans/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Plan Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="workout">Workout</SelectItem>
            <SelectItem value="diet">Diet</SelectItem>
            <SelectItem value="combined">Combined</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.duration}
          onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Duration</SelectItem>
            <SelectItem value="7">7 days or less</SelectItem>
            <SelectItem value="14">14 days or less</SelectItem>
            <SelectItem value="30">30 days or less</SelectItem>
            <SelectItem value="90">90 days or less</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.price}
          onValueChange={(value) => setFilters(prev => ({ ...prev, price: value }))}
        >
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="free">Free Plans</SelectItem>
            <SelectItem value="premium">Premium Plans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {plan.description}
                  </CardDescription>
                </div>
                {getTypeBadge(plan.type)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span>{plan.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Trainer</span>
                  <span>{plan.trainer.first_name} {plan.trainer.last_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span>
                    {plan.isPremium ? (
                      <span className="font-medium">${plan.price}</span>
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/plans/${plan.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No plans found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}; 