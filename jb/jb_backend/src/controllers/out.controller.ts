import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'
import ProducaoMalharia from '../entities/producaoMalharia.entity'
import PerdaMalharia from '../entities/perdaMalharia.entity'

@Controller()
export class OutController {

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
      'idPedido', dp.idPedido,
      'Produto', pp.nome,
      'qtdPedida', dp.qtdPedida,
      'vrUnitario', dp.vrUnitario,
      'total', dp.qtdPedida * dp.vrUnitario
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
    GROUP BY p.idPedido, p.dataPedido, p.idPrazoEntrega, pc.nome, pv.nome, p.statusPedido;  
  `
    return AppDataSource.getRepository(Pedido).query(sql)
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

}

