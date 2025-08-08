const router = require('express').Router();
const pino = require('pino');
const db = require('../../utils/db-utils');

const logger = pino();

router.get('/getuser/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'Necessário informar o ID do usuário!' });
  }
  let connection;

  try {
    connection = await db.getConexaoBanco();
    const query = `select *
                     from tunetalk.users
                    where user_id = $1`;
    const values = [userId];
    const dbRes = await connection.query(query, values);
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const userData = dbRes.rows[0];
    delete userData.password;
    res.status(200).json({ message: 'Usuário encontrado com sucesso!', userData });
  } catch (err) {
    logger.error(err, 'Erro ao buscar usuário:');
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  } if (connection) {
    connection.end();
  }
  return res;
});

module.exports = router;
