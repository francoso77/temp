// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'frank77invest@gmail.com',
        pass: process.env.SMTP_PASS || 'bqmo jguq mnap jqjl',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Controle Financeiro" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }
}
