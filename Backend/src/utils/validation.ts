import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import logger from './logger';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password strength requirements
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 128;

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface ValidationOptions {
  required?: string[];
  email?: string[];
  password?: string[];
  minLength?: { [key: string]: number };
  maxLength?: { [key: string]: number };
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`);
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a stronger password');
  }

  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Rate limiting middleware
 */
export const rateLimit = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);
    
    if (!current) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      logger.warn({ ip: req.ip, path: req.path }, 'Rate limit exceeded');
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        details: {
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        }
      });
    }

    current.count++;
    next();
  };
};

/**
 * Request validation middleware
 */
export const validateRequest = (options: ValidationOptions) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const errors: string[] = [];

    // Check required fields
    if (options.required) {
      for (const field of options.required) {
        if (!req.body[field] || req.body[field].toString().trim() === '') {
          errors.push(`${field} is required`);
        }
      }
    }

    // Validate email fields
    if (options.email) {
      for (const field of options.email) {
        if (req.body[field] && !isValidEmail(req.body[field])) {
          errors.push(`${field} must be a valid email address`);
        }
      }
    }

    // Validate password fields
    if (options.password) {
      for (const field of options.password) {
        if (req.body[field]) {
          const passwordValidation = isValidPassword(req.body[field]);
          if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors.map(err => `${field}: ${err}`));
          }
        }
      }
    }

    // Validate minimum length
    if (options.minLength) {
      for (const [field, minLen] of Object.entries(options.minLength)) {
        if (req.body[field] && req.body[field].length < minLen) {
          errors.push(`${field} must be at least ${minLen} characters long`);
        }
      }
    }

    // Validate maximum length
    if (options.maxLength) {
      for (const [field, maxLen] of Object.entries(options.maxLength)) {
        if (req.body[field] && req.body[field].length > maxLen) {
          errors.push(`${field} must be no more than ${maxLen} characters long`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Sanitize inputs
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }

    next();
  };
};

/**
 * IP whitelist middleware (for admin operations)
 */
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || '';
    
    if (!allowedIPs.includes(clientIP)) {
      logger.warn({ ip: clientIP, path: req.path }, 'IP not in whitelist');
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    next();
  };
};

/**
 * Security headers middleware
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HTTPS only)
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'HTTP Request');
  });
  
  next();
};
