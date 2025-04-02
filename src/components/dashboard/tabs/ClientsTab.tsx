
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";

export function ClientsTab() {
  const navigate = useNavigate();
  
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button onClick={() => navigate("/clients/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>
      <p className="mb-6 text-muted-foreground">
        Manage all your client relationships, track progress, and assign workout plans.
      </p>
      <div className="mb-4">
        <Button variant="outline" className="mr-2">All Clients</Button>
        <Button variant="outline" className="mr-2">Active</Button>
        <Button variant="outline">Inactive</Button>
      </div>
      <div className="glass-card rounded-xl p-4 mb-6">
        <p className="text-center py-6">Click on "Clients" in the main navigation to see the full client management page.</p>
      </div>
    </Container>
  );
}
