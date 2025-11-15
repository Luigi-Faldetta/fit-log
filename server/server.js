require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const port = process.env.PORT || 3000;

const { sequelize } = require('./models/db');
const router = require('./router');

// Validate required environment variables on startup
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Warn about optional but recommended env vars
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set - AI workout generation will not work');
}

// CORS Configuration - Environment-aware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Different allowed origins based on environment
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          'https://fit-log-production.up.railway.app',
          process.env.FRONTEND_URL
        ].filter(Boolean)
      : [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174'
        ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Reject unknown origins in production
      if (process.env.NODE_ENV === 'production') {
        console.warn(`⚠️  CORS: Rejected origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      } else {
        // Allow in development for easier testing
        console.log(`ℹ️  CORS: Allowing origin in development: ${origin}`);
        callback(null, true);
      }
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type']
};

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding if needed
}));

// Rate Limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Stricter in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/auth/', authLimiter);

// Request logging (only in development or if LOG_REQUESTS is true)
if (process.env.NODE_ENV !== 'production' || process.env.LOG_REQUESTS === 'true') {
  app.use(morgan('dev'));
} else {
  // Minimal logging in production
  app.use(morgan('combined'));
}

// Compression middleware for responses
app.use(compression());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS must come after helmet but before routes
app.use(cors(corsOptions));

// Add health check endpoint that doesn't require database
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: global.dbConnected ? 'connected' : 'disconnected'
  });
});

// Import error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Routes
app.use(router);

// 404 handler - must come after all routes
app.use(notFound);

// Global error handler - must be last middleware
app.use(errorHandler);

const startServer = async () => {
  global.dbConnected = false;
  
  // Start server immediately without waiting for database
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log('Server started successfully. Attempting database connection...');
  });

  // Try to connect to database in the background
  const connectDatabase = async () => {
    let retries = 0;
    const maxRetries = 5;
    
    while (!global.dbConnected && retries < maxRetries) {
      try {
        console.log(`Attempting database connection (${retries + 1}/${maxRetries})...`);
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        global.dbConnected = true;
        
        // Sync database after connection
        try {
          await sequelize.sync({ alter: true });
          console.log('Database synchronized successfully.');
        } catch (syncError) {
          console.error('Database sync failed:', syncError.message);
        }
        break;
      } catch (error) {
        retries++;
        console.error(`Database connection attempt ${retries}/${maxRetries} failed:`, error.message);
        
        if (retries < maxRetries) {
          console.log(`Will retry in ${retries * 5} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retries * 5000));
        } else {
          console.error('Max database connection retries reached. Server running without database.');
        }
      }
    }
  };

  // Connect to database in background
  connectDatabase().catch(error => {
    console.error('Database connection process failed:', error);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    server.close();
    if (global.dbConnected) {
      await sequelize.close();
    }
    process.exit(0);
  });
};

startServer().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
