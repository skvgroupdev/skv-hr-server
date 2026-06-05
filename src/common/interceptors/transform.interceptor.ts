import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope {
  data: unknown;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope> {
    return next.handle().pipe(
      map((value: unknown) => {
        // If service already returned { data, meta } shape, pass through
        if (
          value !== null &&
          typeof value === 'object' &&
          'data' in (value as object)
        ) {
          return value as ResponseEnvelope;
        }
        return { data: value };
      }),
    );
  }
}
