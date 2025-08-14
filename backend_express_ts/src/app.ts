import express, { Application } from 'express';
import googleRouter from './routes/googleAuth';
import userRouter from './routes/userRoute';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { BACKEND_CONFIG } from './utils/constant';
import { setupSwagger } from './swagger';

import path from 'path';

const app: Application = express();
// Setup Swagger
setupSwagger(app);

// Constants
const apiPrefix = BACKEND_CONFIG.GLOBAL.API_PREFIX;

// Enable trust proxy if your app is behind a reverse proxy (like Nginx)
// This allows req.ip to hold the real client IP forwarded by the proxy
app.set('trust proxy', true);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // Incase of JWT-Based Authentication this is not required.

// Public Routes
app.use(`${apiPrefix}/auth/google`, googleRouter);

//Private routes
app.use(`${apiPrefix}/user-info`, userRouter);

export default app;
