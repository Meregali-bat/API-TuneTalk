const router = require('express').Router();
const db = require('../../utils/db-utils');

router.post("/authuser", async (req, res) =>{
    const user = {email, phone, password}= req.body
    let connection;
    
    if(!user.email && !user.phone) {
        return res.status(400).json({ error: 'Necessário informar o email ou telefone!' });
    }

    try{
        connection = await db.getConexaoBanco()
        const query = `select user_id, email, phone, name from tunetalk.users 
                       where (email = $1 or phone = $2) 
                       and password = $3`
        const values = [ user.email, user.phone, user.password ]
        const dbRes = await connection.query(query, values)
        if(dbRes.rows.length === 0) {
            return res.status(400).json({ error: 'Não encontrou nenhum usuário' });
        }    
        const userData = dbRes.rows[0]
        res.status(200).json({ message: 'Usuário autenticado com sucesso!', user: userData });
    }catch (err){
        console.error('Erro ao autenticar usuário: ', err)
        res.status(500).json({ error: 'Erro ao autenticar usuário.'});
    }
})

module.exports = router