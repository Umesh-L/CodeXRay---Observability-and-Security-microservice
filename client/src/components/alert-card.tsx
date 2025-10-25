import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@shared/schema";

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
}

export function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const getBorderColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-l-4 border-l-destructive';
      case 'WARNING':
        return 'border-l-4 border-l-yellow-500';
      case 'INFO':
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-muted';
    }
  };

  const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'WARNING':
        return 'default';
      case 'INFO':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={cn("p-4", getBorderColor(alert.severity), alert.acknowledged && "opacity-60")} data-testid={`card-alert-${alert.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">{alert.message}</span>
            <Badge variant={getSeverityVariant(alert.severity)} className="text-xs" data-testid={`badge-${alert.severity.toLowerCase()}`}>
              {alert.severity}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono" data-testid="text-timestamp">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            <span data-testid="text-metric-value">
              {alert.type}: {alert.value.toFixed(1)}% (Threshold: {alert.threshold}%)
            </span>
          </div>
        </div>
        {onDismiss && !alert.acknowledged && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDismiss(alert.id)}
            data-testid="button-dismiss-alert"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
