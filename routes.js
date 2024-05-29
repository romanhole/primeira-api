import fs from 'fs'

export default function rotas(req, res, dado) {
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

    if(req.method === 'PUT' && req.url === '/arquivos') {
        const corpo = []

        req.on('data', (parte) => {
            corpo.push(parte)
        })

        req.on('end', () => {
            const arquivo = JSON.parse(corpo)

            res.statusCode = 400

            if(!arquivo?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            fs.writeFile(`./${arquivo.nome}.txt`, arquivo?.conteudo ?? '', 'utf-8', (erro) => {
                if(erro) {
                    console.log('Falha ao criar o arquivo', erro)

                    res.statusCode = 500

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao criar o arquivo ${arquivo.nome}`,
                        }
                    }

                    res.end(JSON.stringify(resposta))

                    return
                }

                res.statusCode = 201

                const resposta = {
                    mensagem: `Arquivo ${arquivo.nome} criado com sucesso`
                }

                res.end(JSON.stringify(resposta))

                return
            })
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

    if(req.method === 'PATCH' && req.url === '/arquivos') {
        const corpo = []

        req.on('data', (parte) => {
            corpo.push(parte)
        })

        req.on('end', () => {
            const arquivo = JSON.parse(corpo)

            res.statusCode = 400

            if(!arquivo?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            if(!arquivo?.conteudo) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'conteudo' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            fs.access(`${arquivo.nome}.txt`, fs.constants.W_OK, (erro) => {
                if(erro) {
                    console.log('Falha ao acessar o arquivo', erro)

                    res.statusCode = erro.code === 'ENOENT' ? 404 : 403

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao acessar arquivo ${arquivo.nome}`
                        }
                    }

                    res.end(JSON.stringify(resposta))

                    return
                }

                fs.appendFile(`./${arquivo.nome}.txt`, `\n${arquivo.conteudo}`, 'utf-8', (erro) => {
                    if(erro) {
                        console.log('Falha ao atualizar o arquivo', erro)
    
                        res.statusCode = 500
    
                        const resposta = {
                            erro: {
                                mensagem: `Falha ao atualizar o arquivo ${arquivo.nome}`,
                            }
                        }
    
                        res.end(JSON.stringify(resposta))
    
                        return
                    }
    
                    res.statusCode = 200
    
                    const resposta = {
                        mensagem: `Arquivo ${arquivo.nome} atualizado com sucesso`
                    }
    
                    res.end(JSON.stringify(resposta))
    
                    return
                })
            })
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

    if(req.method === 'DELETE' && req.url === '/arquivos') {
        const corpo = []

        req.on('data', (parte) => {
            corpo.push(parte)
        })

        req.on('end', () => {
            const arquivo = JSON.parse(corpo)

            res.statusCode = 400

            if(!arquivo?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' é obrigatório, porém não foi encontrado`
                    }
                }

                res.end(JSON.stringify(resposta))

                return
            }

            fs.access(`${arquivo.nome}.txt`, fs.constants.W_OK, (erro) => {
                if(erro) {
                    console.log('Falha ao remover o arquivo', erro)

                    res.statusCode = erro.code === 'ENOENT' ? 404 : 403

                    const resposta = {
                        erro: {
                            mensagem: `Falha ao remover arquivo ${arquivo.nome}`
                        }
                    }

                    res.end(JSON.stringify(resposta))

                    return
                }

                fs.rm(`./${arquivo.nome}.txt`, (erro) => {
                    if(erro) {
                        console.log('Falha ao remover o arquivo', erro)
    
                        res.statusCode = 500
    
                        const resposta = {
                            erro: {
                                mensagem: `Falha ao remover o arquivo ${arquivo.nome}`,
                            }
                        }
    
                        res.end(JSON.stringify(resposta))
    
                        return
                    }
    
                    res.statusCode = 200
    
                    const resposta = {
                        mensagem: `Arquivo ${arquivo.nome} removido com sucesso`
                    }
    
                    res.end(JSON.stringify(resposta))
    
                    return
                })
            })
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

    res.statusCode = 404

    const resposta = { 
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    }

    res.end(JSON.stringify(resposta))
}