import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/lib/auth";
import type { LogAnalysisResult } from "@shared/schema";

export default function Logs() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<LogAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a log file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('logfile', file);

      // Get auth token for authenticated request
      const token = getAuthToken();
      
      const response = await fetch('/api/logs/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze log file');
      }

      const result = await response.json();
      setAnalysis(result);
      toast({
        title: "Analysis complete",
        description: `Processed ${result.totalLines} log entries`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze log file",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Log Analyzer</h1>
            <p className="text-sm text-muted-foreground">Upload and analyze system log files</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upload Log File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="file"
                  accept=".log,.txt"
                  onChange={handleFileChange}
                  data-testid="input-log-file"
                  className="flex-1"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!file || isAnalyzing}
                  data-testid="button-analyze"
                >
                  {isAnalyzing ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              {file && (
                <div className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </CardContent>
          </Card>

          {analysis && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-2xl font-bold font-mono" data-testid="text-total-lines">
                        {analysis.totalLines}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Total Lines</div>
                    </div>
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-2xl font-bold font-mono text-blue-500" data-testid="text-info-count">
                        {analysis.counts.INFO}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Badge variant="secondary" className="text-xs">INFO</Badge>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-2xl font-bold font-mono text-yellow-500" data-testid="text-warn-count">
                        {analysis.counts.WARN}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Badge variant="default" className="text-xs">WARN</Badge>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-2xl font-bold font-mono text-red-500" data-testid="text-error-count">
                        {analysis.counts.ERROR}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Badge variant="destructive" className="text-xs">ERROR</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysis.topErrors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Top 5 Most Frequent Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.topErrors.map((error, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-4 border rounded-md"
                          data-testid={`error-${idx}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="destructive" className="text-xs">#{idx + 1}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {error.count} occurrence{error.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="font-mono text-sm break-all">
                              {error.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!analysis && (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No analysis results yet</p>
                <p className="text-sm mt-2">Upload a log file to see the analysis</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
