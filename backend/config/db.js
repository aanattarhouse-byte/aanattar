import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';
import mongoose from 'mongoose';

const RETRY_DELAY_MS = 5001;
const FALLBACK_DNS_SERVERS = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);
let retryTimer;
let connectionPromise;
let dnsFallbackApplied = false;

const isLocalMongoUri = (uri) => uri.includes('127.0.0.1') || uri.includes('localhost');

const getMongoUriDetails = (uri) => {
  try {
    const parsed = new URL(uri);

    return {
      protocol: parsed.protocol,
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, '') || '(none)'
    };
  } catch (_error) {
    return {
      protocol: '(invalid)',
      host: '(invalid)',
      database: '(invalid)'
    };
  }
};

const logMongoDiagnostics = async (uri) => {
  const details = getMongoUriDetails(uri);

  console.log('[MongoDB] Connection target:', {
    protocol: details.protocol,
    host: details.host,
    database: details.database,
    node: process.version,
    mongoose: mongoose.version
  });

  if (details.protocol !== 'mongodb+srv:' || !details.host || details.host === '(invalid)') {
    return;
  }

  try {
    await dnsPromises.resolve(details.host);
    console.log(`[MongoDB] DNS A lookup succeeded for ${details.host}`);
  } catch (error) {
    console.error(`[MongoDB] DNS A lookup failed for ${details.host}: ${error.code || error.name} ${error.message}`);
  }

  try {
    const records = await dnsPromises.resolveSrv(`_mongodb._tcp.${details.host}`);
    console.log(`[MongoDB] DNS SRV lookup succeeded for ${details.host}: ${records.length} record(s)`);
  } catch (error) {
    console.error(`[MongoDB] DNS SRV lookup failed for _mongodb._tcp.${details.host}: ${error.code || error.name} ${error.message}`);

    if (!dnsFallbackApplied && error.code === 'ECONNREFUSED' && FALLBACK_DNS_SERVERS.length) {
      dns.setServers(FALLBACK_DNS_SERVERS);
      dnsFallbackApplied = true;
      console.warn(`[MongoDB] Local DNS resolver refused Atlas SRV lookup. Retrying with DNS servers: ${FALLBACK_DNS_SERVERS.join(', ')}`);

      const records = await dnsPromises.resolveSrv(`_mongodb._tcp.${details.host}`);
      console.log(`[MongoDB] DNS SRV lookup succeeded for ${details.host} after fallback: ${records.length} record(s)`);
    }
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  if (process.env.MONGODB_URI.includes('<') || process.env.MONGODB_URI.includes('>')) {
    throw new Error('MONGODB_URI still contains placeholder values. Replace <user>, <password>, and <cluster> in backend/.env with your real MongoDB Atlas connection string.');
  }

  mongoose.set('strictQuery', true);
  await logMongoDiagnostics(process.env.MONGODB_URI);

  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5001
    })
    .then(() => {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = undefined;
      }

      console.log('MongoDB connected');
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = undefined;

      if (process.env.NODE_ENV === 'production') {
        throw error;
      }

      const localHint = isLocalMongoUri(process.env.MONGODB_URI)
        ? 'Start MongoDB locally on port 27017, or replace MONGODB_URI in backend/.env with your MongoDB Atlas connection string.'
        : 'Check MONGODB_URI in backend/.env and make sure the database is reachable.';

      console.error(`MongoDB connection failed: ${error.message}`);
      console.error(`${localHint} Retrying in ${RETRY_DELAY_MS / 1000}s...`);

      retryTimer = setTimeout(connectDB, RETRY_DELAY_MS);
      throw error;
    });

  return connectionPromise;
};

export default connectDB;
