import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Provedor de email, ex.: Gmail
        port: 587,             // Porta para SMTP seguro
        secure: false,         // Use TLS
        auth: {
          user: 'ti@jbtextil.com', // Seu email
          pass: 'textiljb4009',           // Sua senha ou App Password
        },
      },
      defaults: {
        from: '"No Reply" <noreply@seusite.com>', // Email padrão do remetente
      },
      template: {
        dir: join(__dirname, 'templates'), // Diretório dos templates de e-mail
        adapter: new HandlebarsAdapter(),  // Adaptador para usar templates Handlebars
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailerModule {
  static forRoot: any;
}
