const router = require('express').Router();
const db = require('../../utils/db-utils');

router.post("/follow", async (req, res) =>{
    const user = {user_id, followee_id} = req.body

    if(!user_id || !followee_id){
        return res.status(400).json({ error: 'IDS dos usuários não encontrados'});
    }

    let connection;
            try{
                connection = await db.getConexaoBanco()
                const query = `insert into tunetalk.users_following (user_id, following_user_id)
                                values ($1, $2) returning user_id`
                const values = [user.user_id, user.followee_id]
                const dbRes = await connection.query(query, values)
                res.status(201).json({ message: 'Usuário seguido com sucesso!', user_id: dbRes.rows[0].id });
            }
            catch (err) {
                console.error('Erro ao seguir usuário:', err);
                res.status(500).json({ error: 'Erro ao seguir usuário.'});
            }if (connection) {
                connection.end(); 
            }
})

module.exports = router;