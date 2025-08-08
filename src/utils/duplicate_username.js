const pino = require('pino');
const db = require('./db-utils');

const logger = pino();

async function checkDuplicateUsername(req, res, next) {
  const { username, userId } = req.body;
  if (!username) return res.status(400).json({ error: 'O username é obrigatório!' });

  let connection;
  try {
    connection = await db.getConexaoBanco();
    const query = 'SELECT username FROM tunetalk.users WHERE username = $1 and user_id <> $2';
    const values = [username, userId];
    const result = await connection.query(query, values);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'O username informado já está cadastrado.' });
    }
    next();
  } catch (err) {
    logger.error(err, 'Erro ao verificar username duplicado:');
    res.status(500).json({ error: 'Erro ao verificar username duplicado' });
  } finally {
    if (connection) connection.end();
  }
  return res;
}

module.exports = checkDuplicateUsername;
