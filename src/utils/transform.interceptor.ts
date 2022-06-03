import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';

export interface EndpointResponse<T> {
  response: T;
  statusCode: number;
  errors: { message: string }[];
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<EndpointResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        response: data,
        errors: [],
        statusCode: response.statusCode,
      })),
    );
  }
}
