const router = require('express').Router();
const db = require('../../utils/db-utils');
const { authenticateUser, validateEmailDuplicate } = require('../../utils/utils');

router.put("/edit", authenticateUser, validateEmailDuplicate, async (req, res) =>{
        const user = { user_id, email, phone, name, password, phone } = req.body

        if(!user_id) {
            return res.status(400).json({ error: 'Id não encontrado' });
        }
        if (!name) {
            return res.status(400).json({ error: 'O nome é inválido ou está vazio!' });
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
            const query = `update public.users set email = $1, name = $2, phone = $3, update_datetime = CURRENT_TIMESTAMP where user_id = $4 returning user_id`
            const values = [user.email, user.name, user.phone, user.user_id ]
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