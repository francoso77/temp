import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCategoria(): string {
    return 'Categoria local!';
  }
}
