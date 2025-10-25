import { Card } from "@/components/ui/card";
import { Cpu, HardDrive, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  type: 'CPU' | 'MEMORY';
  value: number;
  trend?: number;
  className?: string;
}

export function MetricCard({ type, value, trend, className }: MetricCardProps) {
  const Icon = type === 'CPU' ? Cpu : HardDrive;
  const isIncreasing = trend !== undefined && trend > 0;
  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown;

  const getValueColor = (val: number) => {
    if (val >= 80) return 'text-destructive';
    if (val >= 60) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-green-600 dark:text-green-500';
  };

  return (
    <Card className={cn("p-6 space-y-2", className)} data-testid={`card-metric-${type.toLowerCase()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {type === 'CPU' ? 'CPU Usage' : 'Memory Usage'}
          </span>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            <TrendIcon className={cn("h-3 w-3", isIncreasing ? "text-red-500" : "text-green-500")} />
            <span className={cn(isIncreasing ? "text-red-500" : "text-green-500")}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div>
        <div className={cn("text-3xl font-bold font-mono", getValueColor(value))} data-testid={`text-${type.toLowerCase()}-value`}>
          {value.toFixed(1)}%
        </div>
        <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              value >= 80 ? "bg-destructive" :
              value >= 60 ? "bg-yellow-500" : "bg-green-500"
            )}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
