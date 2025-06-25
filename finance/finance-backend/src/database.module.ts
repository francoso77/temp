import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "Frk@071569#",
      database: process.env.DB_DATABASE || "finance",
      synchronize: false,
      autoLoadEntities: true, 
    }),
  ],
})
export class DatabaseModule { }
