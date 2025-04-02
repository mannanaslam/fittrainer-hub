
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample subscription data
const subscriptions = [
  { id: 1, name: "Basic Fitness", subscribers: 15, price: "$9.99", status: "active" },
  { id: 2, name: "Premium Strength", subscribers: 8, price: "$19.99", status: "active" },
  { id: 3, name: "Elite Performance", subscribers: 3, price: "$29.99", status: "active" },
];

export function SubscriptionsTable() {
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
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t border-border">
                <td className="p-4 font-medium">{sub.name}</td>
                <td className="p-4">{sub.subscribers}</td>
                <td className="p-4">{sub.price}/month</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
