const rateLimit = require('express-rate-limit');

// Create rate limiter with custom config
const createRateLimit = (maxRequests = 50, windowSeconds = 60) => {
  return rateLimit({
    windowMs: windowSeconds * 1000, // Convert seconds to milliseconds
    limit: maxRequests, // Limit each IP to maxRequests requests per windowMs
    message: {
      error: 'Too many requests',
      message: `You have exceeded the ${maxRequests} requests in ${windowSeconds} seconds limit!`,
      retryAfter: Math.ceil(windowSeconds)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests (optional)
    skip: (request, response) => response.statusCode < 400,
    // Custom key generator (optional - defaults to IP)
    keyGenerator: (request, response) => {
      return request.fingerprint || request.ip;
    }
  });
};

// Default rate limiter: 50 requests per 60 seconds
const defaultRateLimit = createRateLimit(50, 60);

// Stricter rate limiter for auth endpoints: 10 requests per 60 seconds
const authRateLimit = createRateLimit(10, 60);

// Very strict rate limiter for password reset: 3 requests per 300 seconds (5 minutes)
const passwordResetRateLimit = createRateLimit(3, 300);

// Decorator function like requireRole - allows custom rate limiting per route
const rateLimitMiddleware = (maxRequests = 50, windowSeconds = 60) => {
  return createRateLimit(maxRequests, windowSeconds);
};

module.exports = {
  createRateLimit,
  defaultRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  rateLimit: rateLimitMiddleware
};