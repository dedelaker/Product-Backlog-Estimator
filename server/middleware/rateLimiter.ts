import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response } from 'express';

// Rate limiter for general API requests - 20 requests per day
export const dailyRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 20, // Maximum 20 requests per day per IP
  message: {
    error: 'Too many requests from this IP address. Maximum 20 requests allowed per day.',
    resetTime: '24 hours',
    maxRequests: 20
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP address. Maximum 20 requests allowed per day.',
      resetTime: '24 hours',
      maxRequests: 20
    });
  }
});

// Slower rate limiter for POST/PUT/DELETE operations - 10 per day
export const writeOperationsLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Maximum 10 write operations per day per IP
  message: {
    error: 'Too many write operations from this IP address. Maximum 10 create/update/delete operations allowed per day.',
    resetTime: '24 hours',
    maxRequests: 10
  },
  skip: (req: Request) => {
    // Only apply to write operations
    return !['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Write operation rate limit exceeded',
      message: 'Too many write operations from this IP address. Maximum 10 create/update/delete operations allowed per day.',
      resetTime: '24 hours',
      maxRequests: 10
    });
  }
});

// Speed limiter to slow down requests after certain threshold
export const speedLimiter = slowDown({
  windowMs: 60 * 60 * 1000, // 1 hour
  delayAfter: 5, // Allow 5 requests per hour at full speed
  delayMs: (hits: number) => {
    // Exponential backoff: 500ms * 2^(hits-5)
    const delay = 500 * Math.pow(2, hits - 5);
    return Math.min(delay, 10000); // Maximum 10 second delay
  },
  maxDelayMs: 10000 // Maximum delay of 10 seconds
});

// Burst protection - prevent rapid fire requests
export const burstProtection = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Maximum 5 requests per minute
  message: {
    error: 'Too many requests in a short time. Please wait before making more requests.',
    resetTime: '1 minute',
    maxRequests: 5
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Burst rate limit exceeded',
      message: 'Too many requests in a short time. Please wait before making more requests.',
      resetTime: '1 minute',
      maxRequests: 5
    });
  }
});