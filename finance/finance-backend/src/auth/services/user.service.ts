// user.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../entity/sistema/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async requestPasswordReset(email: string): Promise<void> {

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      //throw new NotFoundException('Usuário não encontrado');
      return
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.userRepository.save(user);

    // Aqui você envia o email usando seu serviço de e-mail
    // Por enquanto, log:
    console.log(`Reset Token: http://192.168.1.183:4000/reset-password?token=${token}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Token inválido ou expirado');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.userRepository.save(user);
  }
}
