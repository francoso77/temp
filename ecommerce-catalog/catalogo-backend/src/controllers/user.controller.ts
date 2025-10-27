// user.controller.ts
import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from '../auth/services/user.service';
import { User } from '../entity/sistema/user';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ ok: boolean; mensagem: string }> {
    try {
      await this.userService.requestPasswordReset(email);

      return {
        ok: true,
        mensagem: 'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Não foi possível processar a solicitação.');
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ ok: boolean; mensagem: string }> {
    try {
      await this.userService.resetPassword(token, newPassword);
      return {
        ok: true,
        mensagem: 'Senha redefinida com sucesso!',
      };
    } catch (error) {

      console.error('Erro ao redefinir senha:', error);

      throw new InternalServerErrorException('Erro ao redefinir senha.');
    }
  }

  @Post('send-email')
  async sendEmail(@Body('email') email: string) {
    await this.userService.notifyUser(email);
    return { message: 'E-mail enviado com sucesso!' };
  }

  /**
 * @Post('user')
 * Cria um novo usuário
 */
  @Post('user')
  @UseInterceptors(FilesInterceptor('data'))
  async createUser(@Body() userData: any): Promise<User> {

    // userData.cnpj = userData.cnpj?.replace(/\D/g, ''); // Remove caracteres não numéricos do CNPJ
    // userData.whatsapp = userData.whatsapp?.replace(/\D/g, ''); // Remove caracteres não numéricos do WhatsApp 
    try {
      const user = await this.userService.createUser(userData);
      return user; // Retorna o usuário criado (sem a senha, idealmente, se for uma prática segura)
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      // Você pode adicionar validações e exceções mais específicas aqui, se necessário.
      // Por exemplo, para e-mail duplicado, CNPJ duplicado, etc.
      if (error.code === '23505') { // Exemplo para erro de violação de unique constraint no PostgreSQL
        throw new BadRequestException('Usuário com este e-mail ou CNPJ já existe.');
      }
      throw new InternalServerErrorException('Não foi possível criar o usuário. Usuário com este e-mail ou CNPJ já existe.');
    }
  }
}