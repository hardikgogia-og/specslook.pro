/**
 * Firebase Auth & Firestore Compatibility Layer
 * Implements standard Firebase onAuthStateChanged, signInWithEmailAndPassword,
 * and role verification hooks backed by the secure Specslook backend.
 * Ensures zero localStorage dependency and full cross-browser session persistence.
 */

import {
  onAuthStateChanged as authObserver,
  signInAdmin,
  signOutAdmin,
  verifyAdminSession,
  getCurrentAdminUser,
  getCurrentAdminToken
} from './auth.ts';
import type { AdminUser } from '../types.ts';

export const auth = {
  currentUser: getCurrentAdminUser(),
  get currentToken() {
    return getCurrentAdminToken();
  }
};

export const onAuthStateChanged = authObserver;

export async function signInWithEmailAndPassword(authInstance: any, emailOrUsername: string, password: string) {
  const result = await signInAdmin(emailOrUsername, password);
  if (!result.success) {
    throw new Error(result.error || 'Authentication failed');
  }
  return {
    user: result.user,
    token: result.token
  };
}

export async function signOut(authInstance?: any) {
  return await signOutAdmin();
}

export { verifyAdminSession };
export type { AdminUser };
