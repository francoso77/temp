// notificacao.controller.ts
import { Controller, Get, Post, Param, Body, Put, Delete } from "@nestjs/common"
import { NotificacaoService } from '../auth/services/notification.service'
import { NotificacaoInterface } from '../interfaces/notification'

@Controller("notificacoes")
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) { }

  @Get(":tipo/:id")
  async listar(
    @Param("tipo") tipo: "vendedor" | "cliente",
    @Param("id") id: string
  ) {
    return this.notificacaoService.listarPorUsuario(id, tipo)
  }

  @Post()
  async criar(@Body() body: NotificacaoInterface) {
    return this.notificacaoService.criar(body)
  }

  @Put(":id/read")
  async marcarComoLida(@Param("id") id: string) {
    return this.notificacaoService.marcarComoLida(id)
  }

  @Delete(":id")
  async excluir(@Param("id") id: string) {
    return this.notificacaoService.excluir(id)
  }
}
