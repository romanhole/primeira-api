import express from 'express'
import { sequelize, criaProduto, leProdutos, leProdutoPorId, atualizaProdutoPorId, deletaProdutoPorId } from './../models.js'


export const rotasProdutos = express.Router()

rotasProdutos.post('/produtos', async (req, res, next) => {
    
    const produto = req.body

    res.statusCode = 400

    if(!produto?.nome) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'nome' é obrigatório, porém não foi encontrado`
            }
        }

        res.send(resposta)

        return
    }

    if(!produto?.preco) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'preco' é obrigatório, porém não foi encontrado`
            }
        }

        res.send(resposta)

        return
    }

    try {
        const resposta = await criaProduto(produto)

        res.statusCode = 201

        res.send(resposta)

        return
    } catch(erro) {
        console.log('Falha ao criar o produto', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao criar o produto ${produto.nome}`,
                }
            }

            res.send(resposta)

            return
    }
})

rotasProdutos.patch('/produtos/:id', async (req, res, next) => {
    const produto = req.body

    res.statusCode = 400

    if(!produto?.nome && !produto.preco) {
        const resposta = {
            erro: {
                mensagem: `Nenhum atributo foi encontrado, porém pelo menos um é obrigatório para a atualização`
            }
        }

        res.send(resposta)

        return
    }

    const id = req.params.id

    try {
        const resposta = await atualizaProdutoPorId(id, produto)

        res.statusCode = 200

        if (!resposta) {
            res.statusCode = 404
        }

        res.send(resposta)

        return
    } catch(erro) {
        console.log('Falha ao atualizar o produto', erro)

        res.statusCode = 500

        const resposta = {
            erro: {
                mensagem: `Falha ao atualizar o produto ${id}`,
            }
        }

        res.send(resposta)

        return
    }
})

rotasProdutos.delete('/produtos/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const encontrado = await deletaProdutoPorId(id)

        res.statusCode = 204

        if (!encontrado) {
            res.statusCode = 404
        }

        res.send()

        return
    } catch(erro) {
        if(erro) {
            console.log('Falha ao remover o produto', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao remover o produto ${id}`,
                }
            }

            res.send(resposta)

            return
        }
    }
})

rotasProdutos.get('/produtos/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const resposta = await leProdutoPorId(id)

        res.statusCode = 200

        if (!resposta) { 
            res.statusCode = 404
        }

        res.send(resposta)

        return
    } catch(erro) {
        if(erro) {
            console.log('Falha ao buscar o produto', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar o produto ${id}`,
                }
            }

            res.send(resposta)

            return
        }
    }
})

rotasProdutos.get('/produtos', async (req, res, next) => {
    try {
        const resposta = await leProdutos()

        res.statusCode = 200

        res.send(resposta)

        return
    } catch(erro) {
        if(erro) {
            console.log('Falha ao buscar os produtos', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar os produtos`,
                }
            }

            res.send(resposta)

            return
        }
    }
})