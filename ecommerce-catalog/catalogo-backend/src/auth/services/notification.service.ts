// notificacao.service.ts
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Notificacao } from '../../entity/notification'
import { NotificacaoInterface } from '../../interfaces/notification'


@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepo: Repository<Notificacao>,
  ) { }

  async listarPorUsuario(destinatarioId: string, destinatarioTipo: "vendedor" | "cliente") {
    return await this.notificacaoRepo.find({
      where: { destinatarioId, destinatarioTipo },
      order: { createdAt: "DESC" },
    })
  }

  async criar(data: Partial<NotificacaoInterface>) {
    const nova = this.notificacaoRepo.create(data as any)
    const salva = await this.notificacaoRepo.save(nova)
    return salva
  }

  async marcarComoLida(id: string) {
    await this.notificacaoRepo.update(id, { read: true })
    return await this.notificacaoRepo.findOne({ where: { id } })
  }

  async excluir(id: string) {
    return await this.notificacaoRepo.delete(id)
  }
}
