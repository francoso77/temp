import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'

@Controller()
export class OutController {

  @Post("pedidosEmAberto")
  async pedidosEmAberto(
    @Body("statusPedido") statusPedido: string,
  ): Promise<Array<Pedido>> {

    console.log(statusPedido

    )
    const sql: string = `SELECT * FROM pedidos WHERE statusPedido = '${statusPedido}'`
    return AppDataSource.getRepository(Pedido).query(sql)
  }
}

