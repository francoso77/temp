import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import * as dotenv from 'dotenv';


dotenv.config()

async function iniciandoBD() {

  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [corsOrigin] });
  await AppDataSource.initialize();
  await app.listen(process.env.REACT_APP_BACKEND_PORTA);

}
iniciandoBD()
