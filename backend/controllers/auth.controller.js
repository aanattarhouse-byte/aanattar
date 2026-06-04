import admin from '../config/firebase.js';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import signToken from '../utils/signToken.js';
import { getAuthCookieOptions } from '../utils/cookieOptions.js';

const toAuthUser = (user) => ({
  id: user._id,
  firebaseUid: user.firebaseUid || '',
  email: user.email || '',
  displayName: user.displayName || user.name || '',
  photoURL: user.photoURL || user.avatar || '',
  role: user.role
});

const authCookieOptions = getAuthCookieOptions;

const issueAuthResponse = (res, user) => {
  const token = signToken(user);

  res.cookie('token', token, {
    ...authCookieOptions()
  });

  res.json({
    success: true,
    token,
    redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/',
    user: toAuthUser(user)
  });
};

export const getFirebaseConfig = (_req, res) => {
  res.json({
    success: true,
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }
  });
};

export const loginWithGoogle = asyncHandler(async (req, res) => {
  const firebaseToken = req.body.firebaseToken || req.body.idToken;
  if (!firebaseToken) {
    throw new ApiError(400, 'Firebase ID Token is required');
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(firebaseToken, true);
  } catch (error) {
    if (/Firebase Admin credentials|FIREBASE_PROJECT_ID|FIREBASE_CLIENT_EMAIL|FIREBASE_PRIVATE_KEY/i.test(error.message || '')) {
      throw new ApiError(500, `Firebase configuration error: ${error.message}`);
    }

    throw new ApiError(401, `Invalid or expired Firebase ID Token: ${error.message}`);
  }

  const { uid: firebaseUid, email, name: displayName, picture: photoURL } = decoded;

  if (!firebaseUid) {
    throw new ApiError(400, 'Firebase ID Token does not contain a user identifier');
  }

  if (!email) {
    throw new ApiError(400, 'Firebase ID Token does not contain an email address');
  }

  let user = await User.findOne({ $or: [{ firebaseUid }, { email }] });
  const now = new Date();
  const fallbackName = displayName || email.split('@')[0];

  if (!user) {
    user = await User.create({
      firebaseUid,
      email,
      displayName: fallbackName,
      name: fallbackName,
      photoURL: photoURL || '',
      avatar: photoURL || '',
      provider: 'google',
      role: 'user',
      blocked: false,
      lastLogin: now
    });
  } else {
    user.lastLogin = now;
    if (!user.firebaseUid) user.firebaseUid = firebaseUid;
    if (displayName && !user.displayName) user.displayName = displayName;
    if (displayName && !user.name) user.name = displayName;
    if (photoURL && !user.photoURL) {
      user.photoURL = photoURL;
      user.avatar = photoURL;
    }
    user.provider = 'google';
    await user.save();
  }

  issueAuthResponse(res, user);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const logout = (_req, res) => {
  const { maxAge, ...clearOptions } = authCookieOptions();
  res.clearCookie('token', clearOptions);
  res.json({ success: true });
};
