const db = require('./src/utils/db-utils')

async function cadastraUsuarios(login, nome, senha) {
    const usuario = {
        login: login,
        nome: nome,
        senha: senha,
    }

    let connection;

    try{
        connection = await db.getConexaoBanco()
        const query = `insert into usuarios (login, nome, senha)
            values ($1, $2, $3) returning id`
        const values = [usuario.login, usuario.nome, usuario.senha]

        const res = await connection.query(query, values)
        console.log('Usuarios cadastrado com sucesso!')
    }
    catch (err) {
        console.error('Erro ao cadastrar usuario:', err)
        connection.release()
    }
}

exports.cadastraUsuarios = cadastraUsuarios