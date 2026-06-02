import jwt from 'jsonwebtoken';

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required before signing authentication tokens');
  }

  return jwt.sign(
    {
      id: user._id,
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export default signToken;
