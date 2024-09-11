import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'
import ProducaoMalharia from '../entities/producaoMalharia.entity'

@Controller()
export class OutController {

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
}

