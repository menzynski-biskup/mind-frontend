/**
 * Cloudflare Worker entry point
 */

import { Env } from './types/env';
import { handleRegister, handleLogin, handleLogout, handleMe } from './handlers/auth';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Enable CORS for API endpoints
    // Note: In production, replace '*' with your actual frontend origin
    // e.g., 'https://yourdomain.com' when using credentials
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:8787'];
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
      'Access-Control-Allow-Credentials': 'true',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Check if DB is configured for auth endpoints
    if (path.startsWith('/api/auth') || path === '/api/me') {
      if (!env.DB) {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication service not configured. Please set up D1 database binding.',
            message: 'See AUTH_SETUP.md for setup instructions.'
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }
    }

    // API Routes
    if (path === '/api/auth/register' && method === 'POST') {
      const response = await handleRegister(request, env);
      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const response = await handleLogin(request, env);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      const response = await handleLogout(request, env);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    if (path === '/api/me' && method === 'GET') {
      const response = await handleMe(request, env);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // If no API route matched, return 404
    if (path.startsWith('/api/')) {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // For non-API routes, you can serve static assets or return a default response
    // This allows the worker to coexist with your Angular app
    return new Response('OK', { status: 200 });
  }
};
