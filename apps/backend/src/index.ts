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

// Test database connection
async function testDatabaseConnection() {
  try {
    await db.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Server will start but database features will be unavailable');
    console.log('💡 Please check your DATABASE_URL in .env file');
    return false;
  }
}

// Initialize passport only if database is available
let dbConnected = false;
testDatabaseConnection().then((connected) => {
  dbConnected = connected;
  if (connected) {
    try {
      initPassport();
      app.use(passport.initialize());
      app.use(passport.authenticate('session'));
      console.log('✅ Passport initialized successfully');
    } catch (error) {
      console.error('❌ Passport initialization failed:', error);
    }
  }
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
