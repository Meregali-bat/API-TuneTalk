const router = require('express').Router();
const pino = require('pino');
const md5 = require('md5');
const db = require('../../utils/db-utils');
const checkDuplicateUsername = require('../../utils/duplicate_username');
const checkDuplicateEmail = require('../../utils/duplicate_email');

const logger = pino();

router.put('/edit', checkDuplicateUsername, checkDuplicateEmail, async (req, res) => {
  const {
    userId,
    email,
    phone,
    name,
    password,
    username,
    description,
  } = req.body;

  const user = {
    userId,
    email,
    phone,
    name,
    password,
    username,
    description,
  };

  if (!userId) {
    return res.status(400).json({ error: 'Necessário informar o ID do usuário!' });
  }
  if (!name) {
    return res.status(400).json({ error: 'O nome é inválido ou está vazio!' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'A senha é inválida ou está vazia!' });
  }
  if (!email && !phone) {
    return res.status(400).json({ error: 'Necessário fornecer pelo menos email ou telefone!' });
  }
  if (email && (!email.includes('@') || email.length < 5)) {
    return res.status(400).json({ error: 'O email é inválido!' });
  }
  if (phone) {
    if (phone.trim() === '' || phone.length < 10) {
      return res.status(400).json({ error: 'O telefone é inválido!' });
    }
  } else {
    user.phone = null;
  }

  let connection;

  try {
    connection = await db.getConexaoBanco();
    const query = 'update tunetalk.users set email = $1, name = $2, password = $3, phone = $4, username = $5, description = $6 where user_id = $7 returning user_id';
    const values = [user.email, user.name, md5(user.password), user.phone, user.username,
      user.description, user.userId];
    const dbRes = await connection.query(query, values);
    res.status(201).json({ message: 'Usuário editado com sucesso!', userId: dbRes.rows[0].user_id });
  } catch (err) {
    if (err.code === '23505' && err.constraint === 'users_email_key') {
      return res.status(400).json({ err: 'O email informado já está cadastrado.' });
    }
    logger.error(err, 'Erro ao editar usuário:');
    res.status(500).json({ error: 'Erro ao editar usuário.' });
  } if (connection) {
    connection.end();
  }
  return res;
});

module.exports = router;
