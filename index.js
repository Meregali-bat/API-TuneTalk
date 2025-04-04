const express = require('express')
const app = express()
const port = 3000
const db = require('./src/utils/db-utils')

app.get('/',  (req, res) => {
  res.send('Tunetalk!')
})

app.get('/api', (req, res) => {
  res.send(sexo)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})