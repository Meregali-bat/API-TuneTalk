const router = require('express').Router()
const db = require('../../utils/db-utils');
const checkDuplicateUsername = require('../../utils/duplicate_username');
const checkDuplicateEmail = require('../../utils/duplicate_email');

router.put("/edit",checkDuplicateUsername, checkDuplicateEmail, async (req, res) =>{
        const user = { user_id, email, phone, name, password, phone } = req.body

        if(!user_id) {
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

        try{
            connection = await db.getConexaoBanco()
            const query = `update tunetalk.users set email = $1, name = $2, password = $3, phone = $4 where user_id = $5 returning user_id`
            const values = [user.email, user.name, user.password, user.phone, user.user_id ]
            const dbRes = await connection.query(query, values)
            res.status(201).json({ message: 'Usuário editado com sucesso!', user_id: dbRes.rows[0].id });
        }
        catch (err) {
            if(err.code === '23505' && err.constraint === 'users_email_key') {
                return res.status(400).json({ err: 'O email informado já está cadastrado.' });
            }
            console.error('Erro ao editar usuário:', err);
            res.status(500).json({ error: 'Erro ao editar usuário.' });
        }if (connection) {
            connection.end(); 
        }
})

module.exports = router