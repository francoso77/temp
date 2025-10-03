import { In, Repository } from 'typeorm';
import { Notification } from '../entities/sistema/notification.entity';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/sistema/usuario.entity';

export class NotificationManager {
  private notificationRepo: Repository<Notification>;
  private usuarioRepo: Repository<Usuario>;

  constructor() {
    this.notificationRepo = AppDataSource.getRepository(Notification);
    this.usuarioRepo = AppDataSource.getRepository(Usuario);
  }
  async createNotification(data: Partial<Notification>) {
    let targetTipoUsuarios: number[] = [];

    // regra de distribuição
    if (data.type === 'vendedor') {
      targetTipoUsuarios = [3, 5];
    } else if (data.type === 'gerenciador') {
      targetTipoUsuarios = [3];
    } else if (data.type === 'produtor') {
      targetTipoUsuarios = [3, 5];
    }

    if (targetTipoUsuarios.length === 0) {
      throw new Error(`Tipo de notificação inválido: ${data.type}`);
    }

    // buscar usuários que se encaixam
    const usuarios = await this.usuarioRepo.find({
      where: { tipoUsuario: In(targetTipoUsuarios) },
    });

    if (!usuarios.length) {
      throw new Error('Nenhum usuário encontrado para esse tipo de notificação.');
    }

    // gerar uma notificação para cada usuário
    const notifications = usuarios.map(usuario =>
      this.notificationRepo.create({
        ...data,
        idUsuario: usuario.idUsuario,
        usuario,
        read: false, // sempre começa como não lida
      }),
    );

    return this.notificationRepo.save(notifications);
  }
  // async createNotification(data: Partial<Notification>) {
  //   const notification = this.notificationRepo.create(data);
  //   return this.notificationRepo.save(notification);
  // }

  async getUserNotifications(idUsuario: number) {
    return this.notificationRepo.find({
      where: { usuario: { idUsuario } },
      order: { createdAt: 'DESC' },
    });
  }
  // async getUserNotifications(tipoUsuario: 'admin' | 'vendedor' | 'gerenciador', includeRead = false) {
  //   return this.notificationRepo.find({
  //     where: {
  //       tipoUsuario,
  //       ...(includeRead ? {} : { read: false }),
  //     },
  //     order: { createdAt: 'DESC' },
  //   });
  // }

  // async markAsRead(id: number) {
  //   await this.notificationRepo.update(id, { read: true });
  //   return this.notificationRepo.findOne({ where: { id } });
  // }

  async markAsRead(id: number) {
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new Error(`Notificação com id ${id} não encontrada`);
    }

    notification.read = !notification.read; // ✅ inverte o valor atual
    await this.notificationRepo.save(notification);

    return notification;
  }
}
