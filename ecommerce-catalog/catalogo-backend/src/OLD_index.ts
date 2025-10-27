import { AppDataSource } from './data-source'


console.log('Inicializando a conexão com o banco')

AppDataSource.initialize()
  .then(async (dados) => {
    console.log('Data Source Inicializado!', dados)
  })
  .catch((err) => {
    console.log('Erro ao inicializar o Data Source!', err.message)
  })

