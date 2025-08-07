const db = require('./db-utils');

async function checkDuplicateEmail(req, res, next) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'O email é obrigatório!' });

    let connection;
    try {
        connection = await db.getConexaoBanco();
        const query = 'SELECT email FROM tunetalk.users WHERE email = $1';
        const values = [email];
        const result = await connection.query(query, values);

        if (result.rows.length > 0) {
            return res.status(409).json({ error: 'O email informado já está cadastrado.' });
        }
        next();
    } catch (err) {
        console.error('Erro ao verificar email duplicado:', err);
        res.status(500).json({ error: 'Erro ao verificar email duplicado' });
    } finally {
        if (connection) connection.end();
    }
}

module.exports = checkDuplicateEmail;