import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de Senha',
      template: './redefinirSenha', // Nome do arquivo de template
      context: {
        // Dados a serem enviados para o template
        resetLink,
      },
    });
  }
}
