import fs from 'fs'
import { sequelize, criaProduto, leProdutos, leProdutoPorId, atualizaProdutoPorId, deletaProdutoPorId } from './models.js'

export default async function rotas(req, res, dado) {
    res.setHeader('Content-type', 'application/json; utf-8')

    if(req.method === 'GET' && req.url === '/') {
        const { mensagem } = dado

        res.statusCode = 200

        const resposta = {
            mensagem: mensagem
        }

        res.end(JSON.stringify(resposta))

        return
    }

    if(req.method === 'POST' && req.url === '/produtos') {
        const corpo = []

        req.on('data', (parte) => {
            corpo.push(parte)
        })

        req.on('end', async () => {
            const produto = JSON.parse(corpo)

            res.statusCode = 400

            if(!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            if(!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'preco' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            try {
                const resposta = await criaProduto(produto)

                res.statusCode = 201

                res.end(JSON.stringify(resposta))

                return
            } catch(erro) {
                console.log('Falha ao criar o produto', erro)

                    res.statusCode = 500

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao criar o produto ${produto.nome}`,
                        }
                    }

                    res.end(JSON.stringify(resposta))

                    return
            }
        })

        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição', erro)

            res.statusCode = 400

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            }

            res.end(JSON.stringify(resposta))

            return
        })

        return
    }

    if(req.method === 'PATCH' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const corpo = []

        req.on('data', (parte) => {
            corpo.push(parte)
        })

        req.on('end', async () => {
            const produto = JSON.parse(corpo)

            res.statusCode = 400

            if(!produto?.nome && !produto.preco) {
                const resposta = {
                    erro: {
                        mensagem: `Nenhum atributo foi encontrado, porém pelo menos um é obrigatório para a atualização`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            const id = req.url.split('/')[2]

            try {
                const resposta = await atualizaProdutoPorId(id, produto)

                res.statusCode = 200

                if (!resposta) {
                    res.statusCode = 404
                }

                res.end(JSON.stringify(resposta))

                return
            } catch(erro) {
                console.log('Falha ao atualizar o produto', erro)
    
                res.statusCode = 500

                const resposta = {
                    erro: {
                        mensagem: `Falha ao atualizar o produto ${produto.nome}`,
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }
        })

        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição', erro)

            res.statusCode = 400

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            }

            res.end(JSON.stringify(resposta))

            return
        })


        return
    }

    if(req.method === 'DELETE' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2]

        try {
            const encontrado = await deletaProdutoPorId(id)

            res.statusCode = 204

            if (!encontrado) {
                res.statusCode = 404
            }

            res.end()

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
    
                res.end(JSON.stringify(resposta))
    
                return
            }
        }
    }

    if(req.method === 'GET' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2]

        try {
            const resposta = await leProdutoPorId(id)

            res.statusCode = 200

            if (!resposta) { 
                res.statusCode = 404
            }

            res.end(JSON.stringify(resposta))

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
    
                res.end(JSON.stringify(resposta))
    
                return
            }
        }
    }

    if(req.method === 'GET' && req.url === '/produtos') {
        try {
            const resposta = await leProdutos()

            res.statusCode = 200

            res.end(JSON.stringify(resposta))

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
    
                res.end(JSON.stringify(resposta))
    
                return
            }
        }
    }

    res.statusCode = 404

    const resposta = { 
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    }

    res.end(JSON.stringify(resposta))
}