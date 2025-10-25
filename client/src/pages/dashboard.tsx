import { ProtectedRoute } from "@/components/protected-route";
import { MetricCard } from "@/components/metric-card";
import { AlertCard } from "@/components/alert-card";
import { MetricChart } from "@/components/metric-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metric, Alert } from "@shared/schema";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: currentMetrics, isLoading: metricsLoading } = useQuery<{
    cpu: number;
    memory: number;
    cpuTrend: number;
    memoryTrend: number;
  }>({
    queryKey: ['/api/metrics/current'],
    refetchInterval: 5000,
  });

  const { data: metricsHistory, isLoading: historyLoading } = useQuery<Metric[]>({
    queryKey: ['/api/metrics/history'],
    refetchInterval: 10000,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 5000,
  });

  const recentAlerts = alerts?.slice(0, 10) || [];

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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/metrics/current'] });
    queryClient.invalidateQueries({ queryKey: ['/api/metrics/history'] });
    queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    toast({
      title: "Refreshed",
      description: "Dashboard data updated",
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" data-testid="text-page-title">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time system monitoring and alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 animate-pulse" data-testid="badge-live-status">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Live
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metricsLoading ? (
              <>
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </>
            ) : currentMetrics ? (
              <>
                <MetricCard
                  type="CPU"
                  value={currentMetrics.cpu}
                  trend={currentMetrics.cpuTrend}
                />
                <MetricCard
                  type="MEMORY"
                  value={currentMetrics.memory}
                  trend={currentMetrics.memoryTrend}
                />
                <Card className="p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Total Alerts
                    </span>
                  </div>
                  <div className="text-3xl font-bold font-mono" data-testid="text-total-alerts">
                    {alerts?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alerts?.filter(a => !a.acknowledged).length || 0} unacknowledged
                  </div>
                </Card>
              </>
            ) : null}
          </div>

          {historyLoading ? (
            <Skeleton className="h-80" />
          ) : metricsHistory && metricsHistory.length > 0 ? (
            <MetricChart data={metricsHistory} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No metrics history available yet
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alertsLoading ? (
                <>
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </>
              ) : recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={handleDismissAlert}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No alerts to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
