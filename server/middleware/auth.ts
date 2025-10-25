import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend Express Request type to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const session = await storage.getSession(token);
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Attach user info to request
    req.userId = session.userId;
    req.username = session.username;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
