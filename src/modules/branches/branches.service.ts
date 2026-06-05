import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { BranchesRepository } from './branches.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';

const MAX_LIMIT = 100;

@Injectable()
export class BranchesService {
  constructor(
    private readonly branchesRepository: BranchesRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(tenantId: string, dto: CreateBranchDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);

    // TODO: Check subscription plan limit (plan.maxBranches) before creating
    // const activeBranchCount = await this.branchesRepository.countByTenant(tenantObjectId);
    // if (activeBranchCount >= plan.maxBranches) throw new ForbiddenException('ຮອດຂີດຈຳກັດສາຂາ');

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
    const filter = query.isActive !== undefined ? { isActive: query.isActive } : {};

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
    const branch = await this.branchesRepository.findById(id, new Types.ObjectId(tenantId));
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(tenantId: string, id: string, dto: UpdateBranchDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.update(id, tenantObjectId, dto);

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

  async softDelete(tenantId: string, id: string, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(id, tenantObjectId, false);

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

  async activate(tenantId: string, id: string, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(id, tenantObjectId, true);

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

  async deactivate(tenantId: string, id: string, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.branchesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Branch not found');

    const updated = await this.branchesRepository.setActive(id, tenantObjectId, false);

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
}
