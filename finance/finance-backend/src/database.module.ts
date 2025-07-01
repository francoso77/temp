import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'Frk@071569#',
      database: 'finance',
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule { }
