import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common"
import Pedido from '../entities/pedido.entity'
import { AppDataSource } from '../data-source'
import { StatusPedidoType } from '../types/statusPedidoTypes'

@Controller()
export class OutController {

  @Get("pedidosEmAberto")
  async pedidosEmAberto(): Promise<Array<Pedido>> {
    return AppDataSource.getRepository(Pedido).find({
      where: { statusPedido: StatusPedidoType.aberto }
    })
  }
}