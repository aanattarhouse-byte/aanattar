export const getAuthCookieOptions = () => {
  const sameSite = process.env.AUTH_COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.AUTH_COOKIE_SECURE
    ? process.env.AUTH_COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
};
