import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any || "mysql",
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "Frk@071569#",
      database: process.env.DB_DATABASE || "finance",
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule { }

