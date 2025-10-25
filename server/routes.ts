import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken } from "./middleware/auth";
import { metricsCollector } from "./services/metrics-collector";
import { LogAnalyzer } from "./services/log-analyzer";
import bcrypt from "bcrypt";
import multer from "multer";
import { 
  loginSchema,
  insertUserSchema,
  updateThresholdConfigSchema,
  type SummaryReport
} from "@shared/schema";

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

const SALT_ROUNDS = 10;

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================
  // Authentication Routes
  // ============================================

  /**
   * POST /api/register
   * Register a new user with username and password
   */
  app.post("/api/register", async (req, res) => {
    try {
      // Validate input with Zod schema (backend only needs username + password)
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0]?.message || "Invalid input" 
        });
      }

      const { username, password } = validation.data;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Hash password using bcrypt
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Create session
      const session = await storage.createSession({
        userId: user.id,
        username: user.username,
      });

      res.json({
        token: session.token,
        username: user.username,
      });
    } catch (error: any) {
      console.error("[Register] Error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  /**
   * POST /api/login
   * Authenticate user and create session
   */
  app.post("/api/login", async (req, res) => {
    try {
      // Validate input with Zod schema
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0]?.message || "Invalid input" 
        });
      }

      const { username, password } = validation.data;

      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Delete existing sessions for this user
      await storage.deleteSessionsByUserId(user.id);

      // Create new session
      const session = await storage.createSession({
        userId: user.id,
        username: user.username,
      });

      res.json({
        token: session.token,
        username: user.username,
      });
    } catch (error: any) {
      console.error("[Login] Error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  /**
   * POST /api/validate-session
   * Validate current session token
   */
  app.post("/api/validate-session", authenticateToken, async (req, res) => {
    res.json({
      valid: true,
      username: req.username,
    });
  });

  /**
   * POST /api/logout
   * Logout user and invalidate session
   */
  app.post("/api/logout", authenticateToken, async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        await storage.deleteSession(token);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("[Logout] Error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  // ============================================
  // Metrics Routes
  // ============================================

  /**
   * GET /api/metrics/current
   * Get current CPU and memory metrics with trends
   */
  app.get("/api/metrics/current", authenticateToken, async (req, res) => {
    try {
      const metrics = await metricsCollector.getCurrentMetrics();
      res.json(metrics);
    } catch (error: any) {
      console.error("[Metrics Current] Error:", error);
      res.status(500).json({ error: "Failed to get current metrics" });
    }
  });

  /**
   * GET /api/metrics/history
   * Get historical metrics (last 100 readings)
   */
  app.get("/api/metrics/history", authenticateToken, async (req, res) => {
    try {
      const metrics = await storage.getMetrics(100);
      res.json(metrics);
    } catch (error: any) {
      console.error("[Metrics History] Error:", error);
      res.status(500).json({ error: "Failed to get metrics history" });
    }
  });

  // ============================================
  // Alerts Routes
  // ============================================

  /**
   * GET /api/alerts
   * Get all alerts (sorted by timestamp)
   */
  app.get("/api/alerts", authenticateToken, async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error: any) {
      console.error("[Alerts] Error:", error);
      res.status(500).json({ error: "Failed to get alerts" });
    }
  });

  /**
   * POST /api/alerts/:id/acknowledge
   * Acknowledge an alert
   */
  app.post("/api/alerts/:id/acknowledge", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.acknowledgeAlert(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("[Alert Acknowledge] Error:", error);
      res.status(500).json({ error: "Failed to acknowledge alert" });
    }
  });

  /**
   * DELETE /api/alerts/clear
   * Clear all alerts
   */
  app.delete("/api/alerts/clear", authenticateToken, async (req, res) => {
    try {
      await storage.clearAllAlerts();
      res.json({ success: true });
    } catch (error: any) {
      console.error("[Alerts Clear] Error:", error);
      res.status(500).json({ error: "Failed to clear alerts" });
    }
  });

  // ============================================
  // Threshold Configuration Routes
  // ============================================

  /**
   * GET /api/thresholds
   * Get all threshold configurations
   */
  app.get("/api/thresholds", authenticateToken, async (req, res) => {
    try {
      const thresholds = await storage.getThresholds();
      res.json(thresholds);
    } catch (error: any) {
      console.error("[Thresholds] Error:", error);
      res.status(500).json({ error: "Failed to get thresholds" });
    }
  });

  /**
   * PUT /api/thresholds/:type
   * Update threshold configuration for CPU or MEMORY
   */
  app.put("/api/thresholds/:type", authenticateToken, async (req, res) => {
    try {
      const { type } = req.params;
      
      if (type !== 'CPU' && type !== 'MEMORY') {
        return res.status(400).json({ error: "Invalid threshold type" });
      }

      // Validate input with Zod schema
      const validation = updateThresholdConfigSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0]?.message || "Invalid threshold configuration" 
        });
      }

      const updated = await storage.updateThreshold(type, validation.data);
      
      res.json(updated);
    } catch (error: any) {
      console.error("[Threshold Update] Error:", error);
      res.status(500).json({ error: "Failed to update threshold" });
    }
  });

  // ============================================
  // Log Analysis Routes
  // ============================================

  /**
   * POST /api/logs/analyze
   * Upload and analyze log file
   */
  app.post("/api/logs/analyze", 
    authenticateToken, 
    upload.single('logfile'), 
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No log file uploaded" });
        }

        // Convert buffer to string
        const logContent = req.file.buffer.toString('utf-8');

        // Analyze log content
        const analysis = LogAnalyzer.analyze(logContent);

        res.json(analysis);
      } catch (error: any) {
        console.error("[Log Analysis] Error:", error);
        res.status(500).json({ error: "Failed to analyze log file" });
      }
    }
  );

  // ============================================
  // Summary Report Route (Phase 4)
  // ============================================

  /**
   * GET /api/summary
   * Get comprehensive summary report
   * Returns: total alerts, breakdown by type, recent alerts, average metrics
   */
  app.get("/api/summary", authenticateToken, async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      const metrics = await storage.getMetrics(10);

      // Calculate breakdown by type
      const breakdown = {
        CPU: alerts.filter(a => a.type === 'CPU').length,
        MEMORY: alerts.filter(a => a.type === 'MEMORY').length,
      };

      // Get recent alerts (last 10)
      const recentAlerts = alerts.slice(0, 10).map(a => ({
        type: a.type,
        timestamp: a.timestamp,
        value: a.value,
      }));

      // Calculate average metrics for last 10 readings
      const cpuMetrics = metrics.filter(m => m.type === 'CPU');
      const memoryMetrics = metrics.filter(m => m.type === 'MEMORY');

      const avgCpu = cpuMetrics.length > 0
        ? cpuMetrics.reduce((sum, m) => sum + m.value, 0) / cpuMetrics.length
        : 0;

      const avgMemory = memoryMetrics.length > 0
        ? memoryMetrics.reduce((sum, m) => sum + m.value, 0) / memoryMetrics.length
        : 0;

      const report: SummaryReport = {
        totalAlerts: alerts.length,
        breakdown,
        recentAlerts,
        averageMetrics: {
          CPU: Math.round(avgCpu * 10) / 10,
          MEMORY: Math.round(avgMemory * 10) / 10,
        },
        generatedAt: new Date(),
      };

      res.json(report);
    } catch (error: any) {
      console.error("[Summary] Error:", error);
      res.status(500).json({ error: "Failed to generate summary report" });
    }
  });

  // ============================================
  // Start Metrics Collection Service
  // ============================================
  
  // Start the background metrics collector
  metricsCollector.start();
  console.log("[Server] Metrics collection service started");

  const httpServer = createServer(app);
  return httpServer;
}
