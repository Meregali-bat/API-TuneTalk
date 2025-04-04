const Client  = require('pg').Client
const dotenv = require('dotenv');

dotenv.config()

const conexao = require(process.platform == 'win32' ? process.env.PATH_BANCO_WIN : process.env.PATH_BANCO_UNIX);

const getConexaoBanco = () => {
    const config = process.env.AMBIENTE == 'PROD' ? conexao.tunetalk_prod : conexao.tunetalk_dev

    return new Promise((resolve, reject) => {
        let conexao = new Client(config)

        conexao.connect().then(() => {
            resolve(conexao)
            console.log('Conexão com o banco de dados estabelecida!')
        }).catch((err) => {
            reject(err)
            console.error('Erro ao conectar ao banco de dados:', err)
        })
    })
}
exports.getConexaoBanco = getConexaoBanco;