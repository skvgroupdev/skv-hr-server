import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export interface JwtRefreshPayload {
    sub: string;
    role: string;
    companyId: string | null;
    branchId: string | null;
    refreshToken?: string;
}
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(configService: ConfigService);
    validate(req: Request, payload: JwtRefreshPayload): JwtRefreshPayload;
}
export {};
