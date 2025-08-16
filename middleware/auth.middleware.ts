// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import {AuthRequest} from "../types/auth.types";
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const userId = decoded?.id ?? decoded?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // attach userId to request for controllers
    (req as any).userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRefreshHeaders = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers["x-refresh-token"] as string;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Authorization header (Bearer token) is required" });
  }

  if (!refreshToken) {
    return res.status(400).json({ error: "X-Refresh-Token header is required" });
  }

  req.accessTokenRaw = authHeader.split(" ")[1];
  req.refreshTokenRaw = refreshToken;
  next();
};