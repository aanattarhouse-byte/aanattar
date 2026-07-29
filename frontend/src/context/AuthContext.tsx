'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebaseClient';
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

type BrowserPlatform = 'android' | 'ios' | 'other';

type BrowserInfo = {
  isInstagram: boolean;
  isFacebook: boolean;
  isMetaInAppBrowser: boolean;
  platform: BrowserPlatform;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  browserInfo: BrowserInfo;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  openInSystemBrowser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const META_BROWSER_MESSAGE = 'For the best sign-in experience, please open this page in Chrome or Safari.';

function getBrowserInfo(): BrowserInfo {
  if (typeof navigator === 'undefined') {
    return {
      isInstagram: false,
      isFacebook: false,
      isMetaInAppBrowser: false,
      platform: 'other',
    };
  }

  const ua = navigator.userAgent || '';
  const isInstagram = /\bInstagram\b/i.test(ua);
  const isFacebook = /\bFBAN\b|\bFBAV\b|\bFB_IAB\b|\bFBIOS\b|\bFB4A\b/i.test(ua);
  const platform = /Android/i.test(ua)
    ? 'android'
    : /iPhone|iPad|iPod/i.test(ua)
      ? 'ios'
      : 'other';

  return {
    isInstagram,
    isFacebook,
    isMetaInAppBrowser: isInstagram || isFacebook,
    platform,
  };
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'Failed to authenticate with Google';
}

function isPopupCompatibilityError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error
    ? String((error as { code?: unknown }).code)
    : '';
  const message = getAuthErrorMessage(error);

  return /popup-blocked|popup-closed-by-user|cancelled-popup-request|operation-not-supported/i.test(code)
    || /popup|blocked|closed|cancel/i.test(message);
}

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
  const browserInfo = useMemo(() => getBrowserInfo(), []);

  React.useEffect(() => {
    if (user?.role === 'admin' && pathname === '/') {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router, user?.role]);

  const exchangeFirebaseCredential = React.useCallback(async (firebaseUser: { getIdToken: () => Promise<string> }) => {
    const idToken = await firebaseUser.getIdToken();
    const result = await backendFetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseToken: idToken })
    });

    if (!result.success || !result.user) {
      console.error('Google OAuth backend exchange failed:', {
        message: result.message,
        success: result.success,
      });
      throw new Error(result.message || 'Authentication failed');
    }

    setUser(result.user);
    window.dispatchEvent(new Event('storage'));

    if (result.user.role === 'admin') {
      router.replace(result.redirectTo || '/admin/dashboard');
    }

    router.refresh();
  }, [router]);

  const startGoogleRedirect = React.useCallback(async () => {
    const firebaseAuthInstance = await getFirebaseAuth();
    if (!firebaseAuthInstance) {
      throw new Error('Firebase Authentication is not initialized. Please verify Firebase environment variables on the backend.');
    }

    const { GoogleAuthProvider, signInWithRedirect } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();

    // Ask Google for account selection every time. In normal browsers this is a
    // convenience; in embedded browsers it avoids silently choosing stale
    // WebView account state when Google can read one.
    provider.setCustomParameters({ prompt: 'select_account' });

    // Redirect is the Firebase-supported OAuth flow for constrained browsers,
    // popup blockers, and Meta WebViews where new windows are unreliable.
    await signInWithRedirect(firebaseAuthInstance, provider);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function restoreRedirectSession() {
      try {
        const firebaseAuthInstance = await getFirebaseAuth();
        if (!firebaseAuthInstance || cancelled) return;

        const { getRedirectResult } = await import('firebase/auth');
        const redirectResult = await getRedirectResult(firebaseAuthInstance);

        if (!redirectResult?.user || cancelled) return;

        setLoading(true);
        setError(null);

        // A Firebase redirect only restores the Firebase identity. We still
        // call the existing backend endpoint so the production JWT cookie and
        // server-rendered session are restored after a full-page OAuth return.
        await exchangeFirebaseCredential(redirectResult.user);
      } catch (err) {
        console.error('Google redirect sign-in recovery failed:', err);
        if (!cancelled) setError(getAuthErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreRedirectSession();

    return () => {
      cancelled = true;
    };
  }, [exchangeFirebaseCredential]);

  const runGoogleLogin = async (forceRedirect: boolean) => {
    setError(null);
    setLoading(true);

    try {
      const firebaseAuthInstance = await getFirebaseAuth();
      if (!firebaseAuthInstance) {
        throw new Error('Firebase Authentication is not initialized. Please verify Firebase environment variables on the backend.');
      }

      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      if (browserInfo.isMetaInAppBrowser && !forceRedirect) {
        // Instagram/Facebook WebViews cannot reuse the user's Chrome/Safari
        // Google session, so password prompts are expected even when Firebase
        // and Google OAuth configuration are correct.
        console.warn('Google sign-in opened inside Meta in-app browser:', browserInfo);
        throw new Error(META_BROWSER_MESSAGE);
      }

      if (browserInfo.isMetaInAppBrowser || forceRedirect) {
        await startGoogleRedirect();
        return;
      }

      try {
        // Popup remains the fastest and least disruptive flow for Chrome,
        // Safari, Firefox, and Edge where third-party OAuth popups are reliable.
        const userCredential = await signInWithPopup(firebaseAuthInstance, provider);
        await exchangeFirebaseCredential(userCredential.user);
      } catch (popupError) {
        console.error('Google popup sign-in failed:', popupError);

        if (isPopupCompatibilityError(popupError)) {
          // Popup blockers and embedded browser limits should not dead-end the
          // user. Firebase redirect keeps the same provider/session handling.
          await startGoogleRedirect();
          return;
        }

        throw popupError;
      }
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      const message = getAuthErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => runGoogleLogin(false);
  const loginWithGoogleRedirect = () => runGoogleLogin(true);

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

  const openInSystemBrowser = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    const currentUrl = window.location.href;

    if (browserInfo.platform === 'android') {
      const withoutScheme = currentUrl.replace(/^https?:\/\//i, '');
      window.location.href = `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    if (browserInfo.platform === 'ios') {
      const withoutScheme = currentUrl.replace(/^https?:\/\//i, '');
      window.location.href = `googlechrome://${withoutScheme}`;
      return;
    }

    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  }, [browserInfo.platform]);

  return (
    <AuthContext.Provider value={{ user, loading, error, browserInfo, loginWithGoogle, loginWithGoogleRedirect, logout, openInSystemBrowser }}>
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
