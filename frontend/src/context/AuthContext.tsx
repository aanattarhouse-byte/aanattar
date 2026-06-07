'use client';

import React, { createContext, useContext, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebaseClient';
import { backendFetch } from '@/lib/backendApi';
import type { UserRole } from '@/types/store';

export type UserType = {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null
}: {
  children: React.ReactNode;
  initialUser?: UserType | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firebaseAuthInstance] = useState<Auth | null>(firebaseAuth);

  React.useEffect(() => {
    if (user?.role === 'admin' && pathname === '/') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router, user?.role]);

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!firebaseAuthInstance) {
        throw new Error('Firebase Authentication is not initialized. Please verify Firebase environment variables on the backend.');
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(firebaseAuthInstance, provider);
      const idToken = await userCredential.user.getIdToken();
      const result = await backendFetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken: idToken })
      });

      if (!result.success || !result.user) {
        throw new Error(result.message || 'Authentication failed');
      }

      setUser(result.user);
      window.dispatchEvent(new Event('storage'));

      if (result.user.role === 'admin') {
        router.replace(result.redirectTo || '/admin/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      console.error('Google popup sign in error:', err);
      const message = err instanceof Error ? err.message : 'Failed to authenticate with Google';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await backendFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Failed to log out:', err);
    } finally {
      setUser(null);
      try {
        window.localStorage.removeItem('user');
        window.sessionStorage.clear();
      } catch (storageErr) {
        console.error('Failed to clear storage:', storageErr);
      }
      window.dispatchEvent(new Event('storage'));
      setLoading(false);
      router.replace('/');
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
