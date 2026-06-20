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
exports.OTService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const ot_repository_1 = require("./ot.repository");
const employees_repository_1 = require("../employees/employees.repository");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const users_repository_1 = require("../users/users.repository");
const MAX_LIMIT = 100;
let OTService = class OTService {
    otRepository;
    employeesRepository;
    notificationsGateway;
    usersRepository;
    constructor(otRepository, employeesRepository, notificationsGateway, usersRepository) {
        this.otRepository = otRepository;
        this.employeesRepository = employeesRepository;
        this.notificationsGateway = notificationsGateway;
        this.usersRepository = usersRepository;
    }
    async getPolicy(tenantId) {
        const policy = await this.otRepository.getPolicy(new mongoose_1.Types.ObjectId(tenantId));
        if (!policy) {
            return { weekdayRate: 1.5, weekendRate: 2.0, holidayRate: 3.0, maxOtHoursPerDay: 4, minOtMinutes: 30, requirePreApproval: true };
        }
        return policy;
    }
    async updatePolicy(tenantId, dto) {
        return this.otRepository.upsertPolicy(new mongoose_1.Types.ObjectId(tenantId), dto);
    }
    async request(tenantId, userId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const policy = await this.getPolicy(tenantId);
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (endTime <= startTime)
            throw new common_1.BadRequestException('endTime must be after startTime');
        const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        const maxHours = policy.maxOtHoursPerDay ?? 4;
        if (totalHours > maxHours) {
            throw new common_1.BadRequestException(`OT cannot exceed ${maxHours} hours per day`);
        }
        const otRequest = await this.otRepository.createRequest({
            tenantId: tenantObjectId,
            employeeId: employee._id,
            date: new Date(dto.date),
            startTime,
            endTime,
            totalHours,
            reason: dto.reason,
        });
        const otRequestId = otRequest._id.toString();
        const employeeName = `${employee.firstName} ${employee.lastName}`;
        await this.notifyManagersOnNewOTRequest(tenantObjectId, employee, employeeName, otRequestId);
        return otRequest;
    }
    async getMy(tenantId, userId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const { items, total } = await this.otRepository.findByEmployee(tenantObjectId, employee._id, page, limit);
        return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getPending(tenantId) {
        return this.otRepository.findPending(new mongoose_1.Types.ObjectId(tenantId));
    }
    async getOne(tenantId, id) {
        const request = await this.otRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!request)
            throw new common_1.NotFoundException('OT request not found');
        return request;
    }
    async approve(tenantId, id, actorId, actorRole, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.otRepository.findById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('OT request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updated = await this.otRepository.updateRequest(id, tenantObjectId, {
            status: 'APPROVED',
            approvalFlow: [
                ...request.approvalFlow,
                { approverId: new mongoose_1.Types.ObjectId(actorId), role: actorRole, status: 'APPROVED', comment: dto.comment, approvedAt: new Date() },
            ],
        });
        await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
            otRequestId: id,
            status: 'APPROVED',
            comment: dto.comment,
        });
        return updated;
    }
    async reject(tenantId, id, actorId, actorRole, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.otRepository.findById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('OT request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updated = await this.otRepository.updateRequest(id, tenantObjectId, {
            status: 'REJECTED',
            approvalFlow: [
                ...request.approvalFlow,
                { approverId: new mongoose_1.Types.ObjectId(actorId), role: actorRole, status: 'REJECTED', comment: dto.reason, approvedAt: new Date() },
            ],
        });
        await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
            otRequestId: id,
            status: 'REJECTED',
            reason: dto.reason,
        });
        return updated;
    }
    async cancel(tenantId, id, userId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.otRepository.findById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('OT request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Only pending requests can be cancelled');
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        if (request.employeeId.toString() !== employee._id.toString()) {
            throw new common_1.ForbiddenException('You can only cancel your own OT requests');
        }
        return this.otRepository.updateRequest(id, tenantObjectId, { status: 'CANCELLED' });
    }
    async getReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const filter = {};
        if (query.startDate || query.endDate) {
            filter.date = {};
            if (query.startDate)
                filter.date.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.date.$lte = new Date(query.endDate);
        }
        const { items, total } = await this.otRepository.findReport(tenantObjectId, filter, page, limit);
        return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async notifyManagersOnNewOTRequest(tenantId, employee, employeeName, otRequestId) {
        const payload = { type: 'OT_REQUEST', message: `ພະນັກງານ ${employeeName} ຂໍໂອທີ`, otRequestId };
        const managers = await this.usersRepository.findByRolesAndTenant(tenantId, [
            'HR_ADMIN',
            'COMPANY_OWNER',
        ]);
        for (const manager of managers) {
            this.notificationsGateway.sendToUser(manager._id.toString(), 'notification:new', payload);
        }
        if (employee.branchId) {
            await this.notifyBranchManager(tenantId, employee.branchId, payload);
        }
        if (employee.supervisorId) {
            const supervisor = await this.employeesRepository.findById(employee.supervisorId.toString(), tenantId);
            if (supervisor?.userId) {
                this.notificationsGateway.sendToUser(supervisor.userId.toString(), 'notification:new', payload);
            }
        }
    }
    async notifyBranchManager(tenantId, branchId, payload) {
        const branchManagers = await this.usersRepository.findByRolesAndTenant(tenantId, ['BRANCH_MANAGER']);
        for (const user of branchManagers) {
            const userBranchId = user.branchId;
            if (userBranchId && userBranchId.toString() === branchId.toString()) {
                this.notificationsGateway.sendToUser(user._id.toString(), 'notification:new', payload);
            }
        }
    }
    async emitStatusChangedToEmployee(employeeId, tenantId, payload) {
        const employee = await this.employeesRepository.findById(employeeId.toString(), tenantId);
        if (employee?.userId) {
            this.notificationsGateway.sendToUser(employee.userId.toString(), 'ot:status_changed', payload);
        }
    }
    async findEmployeeByUserId(userId, tenantId) {
        const { employees } = await this.employeesRepository.findPaginated({ tenantId, userId: new mongoose_1.Types.ObjectId(userId) }, 1, 1, '-createdAt');
        if (!employees[0])
            throw new common_1.NotFoundException('Employee profile not found');
        return employees[0];
    }
};
exports.OTService = OTService;
exports.OTService = OTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ot_repository_1.OTRepository,
        employees_repository_1.EmployeesRepository,
        notifications_gateway_1.NotificationsGateway,
        users_repository_1.UsersRepository])
], OTService);
//# sourceMappingURL=ot.service.js.map