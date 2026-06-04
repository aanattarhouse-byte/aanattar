import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getAuthCookieOptions } from '../utils/cookieOptions.js';

export const protect = asyncHandler(async (req, res, next) => {
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const token = headerToken || req.cookies?.token;

  if (!token) throw new ApiError(401, 'Authentication required');

  const { maxAge, ...clearOptions } = getAuthCookieOptions();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.clearCookie('token', clearOptions);
    throw new ApiError(401, 'Invalid or expired session');
  }

  const userId = decoded?.userId || decoded?.id;

  if (!userId) {
    res.clearCookie('token', clearOptions);
    throw new ApiError(401, 'Invalid session');
  }

  const user = await User.findById(userId).select('-__v');
  if (!user) throw new ApiError(401, 'User no longer exists');
  if (user.blocked) {
    res.clearCookie('token', clearOptions);
    throw new ApiError(403, 'Account is blocked');
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission for this action'));
  }
  next();
};
