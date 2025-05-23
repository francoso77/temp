import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../auth/services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send-reset')
  async sendPasswordReset(@Body('email') email: string) {
    const resetLink = `https://seusite.com/reset-password?token=seu_token_gerado`;
    await this.emailService.sendPasswordResetEmail(email, resetLink);
    return { message: 'Email enviado com sucesso!' };
  }
}
