// user.controller.ts
import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { UserService } from '../auth/services/user.service';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string): Promise<{ ok: boolean, mensagem: string }> {
  //   await this.userService.requestPasswordReset(email);
  //   return Promise.resolve({ ok: true, mensagem: 'Instruções de redefinição de senha enviado para o seu e-mail.' });
  // }

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
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.userService.resetPassword(body.token, body.newPassword);
    return { message: 'Senha redefinida com sucesso.' };
  }

  @Post('send-email')
  async sendEmail(@Body('email') email: string) {
    await this.userService.notifyUser(email);
    return { message: 'E-mail enviado com sucesso!' };
  }

}
