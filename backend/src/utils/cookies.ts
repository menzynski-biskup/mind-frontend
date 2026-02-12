/**
 * Cookie utilities for setting and parsing cookies
 */

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  maxAge?: number; // in seconds
  path?: string;
  domain?: string;
}

/**
 * Set a cookie header
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const {
    httpOnly = true,
    secure = true,
    sameSite = 'Lax',
    maxAge,
    path = '/',
    domain
  } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (path) {
    cookie += `; Path=${path}`;
  }

  if (domain) {
    cookie += `; Domain=${domain}`;
  }

  if (maxAge !== undefined) {
    cookie += `; Max-Age=${maxAge}`;
  }

  if (secure) {
    cookie += '; Secure';
  }

  if (httpOnly) {
    cookie += '; HttpOnly';
  }

  if (sameSite) {
    cookie += `; SameSite=${sameSite}`;
  }

  return cookie;
}

/**
 * Clear a cookie by setting max age to 0
 */
export function clearCookie(name: string, options: CookieOptions = {}): string {
  return setCookie(name, '', {
    ...options,
    maxAge: 0
  });
}

/**
 * Parse cookies from Cookie header
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=');

    if (name && value) {
      cookies[decodeURIComponent(name.trim())] = decodeURIComponent(value.trim());
    }
  });

  return cookies;
}

/**
 * Get a specific cookie value
 */
export function getCookie(cookieHeader: string | null, name: string): string | undefined {
  const cookies = parseCookies(cookieHeader);
  return cookies[name];
}
