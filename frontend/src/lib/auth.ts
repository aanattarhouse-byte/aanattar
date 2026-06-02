import { cookies } from 'next/headers';
import { backendFetch } from '@/lib/backendApi';
import type { UserType } from '@/context/AuthContext';

export type CurrentUser = {
  _id?: unknown;
  id?: string;
  phone?: string;
  role: 'user' | 'admin';
  blocked?: boolean;
  name?: string;
  email?: string;
  avatar?: string;
};

async function getCookieHeader() {
  const store = await cookies();
  return store
    .getAll()
    .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
    .join('; ');
}

export function toClientUser(user: {
  _id?: unknown;
  id?: unknown;
  firebaseUid?: string;
  email?: string;
  displayName?: string;
  name?: string;
  photoURL?: string;
  avatar?: string;
  role?: string;
}): UserType {
  return {
    id: String(user._id || user.id || ''),
    firebaseUid: user.firebaseUid || '',
    email: user.email || '',
    displayName: user.displayName || user.name || '',
    photoURL: user.photoURL || user.avatar || '',
    role: user.role === 'admin' ? 'admin' : 'user'
  };
}

export async function getInitialAuthUser() {
  try {
    const data = await backendFetch('/api/auth/me', {
      headers: { Cookie: await getCookieHeader() },
      cache: 'no-store'
    });

    return data.success && data.user ? toClientUser(data.user) : null;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromCookies() {
  const data = await backendFetch('/api/auth/me', {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store'
  });

  return data.user as CurrentUser | null;
}

export async function requireUserFromCookies() {
  const user = await getCurrentUserFromCookies();
  if (!user) throw new Error('Authentication required');
  return user;
}

export async function requireAdminFromCookies() {
  const data = await backendFetch('/api/admin/session', {
    headers: { Cookie: await getCookieHeader() },
    cache: 'no-store'
  });

  return data.user as CurrentUser;
}

export async function requireUser() {
  const user = await getCurrentUserFromCookies();
  if (!user) throw new Error('Authentication required');
  return user;
}

export async function requireAdmin() {
  return requireAdminFromCookies();
}

export function authError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Authentication required';
  const status = message.includes('Admin') ? 403 : 401;
  return Response.json({ success: false, message }, { status });
}
