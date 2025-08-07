const db = require('./db-utils');

async function checkDuplicateUsername(req, res, next) {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'O username é obrigatório!' });

    let connection;
    try {
        connection = await db.getConexaoBanco();
        const query = 'SELECT username FROM tunetalk.users WHERE username = $1';
        const values = [username];
        const result = await connection.query(query, values);

        if (result.rows.length > 0) {
            return res.status(409).json({ error: 'O username informado já está cadastrado.' });
        }
        next();
    } catch (err) {
        console.error('Erro ao verificar username duplicado:', err);
        res.status(500).json({ error: 'Erro ao verificar username duplicado' });
    } finally {
        if (connection) connection.end();
    }
}

module.exports = checkDuplicateUsername;