import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { JwtRefreshPayload } from './strategies/jwt-refresh.strategy';
import type { JwtPayload } from './strategies/jwt.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request): Promise<{
        data: import("./auth.service").AuthResult;
    }>;
    refresh(user: JwtRefreshPayload): Promise<{
        data: import("./auth.service").AuthResult;
    }>;
    logout(user: JwtPayload): Promise<{
        data: {
            message: string;
        };
    }>;
    getMe(user: JwtPayload): Promise<{
        data: import("./dto/me-response.dto").MeResponseDto;
    }>;
    changePassword(user: JwtPayload, dto: ChangePasswordDto): Promise<{
        data: {
            message: string;
        };
    }>;
}
