import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersRepository } from '../users/users.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { ShiftsRepository } from '../shifts/shifts.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserDocument } from '../users/schemas/user.schema';
import {
  MeResponseDto,
  PositionRefDto,
  RefDto,
  SubscriptionSummaryDto,
  WorkScheduleDto,
} from './dto/me-response.dto';
import { ShiftDocument } from '../shifts/schemas/shift.schema';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';
import type { PlanFeatures } from '../plans/schemas/plan.schema';

const BCRYPT_ROUNDS = 12;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly shiftsRepository: ShiftsRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly companiesRepository: CompaniesRepository,
    private readonly plansRepository: PlansRepository,
  ) {}

  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResult> {
    const user = await this.resolveUserForLogin(dto);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      await this.auditLogService.log({
        actorId: user._id as Types.ObjectId,
        actorRole: user.role,
        action: 'LOGIN_FAILED',
        module: 'auth',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is inactive');
    }

    const tokens = await this.generateAndStoreTokens(user);

    await this.auditLogService.log({
      tenantId: user.companyId,
      actorId: user._id as Types.ObjectId,
      actorRole: user.role,
      action: 'LOGIN',
      module: 'auth',
      ipAddress,
      userAgent,
    });

    return { ...tokens, user: await this.toUserPayload(user) };
  }

  async refresh(userId: string, rawRefreshToken: string): Promise<AuthResult> {
    const user = await this.usersRepository.findByIdWithSensitive(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isTokenValid = await bcrypt.compare(
      rawRefreshToken,
      user.refreshToken,
    );
    if (!isTokenValid) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateAndStoreTokens(user);
    return { ...tokens, user: await this.toUserPayload(user) };
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.updateRefreshToken(userId, null);
  }

  async getMe(userId: string): Promise<MeResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new UnauthorizedException();

    const companyIdStr = user.companyId?.toString();
    const [features, subscriptionSummary] = await Promise.all([
      this.getFeatures(companyIdStr),
      this.getSubscriptionSummary(companyIdStr),
    ]);

    const base: MeResponseDto = {
      id: (user._id as Types.ObjectId).toString(),
      phone: user.phone,
      name: user.name,
      role: user.role,
      companyId: companyIdStr ?? null,
      branchId: user.branchId?.toString() ?? null,
      features,
      subscriptionSummary,
    };

    const employee = await this.employeesRepository.findByUserId(
      user._id as Types.ObjectId,
    );

    if (!employee) return base;

    const assignment = await this.shiftsRepository.findCurrentAssignment(
      employee._id as Types.ObjectId,
      user.companyId as Types.ObjectId,
    );

    const shift = assignment?.shiftId as unknown as ShiftDocument | undefined;
    const workSchedule = this.toWorkSchedule(shift);

    return { ...base, ...this.toEmployeeFields(employee), workSchedule };
  }

  private toEmployeeFields(
    employee: import('../employees/schemas/employee.schema').EmployeeDocument,
  ): Partial<MeResponseDto> {
    return {
      employeeId: (employee._id as Types.ObjectId).toString(),
      employeeCode: employee.employeeCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      avatarUrl: employee.photoUrl,
      bankName: employee.bankName,
      bankAccount: employee.bankAccount,
      position: this.toPositionRef(employee.positionId),
      department: this.toRef(employee.departmentId),
      branch: this.toRef(employee.branchId),
      startDate: employee.startDate?.toISOString(),
      employmentType: employee.employmentType,
      status: employee.status,
    };
  }

  private toRef(populated: unknown): RefDto | undefined {
    if (!populated || typeof populated !== 'object') return undefined;
    const doc = populated as {
      _id?: Types.ObjectId;
      id?: string;
      name?: string;
    };
    const id = doc._id?.toString() ?? doc.id ?? '';
    return id ? { id, name: doc.name ?? '' } : undefined;
  }

  private toPositionRef(populated: unknown): PositionRefDto | undefined {
    const ref = this.toRef(populated);
    if (!ref) return undefined;
    const doc = populated as { banding?: string };
    return { ...ref, banding: doc.banding };
  }

  private toWorkSchedule(
    shift: ShiftDocument | undefined,
  ): WorkScheduleDto | undefined {
    if (!shift?.startTime || !shift?.endTime) return undefined;
    return { startTime: shift.startTime, endTime: shift.endTime };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findByIdWithSensitive(userId);
    if (!user) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isValid) throw new BadRequestException('Old password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.usersRepository.updatePassword(userId, hashed);
    // Invalidate all refresh tokens after password change
    await this.usersRepository.updateRefreshToken(userId, null);
  }

  // ---------- helpers ----------

  private async resolveUserForLogin(dto: LoginDto): Promise<UserDocument> {
    // SUPER_ADMIN: no companyId
    if (!dto.companyCode) {
      const candidates = await this.usersRepository.findAllByPhone(dto.phone);

      const superAdmin = candidates.find((u) => u.role === 'SUPER_ADMIN');
      if (superAdmin) {
        return this.usersRepository.findByIdWithSensitive(
          (superAdmin._id as Types.ObjectId).toString(),
        ) as Promise<UserDocument>;
      }

      if (candidates.length === 0) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (candidates.length === 1) {
        return this.usersRepository.findByIdWithSensitive(
          (candidates[0]._id as Types.ObjectId).toString(),
        ) as Promise<UserDocument>;
      }

      // Multiple companies — must provide companyCode
      throw new BadRequestException(
        'Phone exists in multiple companies, please provide companyCode',
      );
    }

    // companyCode provided — treat as companyId directly for now
    const companyId = new Types.ObjectId(dto.companyCode);
    const user = await this.usersRepository.findByPhoneAndCompany(
      dto.phone,
      companyId,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  private async generateAndStoreTokens(user: UserDocument): Promise<TokenPair> {
    const payload = {
      sub: (user._id as Types.ObjectId).toString(),
      role: user.role,
      companyId: user.companyId?.toString() ?? null,
      branchId: user.branchId?.toString() ?? null,
    };

    const accessExpiresIn =
      this.configService.get<string>('jwt.accessExpiresIn') ?? '15m';
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        // cast needed: @nestjs/jwt v11 expiresIn is StringValue but config returns string
        expiresIn: accessExpiresIn as Parameters<
          typeof this.jwtService.signAsync
        >[1] extends { expiresIn?: infer E }
          ? E
          : never,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: refreshExpiresIn as Parameters<
          typeof this.jwtService.signAsync
        >[1] extends { expiresIn?: infer E }
          ? E
          : never,
      }),
    ]);

    const hashedRefresh = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.usersRepository.updateRefreshToken(
      (user._id as Types.ObjectId).toString(),
      hashedRefresh,
    );

    return { accessToken, refreshToken };
  }

  private async toUserPayload(user: UserDocument): Promise<UserPayload> {
    return {
      id: (user._id as Types.ObjectId).toString(),
      phone: user.phone,
      name: user.name,
      role: user.role,
      companyId: user.companyId?.toString() ?? null,
      branchId: user.branchId?.toString() ?? null,
      features: await this.getFeatures(user.companyId?.toString()),
    };
  }

  private async getFeatures(
    companyId?: string,
  ): Promise<PlanFeatures | undefined> {
    if (!companyId) return undefined;
    const company = await this.companiesRepository.findById(companyId);
    if (!company?.planId) return undefined;
    const plan = await this.plansRepository.findById(company.planId.toString());
    return plan?.features;
  }

  private async getSubscriptionSummary(
    companyId?: string,
  ): Promise<SubscriptionSummaryDto | undefined> {
    if (!companyId) return undefined;
    const company = await this.companiesRepository.findById(companyId);
    if (!company?.planId) return undefined;
    const plan = await this.plansRepository.findById(company.planId.toString());
    if (!plan) return undefined;
    return {
      planId: company.planId.toString(),
      planName: plan.name,
      status: company.subscription?.status ?? 'TRIAL',
      endDate: company.subscription?.endDate?.toISOString() ?? null,
      isPaid: company.subscription?.isPaid ?? false,
    };
  }
}
