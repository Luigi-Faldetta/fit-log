require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const { sequelize } = require('./models/db');
const router = require('./router');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors());
app.use(express.json());
app.use(router);

const startServer = async () => {
  let dbConnected = false;
  let retries = 0;
  const maxRetries = 5;

  while (!dbConnected && retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      dbConnected = true;
    } catch (error) {
      retries++;
      console.error(`Database connection attempt ${retries}/${maxRetries} failed:`, error.message);
      
      if (retries < maxRetries) {
        console.log(`Retrying in ${retries * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retries * 2000));
      } else {
        console.error('Max database connection retries reached. Starting server without database...');
      }
    }
  }

  if (dbConnected) {
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Database sync failed:', error.message);
    }
  }

  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Database status: ${dbConnected ? 'Connected' : 'Disconnected'}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    server.close();
    if (dbConnected) {
      await sequelize.close();
    }
    process.exit(0);
  });
};

startServer().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
