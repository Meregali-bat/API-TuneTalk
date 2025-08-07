const router = require('express').Router();
const db = require('../../utils/db-utils');
const md5 = require('md5')
const checkDuplicateEmail = require('../../utils/duplicate_email');
const checkDuplicateUsername = require('../../utils/duplicate_username');

router.post("/signup",checkDuplicateEmail,checkDuplicateUsername, async (req, res) =>{
        const user = { email, username, password } = req.body

        if (!username) {
            return res.status(400).json({ error: 'O username é inválido ou está vazio!' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'A senha é inválida ou está vazia!' });
        }
        if (email && (!email.includes('@') || email.length < 5)) {
            return res.status(400).json({ error: 'O email é inválido!' });
        }

        let connection;

        try{
            connection = await db.getConexaoBanco()
            const query = `insert into tunetalk.users (email, username, password, name)
                            values ($1, $2, $3, $2) returning user_id`
            const values = [user.email, user.username, md5(user.password) ]
            const dbRes = await connection.query(query, values)
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user_id: dbRes.rows[0].id });
        }
        catch (err) {
            if (err.code === '23505' && err.constraint === 'users_email_key') {
                return res.status(400).json({ error: 'O email informado já está cadastrado. É você?' });
            }
            console.error('Erro ao cadastrar usuário:', err);
            res.status(500).json({ error: 'Erro ao cadastrar usuário.'});
        }if (connection) {
            connection.end(); 
        }
})

module.exports = router