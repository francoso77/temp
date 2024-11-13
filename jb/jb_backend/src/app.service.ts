import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public constructor() {
    console.log('Constructor do AppService....')
  }
  getHello(): string {
    return 'Hello World!';
  }
}
