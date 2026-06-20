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
exports.AttendanceAdjustmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const attendance_adjustments_repository_1 = require("./attendance-adjustments.repository");
const attendance_repository_1 = require("../attendance/attendance.repository");
const employees_repository_1 = require("../employees/employees.repository");
const audit_log_service_1 = require("../audit-logs/audit-log.service");
let AttendanceAdjustmentsService = class AttendanceAdjustmentsService {
    repository;
    attendanceRepository;
    employeesRepository;
    auditLogService;
    constructor(repository, attendanceRepository, employeesRepository, auditLogService) {
        this.repository = repository;
        this.attendanceRepository = attendanceRepository;
        this.employeesRepository = employeesRepository;
        this.auditLogService = auditLogService;
    }
    async create(currentUser, dto) {
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantId);
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        if (!employee.branchId) {
            throw new common_1.BadRequestException('Employee must be assigned to a branch');
        }
        const workDate = new Date(dto.workDate);
        const requestedCheckTime = new Date(dto.requestedCheckTime);
        if (dateKey(workDate) !== dateKey(requestedCheckTime)) {
            throw new common_1.BadRequestException('requestedCheckTime must be on workDate');
        }
        let originalCheckTime;
        let attendanceLogId;
        if (dto.attendanceLogId) {
            const log = await this.attendanceRepository.findById(dto.attendanceLogId, tenantId);
            if (!log ||
                log.employeeId.toString() !==
                    employee._id.toString()) {
                throw new common_1.NotFoundException('Attendance log not found');
            }
            if (log.type !== dto.type)
                throw new common_1.BadRequestException('Attendance type does not match');
            originalCheckTime = log.checkTime;
            attendanceLogId = log._id;
        }
        try {
            const request = await this.repository.create({
                tenantId,
                employeeId: employee._id,
                branchId: employee.branchId,
                attendanceLogId,
                type: dto.type,
                workDate,
                originalCheckTime,
                requestedCheckTime,
                reason: dto.reason,
                evidenceUrl: dto.evidenceUrl,
            });
            await this.auditLogService.log({
                tenantId,
                actorId: currentUser.sub,
                actorRole: currentUser.role,
                action: 'CREATE_ATTENDANCE_ADJUSTMENT_REQUEST',
                module: 'attendance-adjustments',
                targetId: request._id,
                after: {
                    type: dto.type,
                    workDate,
                    requestedCheckTime,
                    reason: dto.reason,
                },
            });
            return request;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException('A pending request already exists for this date and type');
            }
            throw error;
        }
    }
    async getMine(currentUser) {
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const employee = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantId);
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        return this.repository.findByEmployee(tenantId, employee._id);
    }
    async listForReviewer(currentUser, status) {
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        if (currentUser.role === 'BRANCH_MANAGER') {
            if (!currentUser.branchId)
                throw new common_1.ForbiddenException('Branch assignment is required');
            return this.repository.findAll(tenantId, new mongoose_1.Types.ObjectId(currentUser.branchId), status);
        }
        return this.repository.findAll(tenantId, undefined, status);
    }
    async cancel(currentUser, id) {
        const { tenantId, request } = await this.getOwnedPending(currentUser, id);
        return this.repository.update(id, tenantId, { status: 'CANCELLED' });
    }
    async approve(currentUser, id, comment) {
        const { tenantId, request } = await this.getReviewablePending(currentUser, id);
        const correction = await this.attendanceRepository.create({
            tenantId,
            employeeId: request.employeeId,
            branchId: request.branchId,
            type: request.type,
            checkTime: request.requestedCheckTime,
            serverTime: new Date(),
            status: 'MANUAL_ADJUSTED',
            adjustedBy: new mongoose_1.Types.ObjectId(currentUser.sub),
            adjustReason: request.reason,
            correctionFor: request.attendanceLogId,
        });
        const updated = await this.repository.update(id, tenantId, {
            status: 'APPROVED',
            correctionLogId: correction._id,
            reviewedBy: new mongoose_1.Types.ObjectId(currentUser.sub),
            reviewedAt: new Date(),
            reviewComment: comment,
        });
        await this.logReview(currentUser, request._id, 'APPROVED', comment);
        return updated;
    }
    async reject(currentUser, id, reason) {
        const { tenantId, request } = await this.getReviewablePending(currentUser, id);
        const updated = await this.repository.update(id, tenantId, {
            status: 'REJECTED',
            reviewedBy: new mongoose_1.Types.ObjectId(currentUser.sub),
            reviewedAt: new Date(),
            reviewComment: reason,
        });
        await this.logReview(currentUser, request._id, 'REJECTED', reason);
        return updated;
    }
    async getOwnedPending(currentUser, id) {
        this.assertId(id);
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const request = await this.repository.findById(id, tenantId);
        if (!request)
            throw new common_1.NotFoundException('Adjustment request not found');
        const employee = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantId);
        if (!employee ||
            request.employeeId.toString() !==
                employee._id.toString()) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        return { tenantId, request };
    }
    async getReviewablePending(currentUser, id) {
        this.assertId(id);
        if (currentUser.role !== 'BRANCH_MANAGER') {
            throw new common_1.ForbiddenException('Only branch managers can review requests');
        }
        if (!currentUser.branchId)
            throw new common_1.ForbiddenException('Branch assignment is required');
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const request = await this.repository.findById(id, tenantId);
        if (!request || request.branchId.toString() !== currentUser.branchId) {
            throw new common_1.NotFoundException('Adjustment request not found');
        }
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        return { tenantId, request };
    }
    async logReview(user, targetId, status, comment) {
        await this.auditLogService.log({
            tenantId: new mongoose_1.Types.ObjectId(user.companyId),
            actorId: user.sub,
            actorRole: user.role,
            action: `${status}_ATTENDANCE_ADJUSTMENT_REQUEST`,
            module: 'attendance-adjustments',
            targetId,
            after: { status, comment },
        });
    }
    assertId(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('id is invalid');
    }
};
exports.AttendanceAdjustmentsService = AttendanceAdjustmentsService;
exports.AttendanceAdjustmentsService = AttendanceAdjustmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_adjustments_repository_1.AttendanceAdjustmentsRepository,
        attendance_repository_1.AttendanceRepository,
        employees_repository_1.EmployeesRepository,
        audit_log_service_1.AuditLogService])
], AttendanceAdjustmentsService);
function dateKey(date) {
    return new Date(date.getTime() + 7 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
}
//# sourceMappingURL=attendance-adjustments.service.js.map