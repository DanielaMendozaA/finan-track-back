import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class DbErrorsHandler {
  private static instance: DbErrorsHandler;
  constructor() {
    if (DbErrorsHandler.instance) {
      return DbErrorsHandler.instance;
    }
    DbErrorsHandler.instance = this;
  }

  handleDatabaseError(error: any): HttpException {
    const detailMessage = error.detail ? ` Detail: ${error.detail}` : '';

    switch (error.code) {
      case '23505':
        return new HttpException(`Duplicate key error.${detailMessage}`, HttpStatus.CONFLICT);
      case '22P02':
        return new HttpException(`Invalid input syntax.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '23503':
        return new HttpException(`Foreign key violation.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '23502':
        return new HttpException(`Null value violation.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '23514':
        return new HttpException(`Check constraint violation.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '42601':
        return new HttpException(`Syntax error.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '42703':
        return new HttpException(`Undefined column error.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '23504':
        return new HttpException(`Unique constraint violation.${detailMessage}`, HttpStatus.CONFLICT);
      case '40001':
        return new HttpException(`Deadlock detected, try again later.${detailMessage}`, HttpStatus.CONFLICT);
      case '42883':
        return new HttpException(`Undefined function error.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '42P01':
        return new HttpException(`Undefined table error.${detailMessage}`, HttpStatus.BAD_REQUEST);
      case '08003':
        return new HttpException(`Connection does not exist.${detailMessage}`, HttpStatus.SERVICE_UNAVAILABLE);
      case '57P03':
        return new HttpException(`Database in recovery mode, try again later.${detailMessage}`, HttpStatus.SERVICE_UNAVAILABLE);
      default:
        return new HttpException(`${error.message || 'Internal server error'}.${detailMessage}`, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public static getInstance(): DbErrorsHandler {
    return DbErrorsHandler.instance;
  }
}
