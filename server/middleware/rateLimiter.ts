import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Write operations rate limiter - 1000 per day (global)
export const writeOperationsLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // Maximum 1000 write operations per day globally
  message: {
    error: 'Too many write operations. Maximum 1000 create/update/delete operations allowed per day.',
    resetTime: '24 hours',
    maxRequests: 1000
  },
  keyGenerator: () => 'global', // Use global key instead of IP-based
  skip: (req: Request) => {
    // Only apply to write operations
    return !['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Write operation rate limit exceeded',
      message: 'Too many write operations. Maximum 1000 create/update/delete operations allowed per day.',
      resetTime: '24 hours',
      maxRequests: 1000
    });
  }
});