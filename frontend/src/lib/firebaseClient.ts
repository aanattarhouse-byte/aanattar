'use client';

import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let auth: Auth | null = null;

export async function getFirebaseAuth() {
  if (auth) return auth;

  if (typeof window === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'xxxxx') {
    return null;
  }

  try {
    const [{ initializeApp, getApps }, { getAuth }] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
    ]);
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    return auth;
  } catch (error) {
    console.error('Failed to initialize Firebase client SDK:', error);
    return null;
  }
}
