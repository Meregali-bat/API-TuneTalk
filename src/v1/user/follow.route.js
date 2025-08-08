const router = require('express').Router();
const pino = require('pino');
const db = require('../../utils/db-utils');

const logger = pino();

router.post('/follow', async (req, res) => {
  const { userId, followeeId } = req.body;
  const user = { userId, followeeId };
  if (!userId || !followeeId) {
    return res.status(400).json({ error: 'IDS dos usuários não encontrados' });
  }

  let connection;
  try {
    connection = await db.getConexaoBanco();
    const query = `insert into tunetalk.users_following (user_id, following_user_id)
                   values ($1, $2) returning user_id`;
    const values = [user.userId, user.followeeId];
    const dbRes = await connection.query(query, values);
    res.status(201).json({ message: 'Usuário seguido com sucesso!', userId: dbRes.rows[0].id });
  } catch (err) {
    logger.error(err, 'Erro ao seguir usuário:');
    res.status(500).json({ error: 'Erro ao seguir usuário.' });
  } if (connection) {
    connection.end();
  }
  return res;
});

module.exports = router;
