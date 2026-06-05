import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { DepartmentsRepository } from './departments.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentQueryDto } from './dto/department-query.dto';

const MAX_LIMIT = 100;

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(tenantId: string, dto: CreateDepartmentDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const department = await this.departmentsRepository.create(tenantObjectId, dto);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'CREATE_DEPARTMENT',
      module: 'departments',
      targetId: department._id as Types.ObjectId,
      after: { name: department.name },
    });

    return department;
  }

  async list(tenantId: string, query: DepartmentQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const sort = query.sort ?? '-createdAt';

    const { departments, total } = await this.departmentsRepository.findPaginated(
      tenantObjectId,
      page,
      limit,
      sort,
    );

    return {
      data: departments,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(tenantId: string, id: string) {
    const department = await this.departmentsRepository.findById(id, new Types.ObjectId(tenantId));
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(tenantId: string, id: string, dto: UpdateDepartmentDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.departmentsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Department not found');

    const updated = await this.departmentsRepository.update(id, tenantObjectId, dto);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'UPDATE_DEPARTMENT',
      module: 'departments',
      targetId: new Types.ObjectId(id),
      before: { name: existing.name },
      after: dto as unknown as Record<string, unknown>,
    });

    return updated;
  }

  async softDelete(tenantId: string, id: string, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.departmentsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Department not found');

    return this.departmentsRepository.softDelete(id, tenantObjectId);
  }
}
