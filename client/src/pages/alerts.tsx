import { ProtectedRoute } from "@/components/protected-route";
import { AlertCard } from "@/components/alert-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@shared/schema";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type FilterType = 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO';

export default function Alerts() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 5000,
  });

  const filteredAlerts = alerts?.filter(alert => 
    filter === 'ALL' || alert.severity === filter
  ) || [];

  const handleDismissAlert = async (id: string) => {
    try {
      await apiRequest('POST', `/api/alerts/${id}/acknowledge`);
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alert acknowledged",
        description: "The alert has been marked as acknowledged",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    try {
      await apiRequest('DELETE', '/api/alerts/clear');
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alerts cleared",
        description: "All alerts have been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear alerts",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Alerts</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage system alerts</p>
            </div>
            {alerts && alerts.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as FilterType[]).map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
                data-testid={`button-filter-${type.toLowerCase()}`}
              >
                {type}
                {alerts && (
                  <Badge variant="secondary" className="ml-2">
                    {type === 'ALL' 
                      ? alerts.length 
                      : alerts.filter(a => a.severity === type).length
                    }
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
                No {filter !== 'ALL' && filter.toLowerCase()} alerts to display
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
