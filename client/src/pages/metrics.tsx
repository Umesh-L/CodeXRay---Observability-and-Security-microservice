import { ProtectedRoute } from "@/components/protected-route";
import { MetricChart } from "@/components/metric-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metric, SummaryReport } from "@shared/schema";
import { Activity, TrendingUp } from "lucide-react";

export default function Metrics() {
  const { data: metricsHistory, isLoading: historyLoading } = useQuery<Metric[]>({
    queryKey: ['/api/metrics/history'],
    refetchInterval: 10000,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<SummaryReport>({
    queryKey: ['/api/summary'],
    refetchInterval: 30000,
  });

  return (
    <ProtectedRoute>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Metrics</h1>
            <p className="text-sm text-muted-foreground">Detailed system performance metrics</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {summaryLoading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : summary ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average CPU Usage</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono" data-testid="text-avg-cpu">
                      {summary.averageMetrics.CPU.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on last 10 readings
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Memory Usage</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono" data-testid="text-avg-memory">
                      {summary.averageMetrics.MEMORY.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on last 10 readings
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>

          {historyLoading ? (
            <Skeleton className="h-96" />
          ) : metricsHistory && metricsHistory.length > 0 ? (
            <MetricChart data={metricsHistory} title="Metrics History" />
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No metrics data available yet</p>
                <p className="text-sm mt-2">Metrics will appear as the system collects data</p>
              </CardContent>
            </Card>
          )}

          {summaryLoading ? (
            <Skeleton className="h-64" />
          ) : summary && summary.recentAlerts.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Alert Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.recentAlerts.slice(0, 5).map((alert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-md"
                      data-testid={`recent-alert-${idx}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{alert.type}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {alert.value.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
