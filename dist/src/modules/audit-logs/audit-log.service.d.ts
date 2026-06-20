import { Model, Types } from 'mongoose';
import { AuditLogDocument } from './schemas/audit-log.schema';
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
export declare class AuditLogService {
    private readonly auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    log(entry: AuditLogEntry): Promise<void>;
}
