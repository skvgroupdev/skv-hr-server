import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PositionsRepository } from './positions.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionQueryDto } from './dto/position-query.dto';

const MAX_LIMIT = 100;

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(tenantId: string, dto: CreatePositionDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const position = await this.positionsRepository.create(tenantObjectId, dto);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'CREATE_POSITION',
      module: 'positions',
      targetId: position._id as Types.ObjectId,
      after: { name: position.name, level: position.level },
    });

    return position;
  }

  async list(tenantId: string, query: PositionQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const sort = query.sort ?? '-createdAt';

    const { positions, total } = await this.positionsRepository.findPaginated(
      tenantObjectId,
      page,
      limit,
      sort,
    );

    return {
      data: positions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(tenantId: string, id: string) {
    const position = await this.positionsRepository.findById(id, new Types.ObjectId(tenantId));
    if (!position) throw new NotFoundException('Position not found');
    return position;
  }

  async update(tenantId: string, id: string, dto: UpdatePositionDto, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.positionsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Position not found');

    const updated = await this.positionsRepository.update(id, tenantObjectId, dto);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId,
      actorRole,
      action: 'UPDATE_POSITION',
      module: 'positions',
      targetId: new Types.ObjectId(id),
      before: { name: existing.name },
      after: dto as unknown as Record<string, unknown>,
    });

    return updated;
  }

  async softDelete(tenantId: string, id: string, actorId: string, actorRole: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.positionsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Position not found');

    return this.positionsRepository.softDelete(id, tenantObjectId);
  }
}
