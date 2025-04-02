
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ label, value, trend }: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && (
          <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
