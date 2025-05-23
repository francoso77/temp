import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioService } from '../auth/services/usuario.service';
import { EmailService } from '../auth/services/email.service';

@Controller('redefinirSenha')
export class RedefinirSenhaController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly emailService: EmailService
  ) { }

  @Post('forgotPassword')
  async forgotPassword(@Body('email') email: string) {
    const usuario = await this.usuarioService.findByEmail(email)

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado')
    }

    //Gerar token de redefinir senha
    const token: string = uuidv4()
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // 1 hora de validade

    // Atualizar o token no banco de dados
    await this.usuarioService.updateUser(usuario.id, { resetToken: token, resetTokenExpires });

    // Gerar link de redefinição
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Enviar e-mail com o link
    await this.emailService.sendPasswordResetEmail(usuario.email, resetLink);

    return { message: 'E-mail enviado com sucesso!' };
  }

  @Post('resetPassword')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    const usuario = await this.usuarioService.findByResetToken(token);

    if (!usuario || new Date() > usuario.resetTokenExpires) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Atualizar senha e limpar token
    await this.usuarioService.updateUser(usuario.id, {
      password: newPassword, // Certifique-se de hashear a senha
      resetToken: null,
      resetTokenExpires: null,
    });

    return { message: 'Senha redefinida com sucesso!' };
  }

}