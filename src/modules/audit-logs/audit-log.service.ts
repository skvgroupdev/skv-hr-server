import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface AuditLogEntry {
  tenantId?: Types.ObjectId | string | null;
  actorId: Types.ObjectId | string;
  actorRole: string;
  action: string;
  module?: string;
  targetId?: Types.ObjectId | string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.auditLogModel.create({
      tenantId: entry.tenantId ? new Types.ObjectId(entry.tenantId.toString()) : null,
      actorId: new Types.ObjectId(entry.actorId.toString()),
      actorRole: entry.actorRole,
      action: entry.action,
      module: entry.module,
      targetId: entry.targetId ? new Types.ObjectId(entry.targetId.toString()) : null,
      before: entry.before ?? null,
      after: entry.after ?? null,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
    });
  }
}
