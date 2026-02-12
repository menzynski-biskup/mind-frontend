/**
 * Rate limiting middleware for authentication endpoints
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting (per-worker instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_ATTEMPTS = 5; // Max attempts per window

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: Request): string {
  // Try to get client IP from CF headers
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to X-Forwarded-For
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // Last resort: use a generic identifier
  return 'unknown';
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(request: Request): {
  allowed: boolean;
  remainingAttempts?: number;
  resetAt?: number;
} {
  // Cleanup expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to cleanup on each check
    cleanupExpiredEntries();
  }

  const clientId = getClientIdentifier(request);
  const now = Date.now();

  let entry = rateLimitStore.get(clientId);

  // If no entry or entry expired, create new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW
    };
    rateLimitStore.set(clientId, entry);

    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetAt: entry.resetAt
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetAt: entry.resetAt
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.count,
    resetAt: entry.resetAt
  };
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(resetAt: number): Response {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.'
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString()
      }
    }
  );
}
