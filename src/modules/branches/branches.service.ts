import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { BranchesRepository } from './branches.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';
import { EmployeesRepository } from '../employees/employees.repository';
import { UsersRepository } from '../users/users.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { PlansRepository } from '../plans/plans.repository';

const MAX_LIMIT = 100;

@Injectable()
export class BranchesService {
  constructor(
    private readonly branchesRepository: BranchesRepository,
    private readonly auditLogService: AuditLogService,
    private readonly employeesRepository: EmployeesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly plansRepository: PlansRepository,
  ) {}

  async create(
    tenantId: string,
    dto: CreateBranchDto,
    actorId: string,
    actorRole: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);

    const company = await this.companiesRepository.findById(tenantId);
    if (!company?.planId) {
      throw new ForbiddenException('Company package is required');
    }
    const plan = await this.plansRepository.findById(company.planId.toString());
    if (!plan?.isActive) {
      throw new ForbiddenException('Company package is not active');
    }
    const activeBranchCount =
      await this.branchesRepository.countByTenant(tenantObjectId);
    if (activeBranchCount >= plan.maxBranches) {
      throw new ForbiddenException('ຮອດຂີດຈຳກັດສາຂາຂອງ package');
    }

    const branch = await this.branchesRepository.create(tenantObjectId, dto);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'CREATE_BRANCH',
      module: 'branches',
      targetId: branch._id as Types.ObjectId,
      after: { name: branch.name },
    });

    return branch;
  }

  async list(tenantId: string, query: BranchQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const sort = query.sort ?? '-createdAt';
    const filter =
      query.isActive !== undefined ? { isActive: query.isActive } : {};

    const { branches, total } = await this.branchesRepository.findPaginated(
      tenantObjectId,
      page,
      limit,
      sort,
      filter,
    );

    return {
      data: branches,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(tenantId: string, id: string) {
    const branch = await this.branchesRepository.findById(
      id,
      new Types.ObjectId(tenantId),
    );
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateBranchDto,
    actorId: string,
    actorRole: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.update(
      id,
      tenantObjectId,
      dto,
    );

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'UPDATE_BRANCH',
      module: 'branches',
      targetId: new Types.ObjectId(id),
      before: { name: existing.name },
      after: dto as unknown as Record<string, unknown>,
    });

    return updated;
  }

  async softDelete(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(
      id,
      tenantObjectId,
      false,
    );

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'DEACTIVATE_BRANCH',
      module: 'branches',
      targetId: new Types.ObjectId(id),
      before: { isActive: true },
      after: { isActive: false },
    });

    return updated;
  }

  async activate(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(
      id,
      tenantObjectId,
      true,
    );

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'ACTIVATE_BRANCH',
      module: 'branches',
      targetId: new Types.ObjectId(id),
      before: { isActive: false },
      after: { isActive: true },
    });

    return updated;
  }

  async deactivate(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole: string,
  ) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(
      id,
      tenantObjectId,
      false,
    );

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'DEACTIVATE_BRANCH',
      module: 'branches',
      targetId: new Types.ObjectId(id),
      before: { isActive: true },
      after: { isActive: false },
    });

    return updated;
  }

  async assignManager(
    tenantId: string,
    branchId: string,
    employeeId: string,
    actorId: string,
    actorRole: string,
  ) {
    if (
      !Types.ObjectId.isValid(branchId) ||
      !Types.ObjectId.isValid(employeeId)
    ) {
      throw new BadRequestException('Invalid branch or employee id');
    }
    const tenantObjectId = new Types.ObjectId(tenantId);
    const [branch, employee] = await Promise.all([
      this.branchesRepository.findById(branchId, tenantObjectId),
      this.employeesRepository.findById(employeeId, tenantObjectId),
    ]);
    if (!branch) throw new NotFoundException('Branch not found');
    if (!employee) throw new NotFoundException('Employee not found');
    if (!employee.userId)
      throw new BadRequestException('Employee has no linked user account');

    await this.usersRepository.updateRoleAndBranch(
      employee.userId.toString(),
      tenantObjectId,
      'BRANCH_MANAGER',
      branch._id as Types.ObjectId,
    );
    if (normalizeId(employee.branchId) !== branchId) {
      await this.employeesRepository.update(employeeId, tenantObjectId, {
        branchId,
      });
    }
    const updated = await this.branchesRepository.update(
      branchId,
      tenantObjectId,
      {
        managerId: employee.userId.toString(),
      },
    );
    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'ASSIGN_BRANCH_MANAGER',
      module: 'branches',
      targetId: branch._id as Types.ObjectId,
      after: { employeeId, userId: employee.userId.toString() },
    });
    return updated;
  }
}

function normalizeId(value: unknown): string | null {
  if (!value) return null;
  if (
    typeof value === 'object' &&
    '_id' in (value as Record<string, unknown>)
  ) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}
