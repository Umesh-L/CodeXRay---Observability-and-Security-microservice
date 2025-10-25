import * as si from 'systeminformation';
import { storage } from '../storage';
import type { InsertMetric, InsertAlert } from '@shared/schema';

export class MetricsCollector {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private previousMetrics = {
    cpu: 0,
    memory: 0,
  };
  private lastAlertTime = {
    CPU: 0,
    MEMORY: 0,
  };

  /**
   * Collect current CPU and Memory metrics
   * Uses systeminformation library for accurate readings
   */
  async collectMetrics(): Promise<void> {
    if (!this.isRunning) return;

    try {
      // Get CPU usage
      const cpuLoad = await si.currentLoad();
      const cpuUsage = cpuLoad.currentLoad;

      // Get memory usage
      const memory = await si.mem();
      const memoryUsage = (memory.used / memory.total) * 100;

      // Store metrics
      const cpuMetric: InsertMetric = {
        type: 'CPU',
        value: Math.round(cpuUsage * 10) / 10, // Round to 1 decimal
      };

      const memoryMetric: InsertMetric = {
        type: 'MEMORY',
        value: Math.round(memoryUsage * 10) / 10,
      };

      await storage.createMetric(cpuMetric);
      await storage.createMetric(memoryMetric);

      // Check thresholds and generate alerts
      await this.checkThresholds(cpuMetric.value, memoryMetric.value);

      // Update previous metrics for trend calculation
      this.previousMetrics.cpu = cpuMetric.value;
      this.previousMetrics.memory = memoryMetric.value;

      console.log(`[MetricsCollector] CPU: ${cpuMetric.value}%, Memory: ${memoryMetric.value}%`);
    } catch (error) {
      console.error('[MetricsCollector] Error collecting metrics:', error);
    }
  }

  /**
   * Check if metrics exceed thresholds and generate alerts
   * Prevents duplicate alerts within 60 seconds
   */
  private async checkThresholds(cpuValue: number, memoryValue: number): Promise<void> {
    const now = Date.now();
    
    // Get threshold configurations
    const cpuThreshold = await storage.getThreshold('CPU');
    const memoryThreshold = await storage.getThreshold('MEMORY');

    // Check CPU threshold
    if (cpuThreshold) {
      const timeSinceLastAlert = now - this.lastAlertTime.CPU;
      
      if (cpuValue >= cpuThreshold.criticalThreshold && timeSinceLastAlert > 60000) {
        const alert: InsertAlert = {
          type: 'CPU',
          severity: 'CRITICAL',
          message: `CPU usage critical: ${cpuValue}%`,
          value: cpuValue,
          threshold: cpuThreshold.criticalThreshold,
        };
        await storage.createAlert(alert);
        this.lastAlertTime.CPU = now;
        console.log(`[Alert] ${alert.message}`);
      } else if (cpuValue >= cpuThreshold.warningThreshold && timeSinceLastAlert > 60000) {
        const alert: InsertAlert = {
          type: 'CPU',
          severity: 'WARNING',
          message: `CPU usage elevated: ${cpuValue}%`,
          value: cpuValue,
          threshold: cpuThreshold.warningThreshold,
        };
        await storage.createAlert(alert);
        this.lastAlertTime.CPU = now;
        console.log(`[Alert] ${alert.message}`);
      }
    }

    // Check Memory threshold
    if (memoryThreshold) {
      const timeSinceLastAlert = now - this.lastAlertTime.MEMORY;
      
      if (memoryValue >= memoryThreshold.criticalThreshold && timeSinceLastAlert > 60000) {
        const alert: InsertAlert = {
          type: 'MEMORY',
          severity: 'CRITICAL',
          message: `Memory usage critical: ${memoryValue}%`,
          value: memoryValue,
          threshold: memoryThreshold.criticalThreshold,
        };
        await storage.createAlert(alert);
        this.lastAlertTime.MEMORY = now;
        console.log(`[Alert] ${alert.message}`);
      } else if (memoryValue >= memoryThreshold.warningThreshold && timeSinceLastAlert > 60000) {
        const alert: InsertAlert = {
          type: 'MEMORY',
          severity: 'WARNING',
          message: `Memory usage elevated: ${memoryValue}%`,
          value: memoryValue,
          threshold: memoryThreshold.warningThreshold,
        };
        await storage.createAlert(alert);
        this.lastAlertTime.MEMORY = now;
        console.log(`[Alert] ${alert.message}`);
      }
    }
  }

  /**
   * Start the metrics collection service
   * Runs every 5 seconds using setInterval
   */
  start(): void {
    if (this.isRunning && this.intervalId) {
      console.log('[MetricsCollector] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[MetricsCollector] Starting metrics collection...');

    // Collect initial metrics
    this.collectMetrics();

    // Set up periodic collection every 5 seconds
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, 5000);
  }

  /**
   * Stop the metrics collection service
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[MetricsCollector] Stopped');
  }

  /**
   * Get current metrics with trend calculation
   */
  async getCurrentMetrics(): Promise<{
    cpu: number;
    memory: number;
    cpuTrend: number;
    memoryTrend: number;
  }> {
    const latest = await storage.getLatestMetrics();
    
    const currentCpu = latest.cpu?.value || 0;
    const currentMemory = latest.memory?.value || 0;

    return {
      cpu: currentCpu,
      memory: currentMemory,
      cpuTrend: currentCpu - this.previousMetrics.cpu,
      memoryTrend: currentMemory - this.previousMetrics.memory,
    };
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();
