const pino = require('pino');
const db = require('./db-utils');

const logger = pino();

async function checkDuplicateEmail(req, res, next) {
  const { email, userId } = req.body;
  if (!email) return res.status(400).json({ error: 'O email é obrigatório!' });

  let connection;
  try {
    connection = await db.getConexaoBanco();
    const query = 'SELECT email FROM tunetalk.users WHERE email = $1 and user_id <> $2';
    const values = [email, userId];
    const result = await connection.query(query, values);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'O email informado já está cadastrado.' });
    }
    next();
  } catch (err) {
    logger.error(err, 'Erro ao verificar email duplicado:');
    res.status(500).json({ error: 'Erro ao verificar email duplicado' });
  } finally {
    if (connection) connection.end();
  }
  return res;
}

module.exports = checkDuplicateEmail;
