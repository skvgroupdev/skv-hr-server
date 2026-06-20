"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const positions_repository_1 = require("./positions.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const MAX_LIMIT = 100;
let PositionsService = class PositionsService {
    positionsRepository;
    auditLogService;
    constructor(positionsRepository, auditLogService) {
        this.positionsRepository = positionsRepository;
        this.auditLogService = auditLogService;
    }
    async create(tenantId, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const position = await this.positionsRepository.create(tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'CREATE_POSITION',
            module: 'positions',
            targetId: position._id,
            after: { name: position.name, level: position.level },
        });
        return position;
    }
    async list(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const sort = query.sort ?? '-createdAt';
        const { positions, total } = await this.positionsRepository.findPaginated(tenantObjectId, page, limit, sort);
        return {
            data: positions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOne(tenantId, id) {
        const position = await this.positionsRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!position)
            throw new common_1.NotFoundException('Position not found');
        return position;
    }
    async update(tenantId, id, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.positionsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Position not found');
        const updated = await this.positionsRepository.update(id, tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'UPDATE_POSITION',
            module: 'positions',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { name: existing.name },
            after: dto,
        });
        return updated;
    }
    async softDelete(tenantId, id, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.positionsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Position not found');
        return this.positionsRepository.softDelete(id, tenantObjectId);
    }
};
exports.PositionsService = PositionsService;
exports.PositionsService = PositionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [positions_repository_1.PositionsRepository,
        audit_log_service_1.AuditLogService])
], PositionsService);
//# sourceMappingURL=positions.service.js.map