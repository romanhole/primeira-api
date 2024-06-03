import express from 'express'
import { criaPedido, lePedidoPorId, lePedidos } from './../models.js'

export const rotasPedido = express.Router()

rotasPedido.post('/pedidos', async (req, res, next) => {
    const pedido = req.body

    res.statusCode = 400

    if(!pedido?.valorTotal || pedido.valorTotal <= 0) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'valorTotal' é obrigatório, porém não foi encontrado ou é menor ou igual a 0`
            }
        }

        res.send(resposta)

        return
    }

    if(!pedido?.produtos || !pedido.produtos.length) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'produtos' é obrigatório, porém não foi encontrado ou está vazio`
            }
        }

        res.send(resposta)

        return
    }

    try {
        const resposta = await criaPedido(pedido)

        res.status(201).send(resposta)

        return
    } catch(erro) {
        console.log('Falha ao criar o pedido', erro)

        const resposta = {
            erro: {
                mensagem: `Falha ao criar o pedido`,
            }
        }

        res.status(500).send(resposta)

        return
    }
})

rotasPedido.get('/pedidos/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const resposta = await lePedidoPorId(id)

        res.statusCode = 200

        if (!resposta) { 
            res.statusCode = 404
        }

        res.send(resposta)

        return
    } catch(erro) {
        if(erro) {
            console.log('Falha ao buscar o pedido', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar o pedido ${id}`,
                }
            }

            res.send(resposta)

            return
        }
    }
})

rotasPedido.get('/pedidos', async (req, res, next) => {
    try {
        const resposta = await lePedidos()

        res.statusCode = 200

        res.send(resposta)

        return
    } catch(erro) {
        if(erro) {
            console.log('Falha ao buscar os pedidos', erro)

            res.statusCode = 500

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar os pedidos`,
                }
            }

            res.send(resposta)

            return
        }
    }
})