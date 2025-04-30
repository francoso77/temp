// src/filters/forbidden-exception.filter.ts
import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    if (status === HttpStatus.FORBIDDEN) {
      // Retorna uma resposta mais amigável em caso de erro 403 Forbidden
      return response.status(status).json({
        statusCode: status,
        message: 'Você não tem permissão para acessar este recurso.',
      });
    }

    // Para outros erros, mantém o comportamento padrão
    response.status(status).json(exception.getResponse());
  }
}
