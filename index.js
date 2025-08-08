const express = require('express');
const cors = require('cors');
const logger = require('pino')();
const v1Routes = require('./src/v1/index');
const db = require('./src/utils/db-utils');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Tunetalk!');
});

app.use('/api/v1', v1Routes);

app.get('/teste', async (req, res) => {
  const connection = await db.getConexaoBanco();
  const result = await connection.query('SELECT * FROM tunetalk.users');
  res.json(result.rows);
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});
