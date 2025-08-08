const router = require('express').Router();
const pino = require('pino');
const db = require('../../utils/db-utils');
const validateFollow = require('../../utils/validate_follow');

const logger = pino();

router.post('/unfollow', validateFollow, async (req, res) => {
  const { userId, followeeId } = req.body;
  const user = { userId, followeeId };

  if (!userId || !followeeId) {
    return res.status(400).json({ error: 'IDS dos usuários não encontrados' });
  }

  let connection;
  try {
    connection = await db.getConexaoBanco();
    const query = `delete from tunetalk.users_following
                    where user_id = $1 and following_user_id = $2 returning user_id`;
    const values = [user.userId, user.followeeId];
    const dbRes = await connection.query(query, values);
    res.status(201).json({ message: 'Parou de seguir o usuário com sucesso!', userId: dbRes.rows[0].user_id });
  } catch (err) {
    logger.error(err, 'Erro ao parar de seguir usuário:');
    res.status(500).json({ error: 'Erro ao parar de seguir usuário.' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
  return res;
});

module.exports = router;
