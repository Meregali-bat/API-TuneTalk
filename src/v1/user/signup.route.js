const router = require('express').Router()
const db = require('../../utils/db-utils');

router.post("/signup", async (req, res) =>{
        const user = { email, phone, name, password, phone } = req.body

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

        try{
            connection = await db.getConexaoBanco()
            const query = `insert into public.users (email, name, password, phone)
                            values ($1, $2, $3, $4) returning user_id`
            const values = [user.email, user.name, user.password, user.phone ]
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