export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isMongoConnectionError = err.name === 'MongooseServerSelectionError' || err.name === 'MongoServerSelectionError';
  const isTimeoutError = /timeout|timed out|ETIMEOUT/i.test(err.message || '');

  res.status(statusCode).json({
    success: false,
    code: isMongoConnectionError ? 'DATABASE_CONNECTION_FAILED' : isTimeoutError ? 'REQUEST_TIMEOUT' : undefined,
    message: isMongoConnectionError
      ? 'Database connection failed. Please try again shortly.'
      : err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
