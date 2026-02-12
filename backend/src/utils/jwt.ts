/**
 * JWT utilities for signing and verifying tokens
 */

import { JWTPayload } from '../types/user';

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRY_DAYS = 7; // 7 days

/**
 * Base64URL encode
 */
function base64URLEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64URL decode
 */
function base64URLDecode(str: string): string {
  // Add padding if needed
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
  return atob(base64);
}

/**
 * Create HMAC SHA-256 signature
 */
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  
  return base64URLEncode(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Sign a JWT token
 */
export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (JWT_EXPIRY_DAYS * 24 * 60 * 60)
  };
  
  const header = {
    alg: JWT_ALGORITHM,
    typ: 'JWT'
  };
  
  const encodedHeader = base64URLEncode(JSON.stringify(header));
  const encodedPayload = base64URLEncode(JSON.stringify(fullPayload));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await createSignature(data, secret);
  
  return `${data}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return null;
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await createSignature(data, secret);
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode and parse payload
    const payloadJson = base64URLDecode(encodedPayload);
    const payload: JWTPayload = JSON.parse(payloadJson);
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}
