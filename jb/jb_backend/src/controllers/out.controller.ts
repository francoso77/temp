import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'

@Controller()
export class OutController {

  @Post("pedidosEmAberto")
  async pedidosEmAberto(
    @Body("itemPesquisa") itemPesquisa: string,
    @Body("campo") campo: 'data' | 'nome',
  ): Promise<Array<Pedido>> {

    console.log("itemPesquisa: ", itemPesquisa, " campo: ", campo)

    const sql = `
    SELECT
      p.*,
      pe.nome AS nome
    FROM 
      pedidos p
    INNER JOIN
      pessoas pe ON pe.idPessoa = p.idPessoa_cliente
    WHERE 
      statusPedido = 'A' AND
      ${campo === 'data' ? 'dataPedido = ?' : 'nome LIKE ?'}
  `

    const params = [campo === 'data' ? itemPesquisa : `%${itemPesquisa}%`]

    return AppDataSource.getRepository(Pedido).query(sql, params)
  }
}

