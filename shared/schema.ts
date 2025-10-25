import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Session schema for session management
export interface Session {
  id: string;
  userId: string;
  username: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export const insertSessionSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

export type InsertSession = z.infer<typeof insertSessionSchema>;

// Metric schema for system metrics (CPU, Memory)
export interface Metric {
  id: string;
  type: 'CPU' | 'MEMORY';
  value: number;
  timestamp: Date;
}

export const insertMetricSchema = z.object({
  type: z.enum(['CPU', 'MEMORY']),
  value: z.number().min(0).max(100),
});

export type InsertMetric = z.infer<typeof insertMetricSchema>;

// Alert schema for threshold-based alerts
export interface Alert {
  id: string;
  type: 'CPU' | 'MEMORY';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

export const insertAlertSchema = z.object({
  type: z.enum(['CPU', 'MEMORY']),
  severity: z.enum(['CRITICAL', 'WARNING', 'INFO']),
  message: z.string(),
  value: z.number(),
  threshold: z.number(),
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Threshold configuration schema
export interface ThresholdConfig {
  id: string;
  type: 'CPU' | 'MEMORY';
  warningThreshold: number;
  criticalThreshold: number;
  updatedAt: Date;
}

export const insertThresholdConfigSchema = z.object({
  type: z.enum(['CPU', 'MEMORY']),
  warningThreshold: z.number().min(0).max(100),
  criticalThreshold: z.number().min(0).max(100),
});

export const updateThresholdConfigSchema = z.object({
  warningThreshold: z.number().min(0).max(100).optional(),
  criticalThreshold: z.number().min(0).max(100).optional(),
});

export type InsertThresholdConfig = z.infer<typeof insertThresholdConfigSchema>;
export type UpdateThresholdConfig = z.infer<typeof updateThresholdConfigSchema>;

// Log entry schema for log analysis
export interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}

export interface LogAnalysisResult {
  totalLines: number;
  counts: {
    INFO: number;
    WARN: number;
    ERROR: number;
  };
  topErrors: Array<{
    message: string;
    count: number;
  }>;
}

// Summary report schema
export interface SummaryReport {
  totalAlerts: number;
  breakdown: {
    CPU: number;
    MEMORY: number;
  };
  recentAlerts: Array<{
    type: string;
    timestamp: Date;
    value: number;
  }>;
  averageMetrics: {
    CPU: number;
    MEMORY: number;
  };
  generatedAt: Date;
}

// Login/Register schemas
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required"), // No minimum during login - just check if present
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
