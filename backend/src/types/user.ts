// User types
export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: 'clinician' | 'researcher' | 'admin';
  created_at: string;
}

export interface SafeUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface JWTPayload {
  sub: string; // userId
  email: string;
  role: string;
  iat: number;
  exp: number;
}
