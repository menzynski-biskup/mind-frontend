import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
}

export interface ErrorResponse {
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  // Current user signal
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  // Loading state
  private loadingSignal = signal<boolean>(false);
  public loading = this.loadingSignal.asReadonly();

  // API base URL - update this based on your environment
  private readonly API_BASE_URL = '/api';

  constructor() {
    // Check auth state on service initialization
    this.checkAuthState();
  }

  /**
   * Check if user is authenticated
   */
  async checkAuthState(): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json() as AuthResponse;
        this.currentUserSignal.set(data.user);
      } else {
        this.currentUserSignal.set(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.currentUserSignal.set(null);
    }
  }

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    fullName: string,
    role: string = 'researcher'
  ): Promise<{ success: boolean; error?: string }> {
    this.loadingSignal.set(true);

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json() as AuthResponse;
        this.currentUserSignal.set(data.user);
        return { success: true };
      } else {
        const errorData = await response.json() as ErrorResponse;
        return { success: false, error: errorData.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Login user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    this.loadingSignal.set(true);

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json() as AuthResponse;
        this.currentUserSignal.set(data.user);
        return { success: true };
      } else {
        const errorData = await response.json() as ErrorResponse;
        return { success: false, error: errorData.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.loadingSignal.set(true);

    try {
      await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.currentUserSignal.set(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Check if user is authenticated (synchronous)
   */
  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  /**
   * Get current user (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }
}
