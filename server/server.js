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
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
