const router = require('express').Router();
const db = require('../../utils/db-utils');
const md5 = require('md5'); // Use bcrypt in production!

router.post("/authuser", async (req, res) => {
    const { email, phone, password } = req.body;

    if (!email && !phone) {
        return res.status(400).json({ error: 'Necessário informar o email ou telefone!' });
    }
    let connection;
    try {
        connection = await db.getConexaoBanco();
        const query = `
            SELECT user_id, email, phone, name, password 
            FROM tunetalk.users 
            WHERE email = $1 OR phone = $2
        `;
        const values = [email, phone];
        const result = await connection.query(query, values);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Não encontrou nenhum usuário' });
        }

        const userData = result.rows[0];
        if (userData.password !== md5(password)) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        delete userData.password;
        res.status(200).json({ message: 'Usuário autenticado com sucesso!', user: userData });
    } catch (err) {
        console.error('Erro ao autenticar usuário: ', err);
        res.status(500).json({ error: 'Erro ao autenticar usuário.' });
    }
});

module.exports = router;