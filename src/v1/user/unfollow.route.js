const router = require('express').Router();
const db = require('../../utils/db-utils');

router.post("/unfollow", async (req, res) =>{
    const user = {user_id, followee_id} = req.body

    if(!user_id || !followee_id){
        return res.status(400).json({ error: 'IDS dos usuários não encontrados'});
    }

    let connection;
            try{
                connection = await db.getConexaoBanco()
                const query = `delete from tunetalk.users_following
                                where user_id = $1 and following_user_id = $2 returning user_id`
                const values = [user.user_id, user.followee_id]
                const dbRes = await connection.query(query, values)
                res.status(201).json({ message: 'Parou de seguir o usuário com sucesso!', user_id: dbRes.rows[0].id });
            }
            catch (err) {
                console.error('Erro ao parar de seguir usuário:', err);
                res.status(500).json({ error: 'Erro ao parar de seguir usuário.'});
            }if (connection) {
                connection.end(); 
            }
})

module.exports = router;