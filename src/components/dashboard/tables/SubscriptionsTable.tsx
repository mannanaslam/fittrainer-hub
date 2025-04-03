
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSubscriptions } from "@/lib/supabase";
import { Subscription } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

export function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const fetchedSubscriptions = await getSubscriptions();
        setSubscriptions(fetchedSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [toast]);
  
  // Helper to format the price from the plan string
  const formatPrice = (plan: string) => {
    // Extract numeric value from plan name
    const priceMatch = plan.match(/\$?(\d+(\.\d+)?)/);
    if (priceMatch) {
      return `$${priceMatch[1]}/month`;
    }
    return '$0/month';
  };
  
  // Count subscribers per plan type
  const countSubscribers = (plan: string) => {
    return subscriptions.filter(sub => sub.plan === plan).length;
  };
  
  // Get unique plan types
  const uniquePlans = [...new Set(subscriptions.map(sub => sub.plan))];
  
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-4 text-sm font-medium">Plan Name</th>
              <th className="text-left p-4 text-sm font-medium">Subscribers</th>
              <th className="text-left p-4 text-sm font-medium">Price</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-right p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <div className="animate-pulse">Loading subscriptions...</div>
                </td>
              </tr>
            ) : uniquePlans.length > 0 ? (
              uniquePlans.map((plan, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="p-4 font-medium">{plan}</td>
                  <td className="p-4">{countSubscribers(plan)}</td>
                  <td className="p-4">{formatPrice(plan)}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No subscription plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
