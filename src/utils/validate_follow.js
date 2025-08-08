const pino = require('pino');
const db = require('./db-utils');

const logger = pino();

async function validateFollow(req, res, next) {
  const { userId, followeeId } = req.body;
  const user = { userId, followeeId };

  if (!userId || !followeeId) return res.status(400).json({ error: 'ID dos usuários não informado' });

  let connection;
  try {
    connection = await db.getConexaoBanco();
    const query = 'SELECT 1 FROM tunetalk.users_following WHERE user_id = $1 and following_user_id = $2';
    const values = [user.userId, user.followeeId];
    const result = await connection.query(query, values);

    if (result.rows.length > 0) {
      next();
    } else {
      return res.status(400).json({ error: 'Você não segue esse usuário' });
    }
  } catch (err) {
    logger.error(err, 'Erro ao verificar');
    res.status(500).json({ error: 'Erro ao verificar' });
  } finally {
    if (connection) connection.end();
  }
  return res;
}

module.exports = validateFollow;
