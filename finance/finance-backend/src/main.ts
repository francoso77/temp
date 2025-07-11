import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as express from 'express';

dotenv.config();

async function iniciandoBD() {
  //const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsOrigin = process.env.CORS_ORIGIN || 'http://finance.jbtextil.ind.br';//'http://localhost:3000';
  const app = await NestFactory.create(AppModule);

  // Libera acesso CORS
  app.enableCors({
    origin: corsOrigin, // Pode ser uma string ou um array de strings
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Inclua todos os métodos que sua API usa
    credentials: true, // Importante se você usa cookies, sessões ou headers de Autorização (JWT)
  });

  // ✅ Expõe a pasta de uploads como pública
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await AppDataSource.initialize();
  await app.listen(process.env.REACT_APP_BACKEND_PORTA || 4000);
}

iniciandoBD();
