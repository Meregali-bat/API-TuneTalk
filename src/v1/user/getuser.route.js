const router = require('express').Router();
const db = require('../../utils/db-utils');

router.get("/getuser/:id", async (req, res) =>{
        const user_id = req.params.id

        if(!user_id){
            return res.status(400).json({ error: 'Necessário informar o ID do usuário!' });
        }
        let connection;

        try{
            connection = await db.getConexaoBanco()
            const query = `select *
                            from tunetalk.users
                            where user_id = $1`
            const values = [user_id]
            const dbRes = await connection.query(query, values)
            if(dbRes.rows.length === 0){
                return res.status(404).json({ error: 'Usuário não encontrado!' });
            }
            const userData = dbRes.rows[0]
            delete userData.password;
            res.status(200).json({ message: 'Usuário encontrado com sucesso!', userData });
        }catch (err){
            console.error('Erro ao buscar usuário:', err);
            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }if (connection) {
            connection.end(); 
        }
})

module.exports = router