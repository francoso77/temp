import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'
import ProducaoMalharia from '../entities/producaoMalharia.entity'
import PerdaMalharia from '../entities/perdaMalharia.entity'
import ProgramacaoDublagem from '../entities/programacaoDublagem.entity'
import ProducaoDublagem from '../entities/producaoDublagem.entity'

@Controller()
export class OutController {

  @Post("pedidosFechados")
  async pedidosFechados(
    @Body("id") id: number,
  ): Promise<Array<Pedido>> {

    const sql = `
      SELECT 
        pd.idProgramacaoDublagem AS idProgramacaoDublagem,
        ped.idPedido AS idPedido,
        ped.dataPedido as dataPedido,
        ped.statusPedido AS statusPedido,
        pc.idPessoa AS idPessoa_cliente,
        pv.idPessoa AS idPessoa_vendedor
      FROM
        programacaodublagens pd
      INNER JOIN
        detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem
      INNER JOIN
        pedidos ped ON ped.idPedido = dpd.idPedido
      INNER JOIN
        detalhepedidos dp ON dp.idPedido = ped.idPedido
      INNER JOIN
        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente
      INNER JOIN
        pessoas pv ON pv.idPessoa = ped.idPessoa_vendedor
      WHERE 
        ped.statusPedido = 'F' AND
        pd.idProgramacaoDublagem = ?
      ORDER BY
        ped.dataPedido ASC
;
    `
    const params = [id]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("etiquetasPedidos")
  async etiquetasPedidos(
    @Body("pedidos") pedidos: Array<number>,
  ): Promise<Array<ProducaoDublagem>> {

    const ped = '(' + pedidos.map((v) => v).join(", ") + ')'

    const sql = `
      SELECT 
        pd.dataProducao AS dataProducao,
        ped.idPedido AS pedido,
        pc.idPessoa AS idCliente,
        pc.nome AS cliente,
        pro.idProduto AS idProduto,
        pro.nome AS produto,
        dp.metros AS metros
      FROM
        producaodublagens pd
      INNER JOIN
        detalheproducaodublagens dpd ON dpd.idDublagem = pd.idDublagem
      INNER JOIN
        detalhepecas dp ON dp.idDetalheProducaoDublagem = dpd.idDetalheProducaoDublagem
      INNER JOIN
        produtos pro ON pro.idProduto = dpd.idProduto
      INNER JOIN
        pedidos ped ON ped.idPedido = pd.idPedido
      INNER JOIN
        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente
      WHERE 
        ped.idPedido IN ${ped}
      GROUP BY
        pd.dataProducao, pedido, idCliente, cliente, idProduto, produto, metros
      order by
        pedido, produto ASC
    `
    const params = [ped]
    return AppDataSource.getRepository(ProducaoDublagem).query(sql, params)
  }
  @Post("fichasCortesPedidos")
  async fichasCortesPedidos(
    @Body("itemPesquisa") itemPesquisa: string,
  ): Promise<Array<ProgramacaoDublagem>> {

    const sql = `
      SELECT 
        pd.dataProgramacao,
        p.idPedido AS pedido,
        pe.nome AS cliente,
        pro.nome AS produto,
        dp.qtdPedida AS metros
      FROM
        programacaodublagens pd
      INNER JOIN
        detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem
      INNER JOIN
        pedidos p ON p.idPedido = dpd.idPedido
      INNER JOIN
        detalhepedidos dp ON dp.idPedido = p.idPedido
      INNER JOIN
        produtos pro ON pro.idProduto = dp.idProduto
      INNER JOIN
        pessoas pe ON pe.idPessoa = p.idPessoa_cliente
      WHERE 
        dp.statusItem = 3 AND
        pd.dataProgramacao = ?
        ;

    `
    const params = [itemPesquisa]
    return AppDataSource.getRepository(ProgramacaoDublagem).query(sql, params)
  }

  @Post("gerenciadorPedidosEmAberto")
  async gerenciadorPedidosEmAberto(): Promise<Array<Pedido>> {

    const sql = `
    SELECT
      p.idPedido,
      p.dataPedido,
      p.statusPedido,
      pc.nome AS nomeCliente,
      pv.nome AS nomeVendedor,
        JSON_ARRAYAGG(
    JSON_OBJECT(
      'idPedido', p.idPedido,
      'idDetalhePedido', dp.idDetalhePedido,
      'Produto', pp.nome,
      'qtd', dp.qtdPedida,
      'vrUnitario', dp.vrUnitario,
      'total', dp.qtdPedida * dp.vrUnitario,
      'status', dp.statusItem
    )
  ) AS details
    FROM 
      pedidos p
    INNER JOIN
      pessoas pc ON pc.idPessoa = p.idPessoa_cliente
    INNER JOIN
      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor
    INNER JOIN
      detalhepedidos dp ON dp.idPedido = p.idPedido
    INNER JOIN
      produtos pp ON pp.idProduto = dp.idProduto
    GROUP BY p.idPedido, p.dataPedido, p.idPrazoEntrega, pc.nome, pv.nome, p.statusPedido
    ORDER BY p.dataPedido DESC
    ;  
  `
    return AppDataSource.getRepository(Pedido).query(sql)
  }

  @Post("corteProducaoDublagem")
  async corteProducaoDublagem(
    @Body("itemPesquisa") itemPesquisa: string,
    @Body("campo") campo: 'data' | 'nome',
  ): Promise<Array<ProducaoDublagem>> {

    const sql = `
      SELECT 
        pd.dataProducao AS dataProducao,
        pd.idPedido AS pedido,
        pc.nome AS cliente,
        ped.statusPedido AS statusPedido,
        SUM(dped.qtdPedida) AS metrosPedido,
        SUM(dpd.metrosTotal) AS metros
        
      FROM 
        producaodublagens pd
      INNER JOIN
        detalheproducaodublagens dpd ON dpd.idDublagem = pd.idDublagem
      INNER JOIN
        produtos p ON p.idProduto = dpd.idProduto
      INNER JOIN 
        pedidos ped ON ped.idPedido = pd.idPedido
      INNER JOIN
        detalhepedidos dped ON dped.idPedido = ped.idPedido
      INNER JOIN
        pessoas pc ON pc.idPessoa = ped.idPessoa_cliente
      WHERE
        ${campo === 'data' ? 'pd.dataProducao = ?' : 'pc.nome LIKE ?'}
      GROUP BY
        dataProducao, pedido, cliente, statusPedido
      ORDER BY
        dataProducao, pedido, cliente
  `

    const params = [campo === 'data' ? itemPesquisa : `%${itemPesquisa}%`]
    return AppDataSource.getRepository(ProducaoDublagem).query(sql, params)
  }


  @Post("pedidosEmProducao")
  async pedidosEmProducao(
    @Body("itemPesquisa") itemPesquisa: string,
    @Body("campo") campo: 'data' | 'nome',
  ): Promise<Array<Pedido>> {

    const sql = `
    SELECT
      p.*,
      pc.nome AS nomeCliente,
      pv.nome AS nomeVendedor
    FROM 
      pedidos p
    INNER JOIN
      pessoas pc ON pc.idPessoa = p.idPessoa_cliente
    INNER JOIN
      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor
    WHERE 
      statusPedido = 'C' AND
      ${campo === 'data' ? 'dataPedido = ?' : 'pc.nome LIKE ?'}
  `

    const params = [campo === 'data' ? itemPesquisa : `%${itemPesquisa}%`]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("pedidosEmAberto")
  async pedidosEmAberto(
    @Body("itemPesquisa") itemPesquisa: string,
    @Body("campo") campo: 'data' | 'nome',
  ): Promise<Array<Pedido>> {

    const sql = `
    SELECT
      p.*,
      pc.nome AS nomeCliente,
      pv.nome AS nomeVendedor
    FROM 
      pedidos p
    INNER JOIN
      pessoas pc ON pc.idPessoa = p.idPessoa_cliente
    INNER JOIN
      pessoas pv ON pv.idPessoa = p.idPessoa_vendedor
    WHERE 
      statusPedido = 'A' AND
      ${campo === 'data' ? 'dataPedido = ?' : 'pc.nome LIKE ?'}
  `

    const params = [campo === 'data' ? itemPesquisa : `%${itemPesquisa}%`]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("pedidosEspumasEForrosProgramadas")
  async pedidosEspumasEForrosProgramadas(
    @Body("itemPesquisa") itemPesquisa: string,
    @Body("tipo") tipo: 'Espuma' | 'Forro',
  ): Promise<Array<Pedido>> {
    const tipos = [2, 6]
    let tp: any = 0
    if (tipo === 'Espuma') {
      tp = 2
    } else if (tipo === 'Forro') {
      tp = 6
    } else {
      tp = '(' + tipos.map((v) => v).join(", ") + ')'

    }
    const sql = `
      SELECT 
        pro2.idProduto AS idProduto,
        SUM(dp.qtdPedida * de.qtd) AS qtdTotal,
        pro2.nome AS materiaPrima,
        c.idCor AS idCor,
        c.nome AS cor
      FROM
        pedidos p
      INNER JOIN 
        detalhepedidos dp ON dp.idPedido = p.idPedido
      INNER JOIN
        produtos pro1 ON pro1.idProduto = dp.idProduto
      INNER JOIN
        estruturas e ON e.idProduto = dp.idProduto
      INNER JOIN
        detalheestruturas de ON de.idEstrutura = e.idEstrutura
      INNER JOIN
        produtos pro2 ON pro2.idProduto = de.idProduto
      INNER JOIN 
        cores c ON c.idCor = de.idCor
      INNER JOIN
        pessoas pc ON pc.idPessoa = p.idPessoa_cliente
      INNER JOIN 
        detalheprogramacaodublagens dpd ON dpd.idPedido = p.idPedido
      INNER JOIN 
        programacaodublagens pd ON pd.idProgramacaoDublagem = dpd.idProgramacaoDublagem

      WHERE 
        pro2.tipoProduto IN (?) AND
        dp.statusItem = 3 AND
        pd.dataProgramacao = ?
      GROUP BY
        idProduto, materiaPrima, idCor, cor
      ORDER BY
        materiaPrima, cor
        ;
      `
    const params = [tp, itemPesquisa]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("pedidosTecidosProgramadas")
  async pedidosTecidosProgramadas(
    @Body("itemPesquisa") itemPesquisa: string,
  ): Promise<Array<Pedido>> {

    const sql = `
      SELECT 
      pro2.idProduto AS idProduto,
     	p.idPedido AS idPedido,
      pc.nome AS cliente,
      pro2.nome AS produto,
      pro2.tipoProduto AS tipoProduto,
      c.nome AS cor,
      c.nivel AS corNivel,
      (de.qtd * dp.qtdPedida) AS metros
      FROM
        pedidos p
      INNER JOIN 
        detalhepedidos dp ON dp.idPedido = p.idPedido
      INNER JOIN
        produtos pro1 ON pro1.idProduto = dp.idProduto
      INNER JOIN
        estruturas e ON e.idProduto = dp.idProduto
      INNER JOIN
        detalheestruturas de ON de.idEstrutura = e.idEstrutura
      INNER JOIN
        produtos pro2 ON pro2.idProduto = de.idProduto
      INNER JOIN 
        cores c ON c.idCor = de.idCor
      INNER JOIN
        pessoas pc ON pc.idPessoa = p.idPessoa_cliente
      INNER JOIN 
        detalheprogramacaodublagens dpd ON dpd.idPedido = p.idPedido
      INNER JOIN 
        programacaodublagens pd ON pd.idProgramacaoDublagem = dpd.idProgramacaoDublagem
      WHERE 
        pro2.tipoProduto IN(2,10) AND
        dp.statusItem = 3 AND
        pd.dataProgramacao = ?
      ORDER BY
        produto, corNivel
        ;       
      `
    const params = [itemPesquisa]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("limpaPecas")
  async limpaPecas(
    @Body("tinturaria") tinturaria: number,
  ): Promise<Array<ProducaoMalharia>> {

    const sql = `
    UPDATE
      producaomalharias pm
    SET
      pm.idTinturaria = null,
      pm.fechado = 0,
      pm.dataFechado = null
    WHERE
      pm.idTinturaria = ?;
  `

    const params = [tinturaria]
    return AppDataSource.getRepository(ProducaoMalharia).query(sql, params)
  }

  @Post("atualizarStatusPedido")
  async atualizarStatusPedido(
    @Body("pedido") pedido: number,
    @Body("tipoStatus") tipoStatus: 'Incluir' | 'Excluir',
    @Body('produto') produto: number,
    @Body('qtd') qtd: number,
  ): Promise<Array<Pedido>> {

    let novoStatusPedido = 'F'
    let novoStatusItem = 2

    console.log(tipoStatus)
    console.log(pedido)
    console.log(produto)
    console.log(qtd)
    console.log(novoStatusPedido)
    console.log(novoStatusItem)

    if (tipoStatus === 'Excluir') {
      novoStatusPedido = 'C'
      novoStatusItem = 3
    }
    const sql = `
      UPDATE 
          pedidos p
      INNER JOIN 
          detalhepedidos dp ON dp.idPedido = p.idPedido
      SET 
          p.statusPedido = ?,
          dp.statusItem = ?,
          dp.qtdAtendida = ?
      WHERE 
          p.idPedido = ? 
          AND dp.idProduto = ?
    ;

  `
    const params = [novoStatusPedido, novoStatusItem, qtd, pedido, produto]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("produzirPedidos")
  async produzirPedidos(
    @Body("pedidos") pedidos: Array<number>,
    @Body("tipoProducao") tipoProducao: 'C' | 'A',
  ): Promise<Array<Pedido>> {

    const ped = '(' + pedidos.map((v) => v).join(", ") + ')'
    const sql = `
    UPDATE
      pedidos p
    JOIN detalhepedidos dp on dp.idPedido = p.idPedido 
    SET
      p.statusPedido = '${tipoProducao}',
      dp.statusItem = '${tipoProducao === 'C' ? 3 : 1}'
    WHERE
      p.idPedido IN ${ped};
  `

    const params = [ped, tipoProducao]
    return AppDataSource.getRepository(Pedido).query(sql, params)
  }

  @Post("graficos")
  async graficos(
    @Body("dtInicial") dtInicial: string,
    @Body("dtFinal") dtFinal: string,
    @Body("grupo") grupo: 'produto' | 'tecelao' | 'mes' | 'perda',
  ): Promise<Array<ProducaoMalharia | PerdaMalharia>> {
    const repository = AppDataSource.getRepository(ProducaoMalharia)
    const repositoryPerda = AppDataSource.getRepository(PerdaMalharia)
    if (grupo === 'perda') {
      // Query específica para perda
      const sqlPerda = `
        SELECT
          ROUND(SUM(qtd),2) AS pesoTotal,
          COUNT(qtd) AS qtdTotal,
          pt.nome AS tecelao
        FROM
          perdasmalharia pm
        INNER JOIN
          pessoas pt ON pt.idPessoa = pm.idPessoa_tecelao
        INNER JOIN
          produtos p ON p.idProduto = pm.idProduto
        INNER JOIN
          maquinas m ON m.idMaquina = pm.idMaquina
        WHERE
          pm.dataPerda BETWEEN ? AND ? 
        GROUP BY
          pt.nome
      `;
      return repositoryPerda.query(sqlPerda, [dtInicial, dtFinal]);
    }

    // Construção dinâmica do SELECT
    let select: string;
    if (grupo === 'mes') {
      select = 'ROUND(SUM(peso),2) AS pesoTotal, MONTH(dataProducao) AS mes';
    } else if (grupo === 'tecelao') {
      select = 'ROUND(SUM(peso),2) AS pesoTotal, pt.nome AS tecelao';
    } else if (grupo === 'produto') {
      select = 'ROUND(SUM(peso),2) AS pesoTotal, p.nome AS produto';
    } else {
      throw new Error('Grupo inválido'); // Tratamento de erro para grupo inválido
    }

    const sql = `
      SELECT
        ${select}
      FROM 
        producaomalharias pm
      INNER JOIN
        pessoas pt ON pt.idPessoa = pm.idPessoa_tecelao
      INNER JOIN
        produtos p ON p.idProduto = pm.idProduto
      WHERE
        pm.dataProducao BETWEEN ? AND ? 
      GROUP BY
        ${grupo}
    `;

    return repository.query(sql, [dtInicial, dtFinal]);
  }

  @Post("programacaoPedidos")
  async programacaoPedidos(
    @Body("itemPesquisa") itemPesquisa: string,
  ): Promise<Array<ProgramacaoDublagem>> {

    const sql = `
    SELECT 
      pd.idProgramacaoDublagem,
      pd.dataProgramacao,
      pd.qtdCola,
      pd.qtdFilme,
      SUM(dp.qtdPedida) AS metros
    FROM 
      programacaodublagens pd
    INNER JOIN
      detalheprogramacaodublagens dpd ON dpd.idProgramacaoDublagem = pd.idProgramacaoDublagem
    INNER JOIN 
      pedidos p ON p.idPedido = dpd.idPedido
    INNER JOIN
      detalhepedidos dp ON dp.idPedido = p.idPedido
    WHERE
      (pd.dataProgramacao = IFNULL(?, pd.dataProgramacao))
    GROUP BY
      pd.idProgramacaoDublagem,
      pd.dataProgramacao,
      pd.qtdCola,
      pd.qtdFilme;
      `
    return AppDataSource.getRepository(ProgramacaoDublagem).query(sql, [itemPesquisa || null])
  }

}

