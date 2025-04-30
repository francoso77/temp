import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';


async function iniciandoBD() {
  //chamou o modulo que controla as rotas e os metodos de requisição
  //inicia o serviço
  const app = await NestFactory.create(AppModule)
  //serviço iniciado - porta na escuta
  //telnet localhost 4000 - para testar a porta
  await app.listen(4000)
  //iniciar o mysql - initialize
  console.log('Inicializando a conexão com o banco')
  //iniciando o bando de dados
  await AppDataSource.initialize()

}
iniciandoBD()
