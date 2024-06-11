import { AppDataSource } from "./data-source"
import { Jacare } from './entity/Teste'



AppDataSource.initialize().then(async () => {

    // const atl = new atletas()

    const testeRepository = AppDataSource.getRepository(Jacare)
    const allTeste = await testeRepository.find()
    console.log("Raças Carregados: ", allTeste)

    const [nomeMaria, mariaCount] = await testeRepository.findAndCountBy({
        nome: 'Maria',
    })

    console.log("Tem nome igual a Maria: ", nomeMaria)
    console.log('tem ', mariaCount, ' "Marias" cadastrados na tabela')

    const [teste, testeCount] = await testeRepository.findAndCount()
    console.log('Todos na tabela teste: ', teste)
    console.log('Contador de teste: ', testeCount)

    // console.log("Inserindo dados Relacionais no banco de dados...")
    // const atleta = new Atleta()

    // atleta.nome = "Tereza Maria"
    // atleta.cpf = "074.704.681-33"
    // atleta.dataNascimento = '1982-02-27'
    // atleta.email = "tete@gmail.com"
    // atleta.telefone = "037-3033-5407"
    // atleta.whatsapp = "037-98888-4868"
    // atleta.senha = "123456"
    // atleta.ativo = true


    // await AppDataSource.manager.save(atleta)
    // console.log("Salvando o novo Atleta com o id: " + atleta.idAtleta)

    // console.log("Carregando todos os Atletas do database...")
    // const atletas = await AppDataSource.manager.find(Atleta)
    // console.log("Atletas Carregados: ", atletas)

    // const racas1 = await AppDataSource.manager.find(Raca)
    // console.log("Raças Carregadas: ", racas1)

    // const racaRepository = AppDataSource.getRepository(Raca)
    // const racaToUpdate = await racaRepository.findOneBy({
    //     idRaca: 2,
    // })
    // racaToUpdate.nome = "Pastor Alemão"
    // await racaRepository.save(racaToUpdate)

    // const racas = await AppDataSource.manager.find(Raca)
    // console.log("Raças Alteradas: ", racas)

}).catch(error => console.log(error))
