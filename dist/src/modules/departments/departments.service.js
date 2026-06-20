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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const departments_repository_1 = require("./departments.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
const MAX_LIMIT = 100;
let DepartmentsService = class DepartmentsService {
    departmentsRepository;
    auditLogService;
    constructor(departmentsRepository, auditLogService) {
        this.departmentsRepository = departmentsRepository;
        this.auditLogService = auditLogService;
    }
    async create(tenantId, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const department = await this.departmentsRepository.create(tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'CREATE_DEPARTMENT',
            module: 'departments',
            targetId: department._id,
            after: { name: department.name },
        });
        return department;
    }
    async list(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const sort = query.sort ?? '-createdAt';
        const { departments, total } = await this.departmentsRepository.findPaginated(tenantObjectId, page, limit, sort);
        return {
            data: departments,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOne(tenantId, id) {
        const department = await this.departmentsRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!department)
            throw new common_1.NotFoundException('Department not found');
        return department;
    }
    async update(tenantId, id, dto, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.departmentsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Department not found');
        const updated = await this.departmentsRepository.update(id, tenantObjectId, dto);
        await this.auditLogService.log({
            tenantId: tenantObjectId,
            actorId,
            actorRole,
            action: 'UPDATE_DEPARTMENT',
            module: 'departments',
            targetId: new mongoose_1.Types.ObjectId(id),
            before: { name: existing.name },
            after: dto,
        });
        return updated;
    }
    async softDelete(tenantId, id, actorId, actorRole) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.departmentsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Department not found');
        return this.departmentsRepository.softDelete(id, tenantObjectId);
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [departments_repository_1.DepartmentsRepository,
        audit_log_service_1.AuditLogService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map