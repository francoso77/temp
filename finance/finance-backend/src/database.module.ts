import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: "Frk@071569#",
      //password: '071569', //casa
      database: 'finance',
      synchronize: true,
      autoLoadEntities: true, // importa automaticamente as entidades dos módulos
    }),
  ],
})
export class DatabaseModule { }
