import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth guard to protect routes that require authentication
 * Redirects to /login if user is not authenticated
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // Try to refresh auth state
  await authService.checkAuthState();

  // Check again after refresh
  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to login
  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * Role-based guard to restrict access by user role
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if authenticated
    if (!authService.isAuthenticated()) {
      await authService.checkAuthState();
    }

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if user's role is allowed
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // User doesn't have required role, redirect to home or access denied
    router.navigate(['/']);
    return false;
  };
};
