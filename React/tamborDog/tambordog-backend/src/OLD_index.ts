import { AppDataSource } from './data-source'


console.log('Inicializando a conexão com o banco')

AppDataSource.initialize()
  .then(async (dados) => {
    console.log('Data Source Inicializado!')

    // const tutu = await dados
    //   .getRepository(Atleta)
    //   .createQueryBuilder("atleta")
    //   .where('atleta.nome = :nome', { nome: 'caca' })
    //   .getOne()

    // console.log('o q tem em tutu: ', tutu)

    // const novaRaca = new Raca()
    // novaRaca.nome = 'jacare'
    // dados.manager.save(novaRaca)

    // const novaCategoria = new Categoria()
    // novaCategoria.nome = 'Border Collie'
    // dados.manager.save(novaCategoria)


    // const novoAtleta = new Atleta()
    // novoAtleta.nome = 'Joao'
    // novoAtleta.ativo = true
    // novoAtleta.cpf = '070.333.999-09'
    // novoAtleta.dataNascimento = '1986-07-25'
    // novoAtleta.telefone = '(37) 98417-4868'
    // novoAtleta.whatsapp = '(37) 98417-4868'
    // novoAtleta.email = 'joao@gmail.com'
    // novoAtleta.senha = '1234567'
    // dados.manager.save(novoAtleta)

    // const tutu = await dados
    //   .getRepository(Atleta)
    //   .createQueryBuilder("atleta")
    //   .where('atleta.nome = :nome', { nome: 'caca' })
    //   .getOne()

    // console.log('o q tem em tutu: ', tutu)

    // const novoCao = new Cao()
    // novoCao.nome = 'Bill'
    // novoCao.ativo = true
    // novoCao.dataNascimento = '2009-09-15'
    // novoCao.idCategria = 'b3fc5076-86ad-4e90-b449-a159bdec8d3f'
    // novoCao.idAtleta = '2227f7dc-dfc3-439c-98f4-4007e3166a53'
    // novoCao.idRaca = 'cc9c3e5e-20e2-47aa-bc69-ad306ebdfc1f'

    // const caesRs = dados.getRepository(Cao)
    // caesRs.save(novoCao)

    // const camp = new Campeonato()
    // camp.nomeCamp = 'Campeonato Paulista'
    // camp.pais = 'Brasil'
    // camp.uf = 'SP'
    // camp.temporada = 2024
    // const campRs = dados.getRepository(Campeonato)
    // campRs.save(camp)

    // const prova = new Prova()
    // prova.nomeProva = 'Prova Divinópolis Cia Caes'
    // prova.endereco = 'Av JK,'
    // prova.numero = 121
    // prova.bairro = 'Santa Clara'
    // prova.cidade = 'Divinópolis'
    // prova.uf = 'MG'
    // prova.cep = '35.500-155'
    // prova.email = 'ciacaes@gmail.com'
    // prova.telefone = '(37) 3011-1112'
    // prova.whatsapp = '(37) 98417-4848'
    // prova.adicionais = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo corporis ex maxime velit voluptatum esse illum tempore amet cupiditate quas deserunt ipsam totam, distinctio illo commodi nam iure earum. Voluptates!'
    // prova.dataProva = '2024-04-11'
    // prova.horaProva = '08:00:00'
    // prova.localizacao = '1231313131313'
    // prova.valorProva = 150.00
    // prova.piso = PisoTypes.grama_sintetica
    // prova.idCamp = '7405933c-4b8b-4375-85a4-8f96a43ba076'
    // const provaRs = dados.getRepository(Prova)
    // provaRs.save(prova)

  })
  .catch((err) => {
    console.log('Erro ao inicializar o Data Source!', err.message)
  })

