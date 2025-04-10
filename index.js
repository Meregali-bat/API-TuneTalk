const express = require('express')
const app = express()
const port = 3000
const v1Routes = require('./src/v1/index.js');
const db = require('./src/utils/db-utils');

app.use(express.json())

app.get('/',  (req, res) => {
  res.send('Tunetalk!')
})

app.use('/api/v1', v1Routes);

app.get('/teste', async (req, res) => {
  const connection = await db.getConexaoBanco();
  const result = await connection.query('SELECT * FROM public.users')
  res.json(result.rows)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})