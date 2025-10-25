import {
  type User,
  type InsertUser,
  type Session,
  type InsertSession,
  type Metric,
  type InsertMetric,
  type Alert,
  type InsertAlert,
  type ThresholdConfig,
  type InsertThresholdConfig,
  type UpdateThresholdConfig,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session management
  getSession(token: string): Promise<Session | undefined>;
  getSessionByUserId(userId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  deleteSession(token: string): Promise<void>;
  deleteSessionsByUserId(userId: string): Promise<void>;

  // Metrics management
  getMetrics(limit?: number): Promise<Metric[]>;
  getLatestMetrics(): Promise<{ cpu: Metric | undefined; memory: Metric | undefined }>;
  createMetric(metric: InsertMetric): Promise<Metric>;

  // Alerts management
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string): Promise<void>;
  clearAllAlerts(): Promise<void>;

  // Threshold configuration
  getThresholds(): Promise<ThresholdConfig[]>;
  getThreshold(type: 'CPU' | 'MEMORY'): Promise<ThresholdConfig | undefined>;
  updateThreshold(type: 'CPU' | 'MEMORY', config: UpdateThresholdConfig): Promise<ThresholdConfig>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private metrics: Metric[];
  private alerts: Map<string, Alert>;
  private thresholds: Map<string, ThresholdConfig>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.metrics = [];
    this.alerts = new Map();
    this.thresholds = new Map();

    // Initialize default thresholds
    this.thresholds.set('CPU', {
      id: randomUUID(),
      type: 'CPU',
      warningThreshold: 60,
      criticalThreshold: 80,
      updatedAt: new Date(),
    });
    this.thresholds.set('MEMORY', {
      id: randomUUID(),
      type: 'MEMORY',
      warningThreshold: 70,
      criticalThreshold: 85,
      updatedAt: new Date(),
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Session methods
  async getSession(token: string): Promise<Session | undefined> {
    const session = this.sessions.get(token);
    if (session && session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return undefined;
    }
    return session;
  }

  async getSessionByUserId(userId: string): Promise<Session | undefined> {
    return Array.from(this.sessions.values()).find(
      (session) => session.userId === userId && session.expiresAt > new Date()
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const token = randomUUID();
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const session: Session = {
      id,
      ...insertSession,
      token,
      createdAt,
      expiresAt,
    };

    this.sessions.set(token, session);
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async deleteSessionsByUserId(userId: string): Promise<void> {
    const sessions = Array.from(this.sessions.entries());
    for (const [token, session] of sessions) {
      if (session.userId === userId) {
        this.sessions.delete(token);
      }
    }
  }

  // Metrics methods
  async getMetrics(limit = 100): Promise<Metric[]> {
    return this.metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getLatestMetrics(): Promise<{ cpu: Metric | undefined; memory: Metric | undefined }> {
    const cpuMetrics = this.metrics
      .filter(m => m.type === 'CPU')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const memoryMetrics = this.metrics
      .filter(m => m.type === 'MEMORY')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      cpu: cpuMetrics[0],
      memory: memoryMetrics[0],
    };
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = randomUUID();
    const metric: Metric = {
      id,
      ...insertMetric,
      timestamp: new Date(),
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 1000);
    }

    return metric;
  }

  // Alerts methods
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      id,
      ...insertAlert,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.alerts.set(id, alert);
    return alert;
  }

  async acknowledgeAlert(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  async clearAllAlerts(): Promise<void> {
    this.alerts.clear();
  }

  // Threshold methods
  async getThresholds(): Promise<ThresholdConfig[]> {
    return Array.from(this.thresholds.values());
  }

  async getThreshold(type: 'CPU' | 'MEMORY'): Promise<ThresholdConfig | undefined> {
    return this.thresholds.get(type);
  }

  async updateThreshold(
    type: 'CPU' | 'MEMORY',
    config: UpdateThresholdConfig
  ): Promise<ThresholdConfig> {
    const existing = this.thresholds.get(type);
    if (!existing) {
      throw new Error(`Threshold config for ${type} not found`);
    }

    const updated: ThresholdConfig = {
      ...existing,
      ...(config.warningThreshold !== undefined && { warningThreshold: config.warningThreshold }),
      ...(config.criticalThreshold !== undefined && { criticalThreshold: config.criticalThreshold }),
      updatedAt: new Date(),
    };

    this.thresholds.set(type, updated);
    return updated;
  }
}

export const storage = new MemStorage();
