import type { LogEntry, LogAnalysisResult } from "@shared/schema";

export class LogAnalyzer {
  /**
   * Parse a log file and analyze its contents
   * Uses efficient hash maps for O(n) time complexity
   */
  static analyze(logContent: string): LogAnalysisResult {
    const lines = logContent.split('\n').filter(line => line.trim());
    
    const counts = {
      INFO: 0,
      WARN: 0,
      ERROR: 0,
    };

    // Hash map to store error messages and their frequencies
    const errorFrequency = new Map<string, number>();

    // Parse each line
    for (const line of lines) {
      const entry = this.parseLine(line);
      
      if (entry) {
        counts[entry.level]++;
        
        // Track error messages for frequency analysis
        if (entry.level === 'ERROR') {
          const count = errorFrequency.get(entry.message) || 0;
          errorFrequency.set(entry.message, count + 1);
        }
      }
    }

    // Get top 5 most frequent errors using efficient sorting
    const topErrors = Array.from(errorFrequency.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalLines: lines.length,
      counts,
      topErrors,
    };
  }

  /**
   * Parse a single log line
   * Supports common log formats: [LEVEL] message, LEVEL: message, etc.
   */
  private static parseLine(line: string): LogEntry | null {
    // Try different log format patterns
    const patterns = [
      /^\[(\w+)\]\s+(.+)$/,           // [LEVEL] message
      /^(\w+):\s+(.+)$/,              // LEVEL: message
      /^\d{4}-\d{2}-\d{2}.*?\[(\w+)\]\s+(.+)$/, // timestamp [LEVEL] message
      /^\d{4}-\d{2}-\d{2}.*?(\w+):\s+(.+)$/,    // timestamp LEVEL: message
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const level = match[1].toUpperCase();
        if (level === 'INFO' || level === 'WARN' || level === 'ERROR') {
          return {
            level: level as 'INFO' | 'WARN' | 'ERROR',
            message: match[2].trim(),
            timestamp: new Date().toISOString(),
          };
        }
      }
    }

    // If no pattern matches, try to find level keywords anywhere in the line
    if (line.toUpperCase().includes('ERROR')) {
      return { level: 'ERROR', message: line, timestamp: new Date().toISOString() };
    } else if (line.toUpperCase().includes('WARN')) {
      return { level: 'WARN', message: line, timestamp: new Date().toISOString() };
    } else if (line.toUpperCase().includes('INFO')) {
      return { level: 'INFO', message: line, timestamp: new Date().toISOString() };
    }

    return null;
  }
}
