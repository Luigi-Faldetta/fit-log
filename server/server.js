const express = require('express');
const app = express();
const cors = require('cors');

const router = require('./router');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3000, () => console.log('Listening at http://localhost:3000/'));
