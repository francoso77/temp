// user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { User } from '../../entity/sistema/user';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) { }

  async requestPasswordReset(email: string): Promise<void> {

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.userRepository.save(user);

    //const protocol = this.configService.get<string>('REACT_APP_BACKEND_PROTOCOLO');
    //const host = this.configService.get<string>('REACT_APP_BACKEND_HOST');
    //const port = this.configService.get<string>('REACT_APP_BACKEND_PORTA');

    const frontProtocol = this.configService.get<string>('REACT_APP_FRONT_PROTOCOLO');
    const frontHost = this.configService.get<string>('REACT_APP_FRONT_HOST');
    const frontPort = this.configService.get<string>('REACT_APP_FRONT_PORTA');

    //const resetLink = `${protocol}${host}:${port}/reset-password?token=${token}`;
    const resetLink = `${frontProtocol}${frontHost}:${frontPort}/reset-password?token=${token}`;

    await this.emailService.sendMail(
      user.email,
      'Recuperação de senha',
      `Clique aqui para redefinir sua senha: ${resetLink}`,
      `<p>Clique <a href="${resetLink}">aqui</a> para redefinir sua senha.</p>`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Token inválido ou expirado');

    user.password = newPassword;
    user.isActive = false;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.userRepository.save(user);
  }

  async notifyUser(email: string) {
    await this.emailService.sendMail(
      email,
      'Bem-vindo!',
      'Olá, seja bem-vindo ao nosso sistema!',
      '<b>Olá, seja bem-vindo ao nosso sistema!</b>',
    );
  }
}
