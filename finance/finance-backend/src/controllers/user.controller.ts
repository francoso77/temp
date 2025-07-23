// user.controller.ts
import { BadRequestException, Body, Controller, InternalServerErrorException, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from '../auth/services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('upload-profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const user = await this.userService.createUser({
      ...body,
      profilePicture: file?.filename ?? null,
    });

    return {
      ok: true,
      message: 'Usuário cadastrado com sucesso!',
      user,
    };
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users', // pasta onde a imagem será salva
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // usa `any` pois os campos do `FormData` chegam como strings
  ) {
    const updatedData = {
      ...body,
      profilePicture: file?.filename ?? body.profilePicture ?? null,
    };

    return this.userService.updateUser(id, updatedData);
  }
}