import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { DbErrorsHandler } from '../handle-errors/handle-database-error.service';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly dbErrorsHandler = new DbErrorsHandler(); 

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDbError = (exception as any).code !== undefined;
    
    let status: number;
    let exceptionResponse: any;
    let errorResponse: any;

    if (isDbError) {
      const dbError = this.dbErrorsHandler.handleDatabaseError(exception);
      status = dbError.getStatus();
      exceptionResponse = dbError.getResponse();
    } else {
      status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      exceptionResponse = exception instanceof HttpException
        ? exception.getResponse()
        :  { message: exception instanceof Error ? exception.message : 'Internal server error' };
    }

    if (exception instanceof BadRequestException && Array.isArray((exceptionResponse as any).message)) {
      const formattedErrors = (exceptionResponse as any).message.map((error: string) => {
        const [field, ...rest] = error.split(' ');
        const fieldError: string = field.replace(/"/g, '');

        return {
          field: fieldError.toLowerCase(),
          error: rest.join(' '),
        };
      });

      errorResponse = {
        statusCode: status,
        error: 'Bad Request',
        message: formattedErrors,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    } else {
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
      };
    }

    this.logger.error(
      JSON.stringify({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
        clientIp: request.ip,
      }),
    );

    if (response.headersSent) {
      return console.error('Headers already sent for request', request.url);
    }

    response.status(status).json(errorResponse);
  }
}
