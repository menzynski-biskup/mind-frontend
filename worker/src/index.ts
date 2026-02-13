/**
 * Cloudflare Worker entry point
 */

import { Env } from './types/env';
import { handleRegister, handleLogin, handleLogout, handleMe } from './handlers/auth';
import {
  handleCreateFormTemplate,
  handleCreateFormField,
  handleCreateFormLogic,
  handleCreateComputeDefinition,
  handleCreateRuleSet,
  handleIntakeSubmit,
  handleIntakeResult,
} from './handlers/engine';

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

    const applyCorsHeaders = (response: Response): Response => {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    };

    // Check if DB is configured for auth + study endpoints
    if (path.startsWith('/api/auth') || path === '/api/me' || path.startsWith('/api/studies')) {
      if (!env.DB) {
        return new Response(
          JSON.stringify({ 
            error: 'Database service not configured. Please set up D1 database binding.',
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
      return applyCorsHeaders(response);
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const response = await handleLogin(request, env);
      return applyCorsHeaders(response);
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      const response = await handleLogout(request, env);
      return applyCorsHeaders(response);
    }

    if (path === '/api/me' && method === 'GET') {
      const response = await handleMe(request, env);
      return applyCorsHeaders(response);
    }

    const formTemplateMatch = path.match(/^\/api\/studies\/([^/]+)\/forms$/);
    if (formTemplateMatch && method === 'POST') {
      const studyId = decodeURIComponent(formTemplateMatch[1]);
      const response = await handleCreateFormTemplate(request, env, studyId);
      return applyCorsHeaders(response);
    }

    const formFieldMatch = path.match(/^\/api\/studies\/([^/]+)\/forms\/(\d+)\/fields$/);
    if (formFieldMatch && method === 'POST') {
      const studyId = decodeURIComponent(formFieldMatch[1]);
      const formId = Number(formFieldMatch[2]);
      const response = await handleCreateFormField(request, env, studyId, formId);
      return applyCorsHeaders(response);
    }

    const formLogicMatch = path.match(/^\/api\/studies\/([^/]+)\/forms\/(\d+)\/logic$/);
    if (formLogicMatch && method === 'POST') {
      const studyId = decodeURIComponent(formLogicMatch[1]);
      const formId = Number(formLogicMatch[2]);
      const response = await handleCreateFormLogic(request, env, studyId, formId);
      return applyCorsHeaders(response);
    }

    const computeDefinitionMatch = path.match(/^\/api\/studies\/([^/]+)\/compute-definitions$/);
    if (computeDefinitionMatch && method === 'POST') {
      const studyId = decodeURIComponent(computeDefinitionMatch[1]);
      const response = await handleCreateComputeDefinition(request, env, studyId);
      return applyCorsHeaders(response);
    }

    const ruleSetMatch = path.match(/^\/api\/studies\/([^/]+)\/rule-sets$/);
    if (ruleSetMatch && method === 'POST') {
      const studyId = decodeURIComponent(ruleSetMatch[1]);
      const response = await handleCreateRuleSet(request, env, studyId);
      return applyCorsHeaders(response);
    }

    const intakeSubmitMatch = path.match(
      /^\/api\/studies\/([^/]+)\/participants\/([^/]+)\/intake-submit$/
    );
    if (intakeSubmitMatch && method === 'POST') {
      const studyId = decodeURIComponent(intakeSubmitMatch[1]);
      const participantId = decodeURIComponent(intakeSubmitMatch[2]);
      const response = await handleIntakeSubmit(request, env, studyId, participantId);
      return applyCorsHeaders(response);
    }

    const intakeResultMatch = path.match(
      /^\/api\/studies\/([^/]+)\/participants\/([^/]+)\/intake-result$/
    );
    if (intakeResultMatch && method === 'GET') {
      const studyId = decodeURIComponent(intakeResultMatch[1]);
      const participantId = decodeURIComponent(intakeResultMatch[2]);
      const response = await handleIntakeResult(env, studyId, participantId);
      return applyCorsHeaders(response);
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
