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
exports.OutsideWorkService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const outside_work_repository_1 = require("./outside-work.repository");
const attendance_repository_1 = require("../attendance/attendance.repository");
const employees_repository_1 = require("../employees/employees.repository");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const users_repository_1 = require("../users/users.repository");
const MAX_LIMIT = 100;
let OutsideWorkService = class OutsideWorkService {
    outsideWorkRepository;
    attendanceRepository;
    employeesRepository;
    notificationsService;
    notificationsGateway;
    usersRepository;
    constructor(outsideWorkRepository, attendanceRepository, employeesRepository, notificationsService, notificationsGateway, usersRepository) {
        this.outsideWorkRepository = outsideWorkRepository;
        this.attendanceRepository = attendanceRepository;
        this.employeesRepository = employeesRepository;
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
        this.usersRepository = usersRepository;
    }
    async request(tenantId, userId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const location = dto.lat !== undefined && dto.lng !== undefined
            ? { type: 'Point', coordinates: [dto.lng, dto.lat] }
            : undefined;
        const outsideWork = await this.outsideWorkRepository.create({
            tenantId: tenantObjectId,
            employeeId: employee._id,
            outsideType: dto.outsideType,
            reason: dto.reason,
            locationName: dto.locationName,
            location,
            gpsAccuracy: dto.gpsAccuracy,
            photoUrls: dto.photoUrls ?? [],
            attendanceLogId: dto.attendanceLogId ? new mongoose_1.Types.ObjectId(dto.attendanceLogId) : undefined,
        });
        const outsideWorkId = outsideWork._id.toString();
        const employeeName = `${employee.firstName} ${employee.lastName}`;
        await this.notifyManagersOnNewRequest(tenantObjectId, employee, employeeName, outsideWorkId);
        return outsideWork;
    }
    async getMy(tenantId, userId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const { items, total } = await this.outsideWorkRepository.findByEmployee(tenantObjectId, employee._id, page, limit);
        return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getPending(tenantId) {
        const docs = await this.outsideWorkRepository.findPending(new mongoose_1.Types.ObjectId(tenantId));
        return docs.map((doc) => this.toResponse(doc));
    }
    async getOne(tenantId, id) {
        const item = await this.outsideWorkRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!item)
            throw new common_1.NotFoundException('Outside work request not found');
        return item;
    }
    async approve(tenantId, id, actorId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const item = await this.outsideWorkRepository.findById(id, tenantObjectId);
        if (!item)
            throw new common_1.NotFoundException('Outside work request not found');
        if (item.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updated = await this.outsideWorkRepository.update(id, tenantObjectId, {
            status: 'APPROVED',
            approvedBy: new mongoose_1.Types.ObjectId(actorId),
            approvedAt: new Date(),
        });
        if (item.attendanceLogId) {
            await this.attendanceRepository.updateStatus(item.attendanceLogId.toString(), 'OUTSIDE_APPROVED');
        }
        await this.notifyEmployee(item.employeeId, tenantObjectId, {
            title: 'ຄຳຮ້ອງອອກວຽກນອກໄດ້ຮັບການອະນຸມັດ',
            body: dto.comment ? `ໝາຍເຫດ: ${dto.comment}` : 'ຄຳຮ້ອງຂອງທ່ານໄດ້ຮັບການອະນຸມັດແລ້ວ',
            type: 'OUTSIDE_WORK_APPROVED',
            data: { outsideWorkId: id },
        });
        await this.emitStatusChangedToEmployee(item.employeeId, tenantObjectId, {
            outsideWorkId: id,
            status: 'APPROVED',
            approverName: actorId,
            comment: dto.comment,
        });
        return updated;
    }
    async reject(tenantId, id, actorId, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const item = await this.outsideWorkRepository.findById(id, tenantObjectId);
        if (!item)
            throw new common_1.NotFoundException('Outside work request not found');
        if (item.status !== 'PENDING')
            throw new common_1.BadRequestException('Request is not pending');
        const updated = await this.outsideWorkRepository.update(id, tenantObjectId, {
            status: 'REJECTED',
            rejectedBy: new mongoose_1.Types.ObjectId(actorId),
            rejectedAt: new Date(),
            rejectReason: dto.reason,
        });
        await this.notifyEmployee(item.employeeId, tenantObjectId, {
            title: 'ຄຳຮ້ອງອອກວຽກນອກຖືກປະຕິເສດ',
            body: dto.reason ?? 'ຄຳຮ້ອງຂອງທ່ານຖືກປະຕິເສດ',
            type: 'OUTSIDE_WORK_REJECTED',
            data: { outsideWorkId: id },
        });
        await this.emitStatusChangedToEmployee(item.employeeId, tenantObjectId, {
            outsideWorkId: id,
            status: 'REJECTED',
            reason: dto.reason,
        });
        return updated;
    }
    async getReport(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const page = Math.max(1, parseInt(query.page ?? '1', 10));
        const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.startDate || query.endDate) {
            filter.createdAt = {};
            if (query.startDate)
                filter.createdAt.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.createdAt.$lte = new Date(query.endDate);
        }
        const { items, total } = await this.outsideWorkRepository.findReport(tenantObjectId, filter, page, limit);
        return { data: items.map((doc) => this.toResponse(doc)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async notifyManagersOnNewRequest(tenantId, employee, employeeName, outsideWorkId) {
        const notifyPayload = {
            type: 'OUTSIDE_WORK_REQUEST',
            message: `ພະນັກງານ ${employeeName} ຂໍອອກນອກສະຖານທີ່`,
            outsideWorkId,
        };
        const managers = await this.usersRepository.findByRolesAndTenant(tenantId, [
            'HR_ADMIN',
            'COMPANY_OWNER',
        ]);
        for (const manager of managers) {
            this.notificationsGateway.sendToUser(manager._id.toString(), 'notification:new', notifyPayload);
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
            this.notificationsGateway.sendToUser(employee.userId.toString(), 'outside-work:status_changed', payload);
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
        return obj;
    }
    async findEmployeeByUserId(userId, tenantId) {
        const { employees } = await this.employeesRepository.findPaginated({ tenantId, userId: new mongoose_1.Types.ObjectId(userId) }, 1, 1, '-createdAt');
        if (!employees[0])
            throw new common_1.NotFoundException('Employee profile not found');
        return employees[0];
    }
};
exports.OutsideWorkService = OutsideWorkService;
exports.OutsideWorkService = OutsideWorkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [outside_work_repository_1.OutsideWorkRepository,
        attendance_repository_1.AttendanceRepository,
        employees_repository_1.EmployeesRepository,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway,
        users_repository_1.UsersRepository])
], OutsideWorkService);
//# sourceMappingURL=outside-work.service.js.map