import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../users/users.repository';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { EmployeesRepository } from '../../employees/employees.repository';
import { ShiftsRepository } from '../../shifts/shifts.repository';
import { CompaniesRepository } from '../../companies/companies.repository';
import { PlansRepository } from '../../plans/plans.repository';

const mockUserId = new Types.ObjectId();
const mockCompanyId = new Types.ObjectId();

function makeUser(overrides: Partial<UserDocument> = {}): UserDocument {
  return {
    _id: mockUserId,
    phone: '+85620111111',
    password: 'hashed_password',
    name: 'Test User',
    role: 'COMPANY_OWNER',
    companyId: mockCompanyId,
    branchId: null,
    isActive: true,
    refreshToken: null,
    ...overrides,
  } as unknown as UserDocument;
}

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let auditLogService: jest.Mocked<AuditLogService>;
  let companiesRepository: jest.Mocked<CompaniesRepository>;
  let plansRepository: jest.Mocked<PlansRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
            findByIdWithSensitive: jest.fn(),
            findByPhoneAndCompany: jest.fn(),
            findAllByPhone: jest.fn(),
            updateRefreshToken: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                'jwt.accessSecret': 'access_secret',
                'jwt.refreshSecret': 'refresh_secret',
                'jwt.accessExpiresIn': '15m',
                'jwt.refreshExpiresIn': '7d',
              };
              return config[key];
            }),
          },
        },
        {
          provide: AuditLogService,
          useValue: { log: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: EmployeesRepository,
          useValue: { findByUserId: jest.fn().mockResolvedValue(null) },
        },
        {
          provide: ShiftsRepository,
          useValue: {
            findCurrentAssignment: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: CompaniesRepository,
          useValue: { findById: jest.fn().mockResolvedValue({ planId: null }) },
        },
        {
          provide: PlansRepository,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
    auditLogService = module.get(AuditLogService);
    companiesRepository = module.get(CompaniesRepository);
    plansRepository = module.get(PlansRepository);
  });

  afterEach(() => jest.clearAllMocks());

  // ---- login ----

  describe('login', () => {
    it('should return tokens and user on valid credentials', async () => {
      const user = makeUser();
      const hashedPassword = await bcrypt.hash('Password@1', 12);
      user.password = hashedPassword;

      usersRepository.findAllByPhone.mockResolvedValue([user]);
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);
      usersRepository.updateRefreshToken.mockResolvedValue();

      const result = await service.login({
        phone: user.phone,
        password: 'Password@1',
      });

      expect(result.accessToken).toBe('mock_token');
      expect(result.refreshToken).toBe('mock_token');
      expect(result.user.phone).toBe(user.phone);
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN' }),
      );
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const user = makeUser({ password: await bcrypt.hash('correct', 12) });

      usersRepository.findAllByPhone.mockResolvedValue([user]);
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);

      await expect(
        service.login({ phone: user.phone, password: 'wrong_password' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_FAILED' }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findAllByPhone.mockResolvedValue([]);

      await expect(
        service.login({ phone: '+85699999999', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException when user is inactive', async () => {
      const user = makeUser({ isActive: false });
      const hashedPassword = await bcrypt.hash('Password@1', 12);
      user.password = hashedPassword;

      usersRepository.findAllByPhone.mockResolvedValue([user]);
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);

      await expect(
        service.login({ phone: user.phone, password: 'Password@1' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when phone in multiple companies without companyCode', async () => {
      const user1 = makeUser({ companyId: new Types.ObjectId() });
      const user2 = makeUser({ companyId: new Types.ObjectId() });

      usersRepository.findAllByPhone.mockResolvedValue([user1, user2]);

      await expect(
        service.login({ phone: '+85620111111', password: 'any' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should login SUPER_ADMIN without companyCode', async () => {
      const superAdmin = makeUser({ role: 'SUPER_ADMIN', companyId: null });
      const hashedPassword = await bcrypt.hash('Admin@1234', 12);
      superAdmin.password = hashedPassword;

      usersRepository.findAllByPhone.mockResolvedValue([superAdmin]);
      usersRepository.findByIdWithSensitive.mockResolvedValue(superAdmin);
      usersRepository.updateRefreshToken.mockResolvedValue();

      const result = await service.login({
        phone: superAdmin.phone,
        password: 'Admin@1234',
      });

      expect(result.user.role).toBe('SUPER_ADMIN');
    });
  });

  // ---- refresh ----

  describe('refresh', () => {
    it('should return new tokens on valid refresh token', async () => {
      const rawToken = 'raw_refresh_token';
      const hashedToken = await bcrypt.hash(rawToken, 12);
      const user = makeUser({ refreshToken: hashedToken });

      usersRepository.findByIdWithSensitive.mockResolvedValue(user);
      usersRepository.updateRefreshToken.mockResolvedValue();

      const result = await service.refresh(mockUserId.toString(), rawToken);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException when user has no stored refresh token', async () => {
      const user = makeUser({ refreshToken: null });
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);

      await expect(
        service.refresh(mockUserId.toString(), 'any_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when refresh token does not match stored hash', async () => {
      const hashedToken = await bcrypt.hash('correct_token', 12);
      const user = makeUser({ refreshToken: hashedToken });
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);

      await expect(
        service.refresh(mockUserId.toString(), 'wrong_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findByIdWithSensitive.mockResolvedValue(null);

      await expect(
        service.refresh(mockUserId.toString(), 'any'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ---- logout ----

  describe('logout', () => {
    it('should clear refresh token in DB', async () => {
      usersRepository.updateRefreshToken.mockResolvedValue();

      await service.logout(mockUserId.toString());

      expect(usersRepository.updateRefreshToken).toHaveBeenCalledWith(
        mockUserId.toString(),
        null,
      );
    });
  });

  // ---- getMe ----

  describe('getMe', () => {
    it('should return user when found', async () => {
      const user = makeUser();
      usersRepository.findById.mockResolvedValue(user);

      const result = await service.getMe(mockUserId.toString());

      expect(result.phone).toBe(user.phone);
    });

    it('should return tenant features from a populated company plan', async () => {
      const user = makeUser();
      const planId = new Types.ObjectId();
      const populatedPlan = {
        _id: planId,
        name: 'pro',
        features: {
          attendance: true,
          shiftManagement: true,
          attendanceAdjustment: true,
          outsideWork: true,
          leave: true,
          ot: false,
          payroll: true,
          restDayCompensation: true,
          advancedReport: true,
          announcement: true,
        },
      };
      usersRepository.findById.mockResolvedValue(user);
      companiesRepository.findById.mockResolvedValue({
        planId: populatedPlan,
        subscription: { status: 'ACTIVE', isPaid: true },
      } as never);

      const result = await service.getMe(mockUserId.toString());

      expect(result.features?.ot).toBe(false);
      expect(result.features?.payroll).toBe(true);
      expect(result.subscriptionSummary?.planId).toBe(planId.toString());
      expect(plansRepository.findById).not.toHaveBeenCalled();
    });

    it('should serialize every feature from a Mongoose plan subdocument', async () => {
      const user = makeUser();
      const planId = new Types.ObjectId();
      const featureValues = {
        attendance: true,
        shiftManagement: true,
        attendanceAdjustment: true,
        outsideWork: true,
        leave: true,
        ot: false,
        payroll: true,
        restDayCompensation: true,
        advancedReport: true,
        announcement: true,
      };
      const mongooseFeatures = {
        toObject: () => featureValues,
      };
      usersRepository.findById.mockResolvedValue(user);
      companiesRepository.findById.mockResolvedValue({
        planId: {
          _id: planId,
          name: 'pro',
          features: mongooseFeatures,
        },
        subscription: { status: 'ACTIVE', isPaid: true },
      } as never);

      const result = await service.getMe(mockUserId.toString());

      expect(result.features).toEqual(featureValues);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.getMe(mockUserId.toString())).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ---- changePassword ----

  describe('changePassword', () => {
    it('should update password and clear refresh token', async () => {
      const user = makeUser({ password: await bcrypt.hash('OldPass@1', 12) });
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);
      usersRepository.updatePassword.mockResolvedValue();
      usersRepository.updateRefreshToken.mockResolvedValue();

      await service.changePassword(mockUserId.toString(), {
        oldPassword: 'OldPass@1',
        newPassword: 'NewPass@1',
      });

      expect(usersRepository.updatePassword).toHaveBeenCalled();
      expect(usersRepository.updateRefreshToken).toHaveBeenCalledWith(
        mockUserId.toString(),
        null,
      );
    });

    it('should throw BadRequestException when old password is wrong', async () => {
      const user = makeUser({ password: await bcrypt.hash('correct', 12) });
      usersRepository.findByIdWithSensitive.mockResolvedValue(user);

      await expect(
        service.changePassword(mockUserId.toString(), {
          oldPassword: 'wrong',
          newPassword: 'NewPass@1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
