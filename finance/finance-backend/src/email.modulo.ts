// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './auth/services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
