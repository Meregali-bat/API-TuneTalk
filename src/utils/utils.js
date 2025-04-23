const db = require('./db-utils');

const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Usuário não autenticado!' });
    }
    next();
};

const validateEmailDuplicate = async (req, res, next) => {
    let connection;
    connection = await db.getConexaoBanco()
    const email = req.body.email

    const query = `select user_id from public.users where email = $1`
    const values = [email]
    const dbRes = await connection.query(query, values)

    if(dbRes.rows.length > 0) {
       return res.status(400).json({ error: 'O email informado já está cadastrado. É você?' });
    }
    else {
        next();
    }
}

module.exports = {
    authenticateUser,
    validateEmailDuplicate
};