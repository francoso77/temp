// user.controller.ts
import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { UserService } from '../auth/services/user.service';

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

}
