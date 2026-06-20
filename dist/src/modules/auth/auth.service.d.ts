import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users/users.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { ShiftsRepository } from '../shifts/shifts.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
import type { PlanFeatures } from '../plans/schemas/plan.schema';
interface UserPayload {
    id: string;
    phone: string;
    name: string;
    role: string;
    companyId: string | null;
    branchId: string | null;
    features?: PlanFeatures;
}
export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: UserPayload;
}
export declare class AuthService {
    private readonly usersRepository;
    private readonly employeesRepository;
    private readonly shiftsRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly auditLogService;
    private readonly companiesRepository;
    private readonly plansRepository;
    constructor(usersRepository: UsersRepository, employeesRepository: EmployeesRepository, shiftsRepository: ShiftsRepository, jwtService: JwtService, configService: ConfigService, auditLogService: AuditLogService, companiesRepository: CompaniesRepository, plansRepository: PlansRepository);
    login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResult>;
    refresh(userId: string, rawRefreshToken: string): Promise<AuthResult>;
    logout(userId: string): Promise<void>;
    getMe(userId: string): Promise<MeResponseDto>;
    private toEmployeeFields;
    private toRef;
    private toPositionRef;
    private toWorkSchedule;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
    private resolveUserForLogin;
    private generateAndStoreTokens;
    private toUserPayload;
    private getFeatures;
    private getSubscriptionSummary;
}
export {};
