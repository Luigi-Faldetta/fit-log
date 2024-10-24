require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const { sequelize } = require('./models/db');
const router = require('./router');

app.use(cors());
app.use(express.json());
app.use(router);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  await sequelize.sync({ alter: true });
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
