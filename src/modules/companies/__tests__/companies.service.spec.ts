import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CompaniesService } from '../companies.service';
import { CompaniesRepository } from '../companies.repository';
import { UsersRepository } from '../../users/users.repository';
import { PlansRepository } from '../../plans/plans.repository';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { CompanyDocument } from '../schemas/company.schema';
import { PlanDocument } from '../../plans/schemas/plan.schema';

const mockCompanyId = new Types.ObjectId();
const mockPlanId = new Types.ObjectId();
const mockActorId = new Types.ObjectId().toString();

function makeCompany(overrides: Partial<CompanyDocument> = {}): CompanyDocument {
  return {
    _id: mockCompanyId,
    name: 'Test Corp',
    status: 'TRIAL',
    planId: null,
    subscription: { status: 'TRIAL', isPaid: false },
    ...overrides,
  } as unknown as CompanyDocument;
}

function makePlan(overrides: Partial<PlanDocument> = {}): PlanDocument {
  return {
    _id: mockPlanId,
    name: 'Pro Plan',
    isActive: true,
    maxEmployees: 100,
    maxBranches: 10,
    maxStorageGB: 20,
    features: {
      attendance: true,
      shiftManagement: true,
      leave: true,
      ot: true,
      payroll: true,
      advancedReport: false,
      announcement: true,
      attendanceAdjustment: false,
      restDayCompensation: false,
    },
    trialDays: 30,
    price: 500000,
    currency: 'LAK',
    ...overrides,
  } as unknown as PlanDocument;
}

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepository: jest.Mocked<CompaniesRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let plansRepository: jest.Mocked<PlansRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: CompaniesRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdWithPlan: jest.fn(),
            findPaginated: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            countActiveEmployees: jest.fn(),
            countActiveBranches: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            existsByPhoneAndCompany: jest.fn(),
          },
        },
        {
          provide: PlansRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: AuditLogService,
          useValue: { log: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companiesRepository = module.get(CompaniesRepository);
    usersRepository = module.get(UsersRepository);
    plansRepository = module.get(PlansRepository);
    auditLogService = module.get(AuditLogService);
  });

  afterEach(() => jest.clearAllMocks());

  // ---- createCompany ----

  describe('createCompany', () => {
    it('should create company without planId', async () => {
      const company = makeCompany();
      companiesRepository.create.mockResolvedValue(company);

      const result = await service.createCompany(
        { name: 'Test Corp' },
        mockActorId,
        'SUPER_ADMIN',
      );

      expect(companiesRepository.create).toHaveBeenCalledWith({ name: 'Test Corp' });
      expect(result.name).toBe('Test Corp');
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_COMPANY' }),
      );
    });

    it('should create company with valid planId', async () => {
      const plan = makePlan();
      const company = makeCompany({ planId: mockPlanId });
      plansRepository.findById.mockResolvedValue(plan);
      companiesRepository.create.mockResolvedValue(company);

      const result = await service.createCompany(
        { name: 'Test Corp', planId: mockPlanId.toString() },
        mockActorId,
        'SUPER_ADMIN',
      );

      expect(plansRepository.findById).toHaveBeenCalledWith(mockPlanId.toString());
      expect(result.planId).toEqual(mockPlanId);
    });

    it('should throw BadRequestException when planId is invalid ObjectId', async () => {
      await expect(
        service.createCompany(
          { name: 'Test Corp', planId: 'not-a-valid-id' },
          mockActorId,
          'SUPER_ADMIN',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when plan not found', async () => {
      plansRepository.findById.mockResolvedValue(null);

      await expect(
        service.createCompany(
          { name: 'Test Corp', planId: mockPlanId.toString() },
          mockActorId,
          'SUPER_ADMIN',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when plan is inactive', async () => {
      plansRepository.findById.mockResolvedValue(makePlan({ isActive: false }));

      await expect(
        service.createCompany(
          { name: 'Test Corp', planId: mockPlanId.toString() },
          mockActorId,
          'SUPER_ADMIN',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---- listCompanies ----

  describe('listCompanies', () => {
    it('should return paginated companies with meta', async () => {
      const companies = [makeCompany(), makeCompany()];
      companiesRepository.findPaginated.mockResolvedValue({ companies, total: 2 });

      const result = await service.listCompanies({ page: '1', limit: '10' });

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 });
    });

    it('should use defaults when page and limit are omitted', async () => {
      companiesRepository.findPaginated.mockResolvedValue({ companies: [], total: 0 });

      await service.listCompanies({});

      expect(companiesRepository.findPaginated).toHaveBeenCalledWith(1, 20, '-createdAt');
    });
  });

  // ---- getCompany ----

  describe('getCompany', () => {
    it('should return company when found', async () => {
      const company = makeCompany();
      companiesRepository.findByIdWithPlan.mockResolvedValue(company);

      const result = await service.getCompany(mockCompanyId.toString());

      expect(result).toEqual(company);
    });

    it('should throw NotFoundException when company not found', async () => {
      companiesRepository.findByIdWithPlan.mockResolvedValue(null);

      await expect(service.getCompany(mockCompanyId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid ObjectId', async () => {
      await expect(service.getCompany('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ---- activateCompany / suspendCompany ----

  describe('activateCompany', () => {
    it('should set status to ACTIVE', async () => {
      const company = makeCompany({ status: 'SUSPENDED' });
      const updated = makeCompany({ status: 'ACTIVE' });
      companiesRepository.findById.mockResolvedValue(company);
      companiesRepository.updateStatus.mockResolvedValue(updated);

      const result = await service.activateCompany(
        mockCompanyId.toString(),
        mockActorId,
        'SUPER_ADMIN',
      );

      expect(companiesRepository.updateStatus).toHaveBeenCalledWith(
        mockCompanyId.toString(),
        'ACTIVE',
      );
      expect(result?.status).toBe('ACTIVE');
    });

    it('should throw NotFoundException when company not found', async () => {
      companiesRepository.findById.mockResolvedValue(null);

      await expect(
        service.activateCompany(mockCompanyId.toString(), mockActorId, 'SUPER_ADMIN'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('suspendCompany', () => {
    it('should set status to SUSPENDED', async () => {
      const company = makeCompany({ status: 'ACTIVE' });
      const updated = makeCompany({ status: 'SUSPENDED' });
      companiesRepository.findById.mockResolvedValue(company);
      companiesRepository.updateStatus.mockResolvedValue(updated);

      const result = await service.suspendCompany(
        mockCompanyId.toString(),
        mockActorId,
        'SUPER_ADMIN',
      );

      expect(companiesRepository.updateStatus).toHaveBeenCalledWith(
        mockCompanyId.toString(),
        'SUSPENDED',
      );
      expect(result?.status).toBe('SUSPENDED');
    });
  });

  // ---- assignPlan ----

  describe('assignPlan', () => {
    const startDate = '2026-01-01';
    const endDate = '2027-01-01';

    it('should assign plan and activate company', async () => {
      const company = makeCompany();
      const plan = makePlan();
      const updated = makeCompany({ planId: mockPlanId, status: 'ACTIVE' });

      companiesRepository.findById.mockResolvedValue(company);
      plansRepository.findById.mockResolvedValue(plan);
      companiesRepository.update.mockResolvedValue(updated);

      const result = await service.assignPlan(
        mockCompanyId.toString(),
        mockPlanId.toString(),
        startDate,
        endDate,
        true,
        mockActorId,
      );

      expect(companiesRepository.update).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'ASSIGN_PLAN' }),
      );
    });

    it('should throw BadRequestException when endDate is before startDate', async () => {
      companiesRepository.findById.mockResolvedValue(makeCompany());
      plansRepository.findById.mockResolvedValue(makePlan());

      await expect(
        service.assignPlan(
          mockCompanyId.toString(),
          mockPlanId.toString(),
          '2027-01-01',
          '2026-01-01',
          true,
          mockActorId,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when plan is inactive', async () => {
      companiesRepository.findById.mockResolvedValue(makeCompany());
      plansRepository.findById.mockResolvedValue(makePlan({ isActive: false }));

      await expect(
        service.assignPlan(
          mockCompanyId.toString(),
          mockPlanId.toString(),
          startDate,
          endDate,
          true,
          mockActorId,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid company ObjectId', async () => {
      await expect(
        service.assignPlan('bad-id', mockPlanId.toString(), startDate, endDate, true, mockActorId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---- extendSubscription ----

  describe('extendSubscription', () => {
    it('should extend subscription end date', async () => {
      const company = makeCompany({
        planId: mockPlanId,
        subscription: {
          status: 'ACTIVE',
          isPaid: true,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-12-31'),
        },
      });
      companiesRepository.findById.mockResolvedValue(company);
      companiesRepository.update.mockResolvedValue(company);

      await service.extendSubscription(
        mockCompanyId.toString(),
        { endDate: '2027-12-31' },
        mockActorId,
      );

      expect(companiesRepository.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException when new endDate is not after current endDate', async () => {
      const company = makeCompany({
        planId: mockPlanId,
        subscription: {
          status: 'ACTIVE',
          isPaid: true,
          startDate: new Date('2026-01-01'),
          endDate: new Date('2027-12-31'),
        },
      });
      companiesRepository.findById.mockResolvedValue(company);

      await expect(
        service.extendSubscription(
          mockCompanyId.toString(),
          { endDate: '2026-06-01' },
          mockActorId,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---- getUsage ----

  describe('getUsage', () => {
    it('should return usage stats with plan limits', async () => {
      const company = makeCompany({ planId: mockPlanId });
      companiesRepository.findById.mockResolvedValue(company);
      companiesRepository.countActiveEmployees.mockResolvedValue(25);
      companiesRepository.countActiveBranches.mockResolvedValue(3);
      plansRepository.findById.mockResolvedValue(makePlan());

      const result = await service.getUsage(mockCompanyId.toString());

      expect(result.employees).toBe(25);
      expect(result.branches).toBe(3);
      expect(result.limits?.maxEmployees).toBe(100);
    });

    it('should return null limits when no plan assigned', async () => {
      companiesRepository.findById.mockResolvedValue(makeCompany({ planId: null }));
      companiesRepository.countActiveEmployees.mockResolvedValue(5);
      companiesRepository.countActiveBranches.mockResolvedValue(1);

      const result = await service.getUsage(mockCompanyId.toString());

      expect(result.limits).toBeNull();
    });
  });

  // ---- createOwner ----

  describe('createOwner', () => {
    it('should create COMPANY_OWNER user', async () => {
      const company = makeCompany();
      const ownerObjectId = new Types.ObjectId();
      companiesRepository.findById.mockResolvedValue(company);
      usersRepository.existsByPhoneAndCompany.mockResolvedValue(false);
      usersRepository.create.mockResolvedValue({
        _id: ownerObjectId,
        phone: '+85620999999',
        role: 'COMPANY_OWNER',
      } as never);

      const result = await service.createOwner(
        mockCompanyId.toString(),
        { phone: '+85620999999', name: 'Owner', password: 'Pass@1234' },
        mockActorId,
        'SUPER_ADMIN',
      );

      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'COMPANY_OWNER' }),
      );
      expect(result).toBeDefined();
    });

    it('should throw ConflictException when phone already registered', async () => {
      companiesRepository.findById.mockResolvedValue(makeCompany());
      usersRepository.existsByPhoneAndCompany.mockResolvedValue(true);

      await expect(
        service.createOwner(
          mockCompanyId.toString(),
          { phone: '+85620999999', name: 'Owner', password: 'Pass@1234' },
          mockActorId,
          'SUPER_ADMIN',
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password before saving', async () => {
      companiesRepository.findById.mockResolvedValue(makeCompany());
      usersRepository.existsByPhoneAndCompany.mockResolvedValue(false);
      usersRepository.create.mockResolvedValue({ _id: new Types.ObjectId() } as never);

      await service.createOwner(
        mockCompanyId.toString(),
        { phone: '+85620999999', name: 'Owner', password: 'PlainPass@1' },
        mockActorId,
        'SUPER_ADMIN',
      );

      const createCall = usersRepository.create.mock.calls[0][0];
      const isHashed = await bcrypt.compare('PlainPass@1', createCall.password as string);
      expect(isHashed).toBe(true);
    });
  });

  // ---- getSuperDashboard ----

  describe('getSuperDashboard', () => {
    it('should return counts grouped by status', async () => {
      companiesRepository.findPaginated.mockResolvedValue({
        companies: [
          makeCompany({ status: 'ACTIVE' }),
          makeCompany({ status: 'ACTIVE' }),
          makeCompany({ status: 'TRIAL' }),
          makeCompany({ status: 'SUSPENDED' }),
        ],
        total: 4,
      });

      const result = await service.getSuperDashboard();

      expect(result.total).toBe(4);
      expect(result.active).toBe(2);
      expect(result.trial).toBe(1);
      expect(result.suspended).toBe(1);
    });
  });
});
