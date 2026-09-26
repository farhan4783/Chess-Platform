import express from 'express';
import v1Router from './router/v1';
import cors from 'cors';
import { initPassport } from './passport';
import authRoute from './router/auth';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { COOKIE_MAX_AGE } from './consts';
import { db } from './db';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: COOKIE_MAX_AGE },
  })
);

// Initialize passport
try {
  initPassport();
  app.use(passport.initialize());
  app.use(passport.authenticate('session'));
} catch (error) {
  console.warn('⚠️  Passport initialization skipped:', error);
}

// Test database connection
let dbConnected = false;
async function testDatabaseConnection() {
  try {
    await db.$connect();
    dbConnected = true;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    dbConnected = false;
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Server running in fallback mode; persistence features will be mocked/in-memory');
    console.log('💡 To enable full database persistence, ensure PostgreSQL is running at DATABASE_URL');
    return false;
  }
}

testDatabaseConnection();

const allowedHosts = process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : [];
allowedHosts.push('http://localhost:5173');

app.use(
  cors({
    origin: allowedHosts,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/auth', authRoute);
app.use('/v1', v1Router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err?.message || 'Unknown error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
