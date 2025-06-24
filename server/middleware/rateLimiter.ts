import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Write operations rate limiter - 30 per day
export const writeOperationsLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 30, // Maximum 30 write operations per day per IP
  message: {
    error: 'Too many write operations from this IP address. Maximum 30 create/update/delete operations allowed per day.',
    resetTime: '24 hours',
    maxRequests: 30
  },
  skip: (req: Request) => {
    // Only apply to write operations
    return !['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Write operation rate limit exceeded',
      message: 'Too many write operations from this IP address. Maximum 30 create/update/delete operations allowed per day.',
      resetTime: '24 hours',
      maxRequests: 30
    });
  }
});