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
}

