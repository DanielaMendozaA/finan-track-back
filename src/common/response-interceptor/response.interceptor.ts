import { Body, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IResponse } from '../interfaces/IResponse.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor <T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>>{
    return next.handle().pipe(
      map(body => {        
        const response = context.switchToHttp().getResponse();

        return{
          statusCode: response.statusCode,
          message: body ? 'Request was successfully': 'There is not a body from the data base',
          data: body!== undefined && body
        }
        
      })
    );
  }
}
