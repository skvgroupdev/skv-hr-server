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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const leave_repository_1 = require("./leave.repository");
const employees_repository_1 = require("../employees/employees.repository");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const users_repository_1 = require("../users/users.repository");
const MAX_LIMIT = 100;
function countLeaveDays(startDate, endDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
}
let LeaveService = class LeaveService {
    leaveRepository;
    employeesRepository;
    notificationsService;
    notificationsGateway;
    usersRepository;
    constructor(leaveRepository, employeesRepository, notificationsService, notificationsGateway, usersRepository) {
        this.leaveRepository = leaveRepository;
        this.employeesRepository = employeesRepository;
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
        this.usersRepository = usersRepository;
    }
    async createLeaveType(tenantId, dto) {
        return this.leaveRepository.createLeaveType({
            tenantId: new mongoose_1.Types.ObjectId(tenantId),
            ...dto,
            defaultDaysPerYear: dto.defaultDaysPerYear ?? 0,
        });
    }
    async findAllLeaveTypes(tenantId) {
        return this.leaveRepository.findAllLeaveTypes(new mongoose_1.Types.ObjectId(tenantId));
    }
    async updateLeaveType(tenantId, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.leaveRepository.findLeaveTypeById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Leave type not found');
        return this.leaveRepository.updateLeaveType(id, tenantObjectId, dto);
    }
    async deleteLeaveType(tenantId, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.leaveRepository.findLeaveTypeById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Leave type not found');
        return this.leaveRepository.softDeleteLeaveType(id, tenantObjectId);
    }
    async request(tenantId, userId, dto) {
        if (!dto.leaveTypeId && !dto.leaveTypeName) {
            throw new common_1.BadRequestException('Either leaveTypeId or leaveTypeName is required');
        }
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (endDate < startDate)
            throw new common_1.BadRequestException('End date must be after start date');
        const overlapping = await this.leaveRepository.findOverlapping(tenantObjectId, employee._id, startDate, endDate);
        if (overlapping)
            throw new common_1.ConflictException('Leave request overlaps with existing request');
        const totalDays = dto.isHalfDay ? 0.5 : countLeaveDays(startDate, endDate);
        const leaveRequest = await this.leaveRepository.createRequest({
            tenantId: tenantObjectId,
            employeeId: employee._id,
            ...(dto.leaveTypeId && { leaveTypeId: new mongoose_1.Types.ObjectId(dto.leaveTypeId) }),
            leaveTypeName: dto.leaveTypeName,
            startDate,
            endDate,
            totalDays,
            isHalfDay: dto.isHalfDay ?? false,
            halfDayPeriod: dto.halfDayPeriod,
            reason: dto.reason,
            attachmentUrls: dto.attachmentUrls ?? [],
        });
        const leaveRequestId = leaveRequest._id.toString();
        const employeeName = `${employee.firstName} ${employee.lastName}`;
        await this.notifyManagersOnNewRequest(tenantObjectId, employee, employeeName, leaveRequestId);
        return leaveRequest;
    }
    async getMy(tenantId, userId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const { items, total } = await this.leaveRepository.findRequestsByEmployee(tenantObjectId, employee._id, page, limit);
        return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getPending(tenantId) {
        const docs = await this.leaveRepository.findPendingRequests(new mongoose_1.Types.ObjectId(tenantId));
        return docs.map((doc) => this.toResponse(doc));
    }
    async getOne(tenantId, id) {
        const request = await this.leaveRepository.findRequestById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!request)
            throw new common_1.NotFoundException('Leave request not found');
        return request;
    }
    async approve(tenantId, id, actorId, actorRole, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('Leave request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updatedRequest = await this.leaveRepository.updateRequest(id, tenantObjectId, {
            status: 'APPROVED',
            approvals: [
                ...request.approvals,
                {
                    approverId: new mongoose_1.Types.ObjectId(actorId),
                    role: actorRole,
                    status: 'APPROVED',
                    comment: dto.comment,
                    approvedAt: new Date(),
                },
            ],
        });
        if (request.leaveTypeId) {
            await this.leaveRepository.upsertBalance(tenantObjectId, request.employeeId, request.leaveTypeId, new Date(request.startDate).getFullYear(), request.totalDays);
        }
        await this.notifyEmployee(request.employeeId, tenantObjectId, {
            title: 'ຄຳຮ້ອງລາພັກໄດ້ຮັບການອະນຸມັດ',
            body: dto.comment ? `ໝາຍເຫດ: ${dto.comment}` : 'ຄຳຮ້ອງລາພັກຂອງທ່ານໄດ້ຮັບການອະນຸມັດແລ້ວ',
            type: 'LEAVE_APPROVED',
            data: { leaveRequestId: id },
        });
        await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
            leaveRequestId: id,
            status: 'APPROVED',
            approverName: actorId,
            comment: dto.comment,
        });
        return updatedRequest;
    }
    async reject(tenantId, id, actorId, actorRole, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('Leave request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updatedRequest = await this.leaveRepository.updateRequest(id, tenantObjectId, {
            status: 'REJECTED',
            approvals: [
                ...request.approvals,
                {
                    approverId: new mongoose_1.Types.ObjectId(actorId),
                    role: actorRole,
                    status: 'REJECTED',
                    comment: dto.reason,
                    approvedAt: new Date(),
                },
            ],
        });
        await this.notifyEmployee(request.employeeId, tenantObjectId, {
            title: 'ຄຳຮ້ອງລາພັກຖືກປະຕິເສດ',
            body: dto.reason ?? 'ຄຳຮ້ອງລາພັກຂອງທ່ານຖືກປະຕິເສດ',
            type: 'LEAVE_REJECTED',
            data: { leaveRequestId: id },
        });
        await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
            leaveRequestId: id,
            status: 'REJECTED',
            reason: dto.reason,
        });
        return updatedRequest;
    }
    async cancel(tenantId, id, userId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
        if (!request)
            throw new common_1.NotFoundException('Leave request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Only pending requests can be cancelled');
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        if (request.employeeId.toString() !== employee._id.toString()) {
            throw new common_1.ForbiddenException('You can only cancel your own requests');
        }
        return this.leaveRepository.updateRequest(id, tenantObjectId, { status: 'CANCELLED' });
    }
    async getReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.leaveTypeId)
            filter.leaveTypeId = new mongoose_1.Types.ObjectId(query.leaveTypeId);
        if (query.startDate || query.endDate) {
            filter.startDate = {};
            if (query.startDate)
                filter.startDate.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.startDate.$lte = new Date(query.endDate);
        }
        const { items, total } = await this.leaveRepository.findReport(tenantObjectId, filter, page, limit);
        return { data: items.map((doc) => this.toResponse(doc)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getMyBalance(tenantId, userId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        return this.leaveRepository.findBalancesByEmployee(tenantObjectId, employee._id);
    }
    async getEmployeeBalance(tenantId, employeeId) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return this.leaveRepository.findBalancesByEmployee(tenantObjectId, employee._id);
    }
    async adjustBalance(tenantId, employeeId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const year = dto.year ?? new Date().getFullYear();
        return this.leaveRepository.adjustBalance(tenantObjectId, employee._id, new mongoose_1.Types.ObjectId(dto.leaveTypeId), year, dto.adjustment);
    }
    async notifyManagersOnNewRequest(tenantId, employee, employeeName, leaveRequestId) {
        const notifyPayload = {
            type: 'LEAVE_REQUEST',
            message: `ພະນັກງານ ${employeeName} ຂໍລາພັກ`,
            leaveRequestId,
        };
        const managers = await this.usersRepository.findByRolesAndTenant(tenantId, [
            'HR_ADMIN',
            'COMPANY_OWNER',
        ]);
        for (const manager of managers) {
            const managerId = manager._id.toString();
            this.notificationsGateway.sendToUser(managerId, 'notification:new', notifyPayload);
        }
        if (employee.branchId) {
            await this.notifyBranchManager(tenantId, employee.branchId, notifyPayload);
        }
        if (employee.supervisorId) {
            const supervisor = await this.employeesRepository.findById(employee.supervisorId.toString(), tenantId);
            if (supervisor?.userId) {
                this.notificationsGateway.sendToUser(supervisor.userId.toString(), 'notification:new', notifyPayload);
            }
        }
    }
    async notifyBranchManager(tenantId, branchId, payload) {
        const branchManagers = await this.usersRepository.findByRolesAndTenant(tenantId, [
            'BRANCH_MANAGER',
        ]);
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
            this.notificationsGateway.sendToUser(employee.userId.toString(), 'leave:status_changed', payload);
        }
    }
    async notifyEmployee(employeeId, tenantId, payload) {
        const employee = await this.employeesRepository.findById(employeeId.toString(), tenantId);
        if (!employee?.userId)
            return;
        await this.notificationsService.notify(employee.userId, {
            ...payload,
            tenantId,
        });
    }
    toResponse(doc) {
        const obj = doc.toJSON();
        const emp = obj.employeeId;
        if (emp && typeof emp === 'object') {
            obj.employee = {
                id: emp['id'],
                firstName: emp['firstName'],
                lastName: emp['lastName'],
                phone: emp['phone'],
                fullName: `${emp['firstName'] ?? ''} ${emp['lastName'] ?? ''}`.trim(),
            };
            obj.employeeId = String(emp['id'] ?? '');
        }
        const lt = obj.leaveTypeId;
        if (lt && typeof lt === 'object') {
            obj.leaveType = { id: lt['id'], name: lt['name'], code: lt['code'] };
            obj.leaveTypeId = String(lt['id'] ?? '');
        }
        else if (!lt && obj.leaveTypeName) {
            obj.leaveType = { id: null, name: obj.leaveTypeName, code: null };
        }
        return obj;
    }
    async findEmployeeByUserId(userId, tenantId) {
        const { employees } = await this.employeesRepository.findPaginated({ tenantId, userId: new mongoose_1.Types.ObjectId(userId) }, 1, 1, '-createdAt');
        if (!employees[0])
            throw new common_1.NotFoundException('Employee profile not found');
        return employees[0];
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leave_repository_1.LeaveRepository,
        employees_repository_1.EmployeesRepository,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway,
        users_repository_1.UsersRepository])
], LeaveService);
//# sourceMappingURL=leave.service.js.map