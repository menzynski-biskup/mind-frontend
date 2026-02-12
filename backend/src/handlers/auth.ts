/**
 * Authentication handlers
 */

import { Env } from '../types/env';
import { User, SafeUser } from '../types/user';
import { hashPassword, verifyPassword } from '../utils/password';
import { validateEmail, validatePassword, validateFullName, validateRole } from '../utils/validate';
import { signJWT, verifyJWT } from '../utils/jwt';
import { setCookie, clearCookie, getCookie } from '../utils/cookies';
import { checkRateLimit, createRateLimitResponse } from '../utils/rate-limit';

const AUTH_COOKIE_NAME = 'mind_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Convert User to SafeUser (remove sensitive fields)
 */
function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    created_at: user.created_at
  };
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Handle user registration
 * POST /api/auth/register
 */
export async function handleRegister(request: Request, env: Env): Promise<Response> {
  // Check rate limit
  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt!);
  }

  try {
    const body = await request.json() as {
      email?: string;
      password?: string;
      full_name?: string;
      role?: string;
    };

    // Validate input
    const emailValidation = validateEmail(body.email || '');
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ error: emailValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const passwordValidation = validatePassword(body.password || '');
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ error: passwordValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const nameValidation = validateFullName(body.full_name || '');
    if (!nameValidation.valid) {
      return new Response(
        JSON.stringify({ error: nameValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Default role to 'researcher' if not provided
    const role = body.role || 'researcher';
    const roleValidation = validateRole(role);
    if (!roleValidation.valid) {
      return new Response(
        JSON.stringify({ error: roleValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const email = body.email!.trim().toLowerCase();
    const password = body.password!;
    const fullName = body.full_name!.trim();

    // Check if user already exists (safe error message to prevent enumeration)
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Registration failed. Please try again.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate UUID for new user
    const userId = generateUUID();
    const createdAt = new Date().toISOString();

    // Insert user
    const result = await env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, full_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, email, passwordHash, fullName, role, createdAt).run();

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Registration failed. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the newly created user
    const newUser = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first() as User | null;

    if (!newUser) {
      return new Response(
        JSON.stringify({ error: 'Registration failed. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create JWT with sub, email, and role
    const token = await signJWT(
      { sub: newUser.id, email: newUser.email, role: newUser.role },
      env.JWT_SECRET
    );

    // Set cookie
    const cookie = setCookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: COOKIE_MAX_AGE
    });

    return new Response(
      JSON.stringify({ user: toSafeUser(newUser) }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Registration failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle user login
 * POST /api/auth/login
 */
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  // Check rate limit
  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit.resetAt!);
  }

  try {
    const body = await request.json() as {
      email?: string;
      password?: string;
    };

    // Basic validation
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password;

    // Get user by email
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first() as User | null;

    // Use constant-time comparison to prevent timing attacks
    if (!user) {
      // Still hash the provided password to prevent timing attacks
      await hashPassword(password);
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create JWT with sub, email, and role
    const token = await signJWT(
      { sub: user.id, email: user.email, role: user.role },
      env.JWT_SECRET
    );

    // Set cookie
    const cookie = setCookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: COOKIE_MAX_AGE
    });

    return new Response(
      JSON.stringify({ user: toSafeUser(user) }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle user logout
 * POST /api/auth/logout
 */
export async function handleLogout(_request: Request, _env: Env): Promise<Response> {
  const cookie = clearCookie(AUTH_COOKIE_NAME);

  return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie
      }
    }
  );
}

/**
 * Get current authenticated user
 * GET /api/me
 */
export async function handleMe(request: Request, env: Env): Promise<Response> {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('Cookie');
    const token = getCookie(cookieHeader, AUTH_COOKIE_NAME);

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT
    const payload = await verifyJWT(token, env.JWT_SECRET);

    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user from database
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(payload.sub).first() as User | null;

    if (!user) {
      // Clear cookie if user not found
      const cookie = clearCookie(AUTH_COOKIE_NAME);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Set-Cookie': cookie
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ user: toSafeUser(user) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
