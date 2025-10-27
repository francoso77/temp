import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Notificacao } from './entity/notification'
import { NotificacaoController } from './controllers/notification.controller'
import { NotificacaoService } from './auth/services/notification.service'

@Module({
  imports: [TypeOrmModule.forFeature([Notificacao])],
  controllers: [NotificacaoController],
  providers: [NotificacaoService],
  exports: [NotificacaoService], // importante caso outro módulo use o service
})
export class NotificacaoModule { }
