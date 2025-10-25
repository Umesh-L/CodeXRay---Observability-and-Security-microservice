import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Metric } from "@shared/schema";

interface MetricChartProps {
  data: Metric[];
  title?: string;
}

export function MetricChart({ data, title = "System Metrics History" }: MetricChartProps) {
  const chartData = data.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    [metric.type]: metric.value,
    timestamp: metric.timestamp,
  }));

  const groupedData = chartData.reduce((acc, curr) => {
    const existing = acc.find(item => item.time === curr.time);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as any[]);

  const sortedData = groupedData.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ).slice(-20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="CPU"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
              name="CPU %"
            />
            <Line
              type="monotone"
              dataKey="MEMORY"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              name="Memory %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
