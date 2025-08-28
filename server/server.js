require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

const { sequelize } = require('./models/db');
const router = require('./router');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://fit-log-production.up.railway.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now during development
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// Add health check endpoint that doesn't require database
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: global.dbConnected ? 'connected' : 'disconnected'
  });
});

app.use(router);

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
