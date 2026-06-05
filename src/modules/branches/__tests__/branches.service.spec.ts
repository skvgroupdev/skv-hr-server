import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { BranchesService } from '../branches.service';
import { BranchesRepository } from '../branches.repository';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { CreateBranchDto } from '../dto/create-branch.dto';

const TENANT_ID = new Types.ObjectId().toString();
const ACTOR_ID = new Types.ObjectId().toString();
const BRANCH_ID = new Types.ObjectId().toString();

function makeBranchDoc(overrides = {}) {
  return {
    _id: new Types.ObjectId(BRANCH_ID),
    name: 'Head Office',
    isActive: true,
    tenantId: new Types.ObjectId(TENANT_ID),
    ...overrides,
  };
}

describe('BranchesService', () => {
  let service: BranchesService;
  let branchesRepository: jest.Mocked<BranchesRepository>;
  let auditLogService: jest.Mocked<AuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchesService,
        {
          provide: BranchesRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findPaginated: jest.fn(),
            update: jest.fn(),
            setActive: jest.fn(),
            countByTenant: jest.fn(),
          },
        },
        {
          provide: AuditLogService,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BranchesService>(BranchesService);
    branchesRepository = module.get(BranchesRepository);
    auditLogService = module.get(AuditLogService);
  });

  describe('create', () => {
    const dto: CreateBranchDto = { name: 'Head Office' };

    it('creates a branch and logs the action', async () => {
      const branchDoc = makeBranchDoc();
      branchesRepository.create.mockResolvedValue(branchDoc as never);
      auditLogService.log.mockResolvedValue(undefined);

      const result = await service.create(TENANT_ID, dto, ACTOR_ID, 'HR_ADMIN');

      expect(branchesRepository.create).toHaveBeenCalledWith(
        new Types.ObjectId(TENANT_ID),
        dto,
      );
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_BRANCH' }),
      );
      expect(result).toEqual(branchDoc);
    });
  });

  describe('softDelete', () => {
    it('sets isActive=false and logs DEACTIVATE_BRANCH', async () => {
      const branchDoc = makeBranchDoc();
      const deactivated = makeBranchDoc({ isActive: false });
      branchesRepository.findById.mockResolvedValue(branchDoc as never);
      branchesRepository.setActive.mockResolvedValue(deactivated as never);
      auditLogService.log.mockResolvedValue(undefined);

      const result = await service.softDelete(TENANT_ID, BRANCH_ID, ACTOR_ID, 'COMPANY_OWNER');

      expect(branchesRepository.setActive).toHaveBeenCalledWith(
        BRANCH_ID,
        new Types.ObjectId(TENANT_ID),
        false,
      );
      expect(auditLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DEACTIVATE_BRANCH', after: { isActive: false } }),
      );
      expect(result).toEqual(deactivated);
    });

    it('throws NotFoundException when branch does not exist', async () => {
      branchesRepository.findById.mockResolvedValue(null);

      await expect(
        service.softDelete(TENANT_ID, BRANCH_ID, ACTOR_ID, 'COMPANY_OWNER'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOne', () => {
    it('returns branch when found', async () => {
      const branchDoc = makeBranchDoc();
      branchesRepository.findById.mockResolvedValue(branchDoc as never);

      const result = await service.getOne(TENANT_ID, BRANCH_ID);

      expect(result).toEqual(branchDoc);
    });

    it('throws NotFoundException when branch not found', async () => {
      branchesRepository.findById.mockResolvedValue(null);

      await expect(service.getOne(TENANT_ID, BRANCH_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('activate', () => {
    it('sets isActive=true', async () => {
      const branchDoc = makeBranchDoc({ isActive: false });
      const activated = makeBranchDoc({ isActive: true });
      branchesRepository.findById.mockResolvedValue(branchDoc as never);
      branchesRepository.setActive.mockResolvedValue(activated as never);
      auditLogService.log.mockResolvedValue(undefined);

      const result = await service.activate(TENANT_ID, BRANCH_ID, ACTOR_ID, 'HR_ADMIN');

      expect(branchesRepository.setActive).toHaveBeenCalledWith(
        BRANCH_ID,
        new Types.ObjectId(TENANT_ID),
        true,
      );
      expect(result).toEqual(activated);
    });
  });
});
