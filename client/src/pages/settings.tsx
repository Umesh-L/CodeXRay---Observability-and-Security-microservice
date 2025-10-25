import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ThresholdConfig } from "@shared/schema";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [cpuWarning, setCpuWarning] = useState(60);
  const [cpuCritical, setCpuCritical] = useState(80);
  const [memoryWarning, setMemoryWarning] = useState(70);
  const [memoryCritical, setMemoryCritical] = useState(85);
  const [isSaving, setIsSaving] = useState(false);

  const { data: thresholds, isLoading } = useQuery<ThresholdConfig[]>({
    queryKey: ['/api/thresholds'],
  });

  useEffect(() => {
    if (thresholds) {
      const cpuConfig = thresholds.find(t => t.type === 'CPU');
      const memoryConfig = thresholds.find(t => t.type === 'MEMORY');
      
      if (cpuConfig) {
        setCpuWarning(cpuConfig.warningThreshold);
        setCpuCritical(cpuConfig.criticalThreshold);
      }
      if (memoryConfig) {
        setMemoryWarning(memoryConfig.warningThreshold);
        setMemoryCritical(memoryConfig.criticalThreshold);
      }
    }
  }, [thresholds]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiRequest('PUT', '/api/thresholds/CPU', {
        warningThreshold: cpuWarning,
        criticalThreshold: cpuCritical,
      });
      await apiRequest('PUT', '/api/thresholds/MEMORY', {
        warningThreshold: memoryWarning,
        criticalThreshold: memoryCritical,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/thresholds'] });
      toast({
        title: "Settings saved",
        description: "Alert thresholds have been updated",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to update thresholds",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (thresholds) {
      const cpuConfig = thresholds.find(t => t.type === 'CPU');
      const memoryConfig = thresholds.find(t => t.type === 'MEMORY');
      
      if (cpuConfig) {
        setCpuWarning(cpuConfig.warningThreshold);
        setCpuCritical(cpuConfig.criticalThreshold);
      }
      if (memoryConfig) {
        setMemoryWarning(memoryConfig.warningThreshold);
        setMemoryCritical(memoryConfig.criticalThreshold);
      }

      toast({
        title: "Reset complete",
        description: "Thresholds have been reset to saved values",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure alert thresholds and preferences</p>
          </div>

          {isLoading ? (
            <>
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">CPU Alert Thresholds</CardTitle>
                  <CardDescription>Set warning and critical thresholds for CPU usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Warning Threshold</Label>
                        <Input
                          type="number"
                          value={cpuWarning}
                          onChange={(e) => setCpuWarning(Number(e.target.value))}
                          className="w-20 text-right"
                          min={0}
                          max={100}
                          data-testid="input-cpu-warning"
                        />
                      </div>
                      <Slider
                        value={[cpuWarning]}
                        onValueChange={([val]) => setCpuWarning(val)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="slider-cpu-warning"
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when CPU usage exceeds {cpuWarning}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Critical Threshold</Label>
                        <Input
                          type="number"
                          value={cpuCritical}
                          onChange={(e) => setCpuCritical(Number(e.target.value))}
                          className="w-20 text-right"
                          min={0}
                          max={100}
                          data-testid="input-cpu-critical"
                        />
                      </div>
                      <Slider
                        value={[cpuCritical]}
                        onValueChange={([val]) => setCpuCritical(val)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="slider-cpu-critical"
                      />
                      <p className="text-xs text-muted-foreground">
                        Critical alert when CPU usage exceeds {cpuCritical}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Memory Alert Thresholds</CardTitle>
                  <CardDescription>Set warning and critical thresholds for memory usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Warning Threshold</Label>
                        <Input
                          type="number"
                          value={memoryWarning}
                          onChange={(e) => setMemoryWarning(Number(e.target.value))}
                          className="w-20 text-right"
                          min={0}
                          max={100}
                          data-testid="input-memory-warning"
                        />
                      </div>
                      <Slider
                        value={[memoryWarning]}
                        onValueChange={([val]) => setMemoryWarning(val)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="slider-memory-warning"
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when memory usage exceeds {memoryWarning}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Critical Threshold</Label>
                        <Input
                          type="number"
                          value={memoryCritical}
                          onChange={(e) => setMemoryCritical(Number(e.target.value))}
                          className="w-20 text-right"
                          min={0}
                          max={100}
                          data-testid="input-memory-critical"
                        />
                      </div>
                      <Slider
                        value={[memoryCritical]}
                        onValueChange={([val]) => setMemoryCritical(val)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="slider-memory-critical"
                      />
                      <p className="text-xs text-muted-foreground">
                        Critical alert when memory usage exceeds {memoryCritical}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  data-testid="button-save-settings"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset-settings"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
