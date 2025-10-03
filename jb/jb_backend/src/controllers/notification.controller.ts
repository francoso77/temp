import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Notification } from '../entities/sistema/notification.entity';
import { NotificationManager } from '../services/notification.cls';

@Controller('notifications')
export class NotificationController {
  private manager = new NotificationManager();

  // @Get('tipo/:tipoUsuario')
  // getUserNotifications(
  //   @Param('tipoUsuario') tipoUsuario: 'admin' | 'vendedor' | 'gerenciador',
  // ) {
  //   return this.manager.getUserNotifications(tipoUsuario);
  // }

  @Get(':idUsuario')
  getUserNotifications(@Param('idUsuario') idUsuario: number) {
    return this.manager.getUserNotifications(idUsuario);
  }

  @Post()
  createNotification(@Body() data: Partial<Notification>) {
    return this.manager.createNotification(data);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.manager.markAsRead(id);
  }
}

