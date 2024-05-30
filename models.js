import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.db'
})

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados realizada com sucesso')
    })
    .catch((erro) => {
        console.log('Falha ao conectar com o banco de dados', erro)
    })

export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
})

export async function criaProduto(produto) {
    try {
        await Produto.create(produto)
        console.log(`Produto ${produto.nome} criado com sucesso`)
    } catch (erro) {
        console.log('Falha ao criar o produto', erro)
    }
}

export async function leProdutos() {
    try {
        const resultado = await Produto.findAll()
        console.log(`Produtos consultados com sucesso!`, resultado)
    } catch (erro) {
        console.log('Falha ao buscar o produto', erro)
    }
}