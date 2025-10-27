import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';
import * as express from 'express';


//Uso em produção
import * as fs from 'node:fs';
import { join } from 'node:path';

dotenv.config();

async function iniciandoBD() {
  //uso da variavel de ambiente
  //Desenvolvimento local
  //const corsOrigin = process.env.CORS_ORIGIN || '*';

  //Produção
  const corsOrigin = '*';//'http://localhost:3000';//'https://finance.jbtextil.ind.br';//'http://localhost:3000';
  const app = await NestFactory.create(AppModule, {
    //opção usada em produção
    // httpsOptions: {
    //   key: fs.readFileSync(process.env.SSL_KEY),
    //   cert: fs.readFileSync(process.env.SSL_CERT)
    // }
  });

  //Libera acesso CORS
  app.enableCors({
    origin: corsOrigin, // Permite requisições apenas desta origem
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization', // Cabeçalhos permitidos
    credentials: true, // Se você usa cookies ou cabeçalhos de autorização
  });

  // ✅ Expõe a pasta de uploads como pública
  app.use(
    '/uploads',
    (req, res, next) => {
      if (req.path === '/' || req.path === '') {
        return res.status(403).send('Acesso direto à pasta uploads não permitido');
      }
      next();
    },
    express.static(join(__dirname, '..', 'uploads')),
  );



  await AppDataSource.initialize();
  await app.listen(4000, '0.0.0.0');
  //await app.listen(process.env.REACT_APP_BACKEND_PORTA || 4000);
}

iniciandoBD();
