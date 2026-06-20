import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { EmployeesService } from '../employees.service';
import { EmployeesRepository } from '../employees.repository';
import { UsersRepository } from '../../users/users.repository';
import { CompaniesRepository } from '../../companies/companies.repository';
import { PlansRepository } from '../../plans/plans.repository';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { DocumentsService } from '../../documents/documents.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import type { JwtPayload } from '../../auth/strategies/jwt.strategy';

const TENANT_ID = new Types.ObjectId().toString();
const PLAN_ID = new Types.ObjectId().toString();
const ACTOR_ID = new Types.ObjectId().toString();
const EMPLOYEE_ID = new Types.ObjectId().toString();
const BRANCH_ID = new Types.ObjectId().toString();
const SUPERVISOR_EMPLOYEE_ID = new Types.ObjectId().toString();

function makeJwtPayload(
  role = 'HR_ADMIN',
  overrides: Partial<JwtPayload> = {},
): JwtPayload {
  return {
    sub: ACTOR_ID,
    role,
    companyId: TENANT_ID,
    branchId: null,
    ...overrides,
  };
}

function makeEmployeeDoc(overrides = {}) {
  const data = {
    _id: new Types.ObjectId(EMPLOYEE_ID),
    firstName: 'John',
    lastName: 'Doe',
    phone: '+8562012345678',
    tenantId: new Types.ObjectId(TENANT_ID),
    status: 'ACTIVE',
    employeeCode: 'EMP-202605-001',
    userId: null,
    ...overrides,
  };
  return { ...data, toJSON: () => ({ ...data }) };
}

function makeUserDoc(overrides = {}) {
  return {
    _id: new Types.ObjectId(),
    phone: '+8562012345678',
    role: 'STAFF',
    ...overrides,
  };
}

