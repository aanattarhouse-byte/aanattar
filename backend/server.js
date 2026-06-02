import 'dotenv/config';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

let server;

try {
  console.log('[Startup] Loading API routes and middleware');
  const { default: app } = await import('./app.js');

  console.log('[Startup] Connecting to MongoDB');
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`[Startup] API running on port ${PORT}`);
  });
} catch (error) {
  const isMongoError = error.name === 'MongooseServerSelectionError'
    || error.name === 'MongoServerSelectionError'
    || /MongoDB|querySrv|queryA|ECONNREFUSED|ENOTFOUND|ETIMEOUT/i.test(error.message || '');
  const isFirebaseError = /Firebase|FIREBASE_/i.test(error.message || '');
  const isJwtError = /JWT_SECRET|jsonwebtoken/i.test(error.message || '');
  const category = isMongoError
    ? 'MongoDB connection error'
    : isFirebaseError
      ? 'Firebase configuration error'
      : isJwtError
        ? 'JWT configuration error'
        : 'Route import or startup error';

  console.error(`[Startup] ${category}:`, error.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(error.stack);
  }
  process.exit(1);
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Trigger nodemon restart to free port and run server
