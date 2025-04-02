
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Sample client data
const clients = [
  { id: 1, name: "Alex Johnson", status: "Active", plan: "Strength Training", progress: 75 },
  { id: 2, name: "Maria Garcia", status: "Active", plan: "Weight Loss", progress: 60 },
  { id: 3, name: "Sam Taylor", status: "Inactive", plan: "Muscle Gain", progress: 30 },
  { id: 4, name: "Jamie Wilson", status: "Active", plan: "General Fitness", progress: 85 },
];

export function ClientsTable() {
  const navigate = useNavigate();
  
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
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-border">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {client.name.charAt(0)}
                    </div>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    client.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{client.plan}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2 mr-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${client.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{client.progress}%</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
