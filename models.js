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
        allowNull: false,
        unique: true
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
})

export async function criaProduto(produto) {
    try {
        const resultado = await Produto.create(produto)
        console.log(`Produto ${resultado.nome} criado com sucesso`)
        return resultado
    } catch (erro) {
        console.log('Falha ao criar o produto', erro)
        throw erro
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

export async function leProdutoPorId(id) {
    try {
        const resultado = await Produto.findByPk(id)
        console.log(`Produto consultado com sucesso!`, resultado)
        return resultado
    } catch (erro) {
        console.log('Falha ao buscar o produto', erro)
        throw erro
    }
}

export async function atualizaProdutoPorId(id, dadosProduto) {
    try {
        const resultado = await Produto.update(dadosProduto, { where: { id: id } })
        console.log(`Produto atualizado com sucesso!`, resultado)
        return resultado
    } catch (erro) {
        console.log('Falha ao atualizar o produto', erro)
        throw erro
    }
}

export async function deletaProdutoPorId(id) {
    try {
        const resultado = await Produto.destroy({ where: { id: id } })
        console.log(`Produto deletado com sucesso!`, resultado)
    } catch (erro) {
        console.log('Falha ao deletar o produto', erro)
        throw erro
    }
}