describe('EmployeesService', () => {
  let service: EmployeesService;
  let employeesRepository: jest.Mocked<EmployeesRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let companiesRepository: jest.Mocked<CompaniesRepository>;
  let plansRepository: jest.Mocked<PlansRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;
  let documentsService: jest.Mocked<DocumentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EmployeesRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findPaginated: jest.fn(),
            update: jest.fn(),
            setStatus: jest.fn(),
            linkUser: jest.fn(),
            countByTenant: jest.fn(),
            generateNextCode: jest.fn(),
            findByUserIdAndTenant: jest.fn(),
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
          provide: CompaniesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: PlansRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: AuditLogService,
          useValue: { log: jest.fn() },
        },
        {
          provide: DocumentsService,
          useValue: {
            addDocument: jest.fn(),
            getEmployeeDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    employeesRepository = module.get(EmployeesRepository);
    usersRepository = module.get(UsersRepository);
    companiesRepository = module.get(CompaniesRepository);
    plansRepository = module.get(PlansRepository);
    auditLogService = module.get(AuditLogService);
    documentsService = module.get(DocumentsService);

    companiesRepository.findById.mockResolvedValue({
      planId: new Types.ObjectId(PLAN_ID),
    } as never);
    plansRepository.findById.mockResolvedValue({
      isActive: true,
      maxEmployees: 50,
    } as never);
    employeesRepository.countByTenant.mockResolvedValue(0);
  });

  describe('create', () => {
    const dto: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+8562012345678',
      initialPassword: 'password123',
    };

    it('creates employee, creates user account, and links them', async () => {
      const employeeDoc = makeEmployeeDoc();
      const userDoc = makeUserDoc();

      employeesRepository.generateNextCode.mockResolvedValue('EMP-202605-001');
      employeesRepository.create.mockResolvedValue(employeeDoc as never);
      usersRepository.existsByPhoneAndCompany.mockResolvedValue(false);
      usersRepository.create.mockResolvedValue(userDoc as never);
      employeesRepository.linkUser.mockResolvedValue(undefined);
      auditLogService.log.mockResolvedValue(undefined);

      const currentUser = makeJwtPayload('HR_ADMIN');
      const result = await service.create(currentUser, dto);

      expect(employeesRepository.create).toHaveBeenCalledWith(
        new Types.ObjectId(TENANT_ID),
        expect.objectContaining({
          firstName: 'John',
          employeeCode: 'EMP-202605-001',
        }),
      );
      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ phone: dto.phone, role: 'STAFF' }),
      );
      expect(employeesRepository.linkUser).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_EMPLOYEE' }),
      );
      expect(result).toEqual(employeeDoc);
    });

    it('skips user creation if phone already has a user in the company', async () => {
      const employeeDoc = makeEmployeeDoc();

      employeesRepository.generateNextCode.mockResolvedValue('EMP-202605-002');
      employeesRepository.create.mockResolvedValue(employeeDoc as never);
      usersRepository.existsByPhoneAndCompany.mockResolvedValue(true);
      auditLogService.log.mockResolvedValue(undefined);

      await service.create(makeJwtPayload(), dto);

      expect(usersRepository.create).not.toHaveBeenCalled();
    });

    it('throws ConflictException on duplicate phone (mongo error code 11000)', async () => {
      employeesRepository.generateNextCode.mockResolvedValue('EMP-202605-001');
      employeesRepository.create.mockRejectedValue({ code: 11000 });

      await expect(service.create(makeJwtPayload(), dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws ForbiddenException when employee quota is reached', async () => {
      employeesRepository.countByTenant.mockResolvedValue(50);
      plansRepository.findById.mockResolvedValue({
        isActive: true,
        maxEmployees: 50,
      } as never);

      await expect(service.create(makeJwtPayload(), dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(employeesRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    it('sets status to INACTIVE and logs the action', async () => {
      const employeeDoc = makeEmployeeDoc();
      const deactivated = makeEmployeeDoc({ status: 'INACTIVE' });

      employeesRepository.findById.mockResolvedValue(employeeDoc as never);
      employeesRepository.setStatus.mockResolvedValue(deactivated as never);
      auditLogService.log.mockResolvedValue(undefined);

      const result = await service.deactivate(makeJwtPayload(), EMPLOYEE_ID);

      expect(employeesRepository.setStatus).toHaveBeenCalledWith(
        EMPLOYEE_ID,
        new Types.ObjectId(TENANT_ID),
        'INACTIVE',
      );
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DEACTIVATE_EMPLOYEE' }),
      );
      expect(result).toEqual(deactivated);
    });

    it('throws NotFoundException when employee does not exist', async () => {
      employeesRepository.findById.mockResolvedValue(null);

      await expect(
        service.deactivate(makeJwtPayload(), EMPLOYEE_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('list (scope filter)', () => {
    it('BRANCH_MANAGER list is filtered to their own branchId', async () => {
      employeesRepository.findPaginated.mockResolvedValue({
        employees: [],
        total: 0,
      });

      const branchManagerUser = makeJwtPayload('BRANCH_MANAGER', {
        branchId: BRANCH_ID,
      });
      await service.list(branchManagerUser, {});

      expect(employeesRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ branchId: new Types.ObjectId(BRANCH_ID) }),
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
      );
    });

    it('SUPERVISOR list is filtered to employees they manage/supervise', async () => {
      employeesRepository.findPaginated.mockResolvedValue({
        employees: [],
        total: 0,
      });
      employeesRepository.findByUserIdAndTenant.mockResolvedValue({
        _id: new Types.ObjectId(SUPERVISOR_EMPLOYEE_ID),
      } as never);

      const supervisorUser = makeJwtPayload('SUPERVISOR');
      await service.list(supervisorUser, {});

      expect(employeesRepository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { managerId: new Types.ObjectId(SUPERVISOR_EMPLOYEE_ID) },
            { supervisorId: new Types.ObjectId(SUPERVISOR_EMPLOYEE_ID) },
          ]),
        }),
        expect.any(Number),
        expect.any(Number),
        expect.any(String),
      );
    });

    it('HR_ADMIN list has no extra scope restrictions', async () => {
      employeesRepository.findPaginated.mockResolvedValue({
        employees: [],
        total: 0,
      });

      await service.list(makeJwtPayload('HR_ADMIN'), {});

      const callArg = employeesRepository.findPaginated.mock.calls[0][0];
      expect(callArg).not.toHaveProperty('branchId');
      expect(callArg).not.toHaveProperty('$or');
    });
  });

  describe('getOne', () => {
    it('STAFF can access their own record', async () => {
      const userId = new Types.ObjectId(ACTOR_ID);
      const employeeDoc = makeEmployeeDoc({ userId });

      employeesRepository.findById.mockResolvedValue(employeeDoc as never);

      const staffUser = makeJwtPayload('STAFF');
      const result = await service.getOne(staffUser, EMPLOYEE_ID);

      expect(result).toEqual(expect.objectContaining({ firstName: 'John' }));
    });

    it('STAFF cannot access another employee record', async () => {
      const anotherUserId = new Types.ObjectId();
      const employeeDoc = makeEmployeeDoc({ userId: anotherUserId });

      employeesRepository.findById.mockResolvedValue(employeeDoc as never);

      const staffUser = makeJwtPayload('STAFF');
      await expect(service.getOne(staffUser, EMPLOYEE_ID)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFoundException when employee not found', async () => {
      employeesRepository.findById.mockResolvedValue(null);

      await expect(
        service.getOne(makeJwtPayload(), EMPLOYEE_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
