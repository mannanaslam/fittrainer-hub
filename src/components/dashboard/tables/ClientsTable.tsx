import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "@/lib/supabase/profiles";
import { Profile } from "@/types/supabase";

export function ClientsTable() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const fetchedClients = await getAllClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);
  
  // Helper to calculate progress (would be more sophisticated in real app)
  const calculateProgress = (client: Profile) => {
    // This is a placeholder - in a real app, progress would be calculated based on goals, workouts, etc.
    const clientId = client.id;
    const lastDigit = parseInt(clientId.slice(-1), 16);
    return Math.max(25, Math.min(95, (lastDigit * 10) + 25)); // Generate progress between 25-95%
  };
  
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-4 text-sm font-medium">Name</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Plan</th>
              <th className="text-left p-4 text-sm font-medium">Progress</th>
              <th className="text-right p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <div className="animate-pulse">Loading clients...</div>
                </td>
              </tr>
            ) : clients.length > 0 ? (
              clients.map((client) => {
                const progress = calculateProgress(client);
                
                return (
                  <tr key={client.id} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {client.name?.charAt(0) || 'C'}
                        </div>
                        <span className="font-medium">{client.name || client.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.subscription_plan ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {client.subscription_plan ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{client.subscription_plan || "No Plan"}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
