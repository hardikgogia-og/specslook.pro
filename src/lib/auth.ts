import type { AdminUser } from '../types.ts';

type AuthStateListener = (user: AdminUser | null, token: string | null) => void;

let currentUser: AdminUser | null = null;
let currentToken: string | null = null;
let isInitialAuthResolved = false;
const listeners = new Set<AuthStateListener>();

/**
 * Register an auth state change listener (mimics Firebase onAuthStateChanged)
 * Allows StoreContext and other components to react to auth state transitions
 * without any localStorage dependency.
 */
export function onAuthStateChanged(listener: AuthStateListener): () => void {
  listeners.add(listener);

  // If initial server verification has already completed, notify the newly subscribed listener immediately
  if (isInitialAuthResolved) {
    try {
      listener(currentUser, currentToken);
    } catch (err) {
      console.error('Error in onAuthStateChanged listener:', err);
    }
  }

  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(user: AdminUser | null, token: string | null) {
  currentUser = user;
  currentToken = token;
  isInitialAuthResolved = true;
  listeners.forEach(fn => {
    try {
      fn(user, token);
    } catch (err) {
      console.error('Error notifying auth listener:', err);
    }
  });
}

/**
 * Verifies the admin session securely with the backend API.
 * Uses HTTP-only credentials (cookies) and Bearer token fallback.
 * Guarantees that admin access is NOT dependent on localStorage.
 */
export async function verifyAdminSession(): Promise<{ user: AdminUser | null; token: string | null }> {
  try {
    const headers: Record<string, string> = {};
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const res = await fetch('/api/auth/admin/me', {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        const token = data.token || currentToken || 'sl_adm_session_verified';
        notifyListeners(data.user, token);
        return { user: data.user, token };
      }
    }
  } catch (err) {
    console.warn('Admin session verification request failed:', err);
  }

  notifyListeners(null, null);
  return { user: null, token: null };
}

/**
 * Admin Login via secure server verification.
 * The server issues a secure session token and sets an HttpOnly cookie.
 */
export async function signInAdmin(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string; attemptsRemaining?: number; locked?: boolean; remainingHours?: number; remainingMins?: number; clientIp?: string }> {
  try {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.token && data.user) {
      notifyListeners(data.user, data.token);
      return { success: true, user: data.user, token: data.token };
    }

    return {
      success: false,
      error: data.error || 'Invalid administrator credentials',
      attemptsRemaining: data.attemptsRemaining,
      locked: Boolean(data.locked),
      remainingHours: data.remainingHours,
      remainingMins: data.remainingMins,
      clientIp: data.clientIp
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to connect to authentication server'
    };
  }
}

/**
 * Admin Logout.
 * Invalidates the server-side session and clears the session cookie.
 */
export async function signOutAdmin(): Promise<boolean> {
  try {
    const headers: Record<string, string> = {};
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    await fetch('/api/auth/admin/logout', {
      method: 'POST',
      headers,
      credentials: 'include'
    }).catch(() => null);
  } finally {
    notifyListeners(null, null);
  }
  return true;
}

export function getCurrentAdminUser(): AdminUser | null {
  return currentUser;
}

export function getCurrentAdminToken(): string | null {
  return currentToken;
}
