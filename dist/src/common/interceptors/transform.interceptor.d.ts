import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ResponseEnvelope {
    data: unknown;
    meta?: Record<string, unknown>;
}
export declare class TransformInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope>;
}
