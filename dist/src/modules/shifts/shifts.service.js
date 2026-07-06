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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const shifts_repository_1 = require("./shifts.repository");
const employees_repository_1 = require("../employees/employees.repository");
let ShiftsService = class ShiftsService {
    shiftsRepository;
    employeesRepository;
    constructor(shiftsRepository, employeesRepository) {
        this.shiftsRepository = shiftsRepository;
        this.employeesRepository = employeesRepository;
    }
    async create(tenantId, dto) {
        return this.shiftsRepository.create(new mongoose_1.Types.ObjectId(tenantId), dto);
    }
    async findAll(tenantId) {
        return this.shiftsRepository.findAll(new mongoose_1.Types.ObjectId(tenantId));
    }
    async findOne(tenantId, id) {
        const shift = await this.shiftsRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        return shift;
    }
    async update(tenantId, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.shiftsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Shift not found');
        return this.shiftsRepository.update(id, tenantObjectId, dto);
    }
    async softDelete(tenantId, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.shiftsRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Shift not found');
        return this.shiftsRepository.softDelete(id, tenantObjectId);
    }
    async assignToEmployee(tenantId, shiftId, dto) {
        this.assertObjectId(shiftId, 'shiftId');
        this.assertObjectId(dto.employeeId, 'employeeId');
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const shift = await this.shiftsRepository.findById(shiftId, tenantObjectId);
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        const employee = await this.employeesRepository.findById(dto.employeeId, tenantObjectId);
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const effectiveDate = new Date(dto.effectiveDate);
        const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
        if (endDate && endDate < effectiveDate) {
            throw new common_1.BadRequestException('endDate must be on or after effectiveDate');
        }
        const overlap = await this.shiftsRepository.findOverlappingAssignment(tenantObjectId, employee._id, effectiveDate, endDate);
        if (overlap) {
            const existingStart = new Date(overlap.effectiveDate);
            const isOpenEnded = !overlap.endDate;
            if (existingStart.getTime() === effectiveDate.getTime()) {
                return this.shiftsRepository.updateAssignment(overlap._id, tenantObjectId, new mongoose_1.Types.ObjectId(shiftId), effectiveDate, endDate);
            }
            if (!endDate && isOpenEnded && existingStart < effectiveDate) {
                const previousDay = new Date(effectiveDate);
                previousDay.setUTCDate(previousDay.getUTCDate() - 1);
                await this.shiftsRepository.closeAssignment(overlap._id, tenantObjectId, previousDay);
            }
            else {
                throw new common_1.BadRequestException('Shift assignment overlaps an existing assignment');
            }
        }
        return this.shiftsRepository.createAssignment(tenantObjectId, employee._id, new mongoose_1.Types.ObjectId(shiftId), effectiveDate, endDate);
    }
    async getEmployeeShift(currentUser, employeeId) {
        this.assertObjectId(employeeId, 'employeeId');
        const tenantId = currentUser.companyId;
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const target = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!target)
            throw new common_1.NotFoundException('Employee not found');
        if (currentUser.role === 'STAFF' &&
            target.userId?.toString() !== currentUser.sub) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (currentUser.role === 'BRANCH_MANAGER') {
            const targetBranchId = this.refId(target.branchId);
            if (!currentUser.branchId || targetBranchId !== currentUser.branchId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (currentUser.role === 'SUPERVISOR') {
            const actor = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantObjectId);
            const actorId = actor?._id?.toString();
            if (!actorId ||
                (target.managerId?.toString() !== actorId &&
                    target.supervisorId?.toString() !== actorId)) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        const assignment = await this.shiftsRepository.findCurrentAssignment(new mongoose_1.Types.ObjectId(employeeId), tenantObjectId);
        if (!assignment)
            throw new common_1.NotFoundException('No shift assignment found for this employee');
        return assignment;
    }
    async getEmployeeShiftHistory(currentUser, employeeId) {
        this.assertObjectId(employeeId, 'employeeId');
        const tenantId = currentUser.companyId;
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const target = await this.employeesRepository.findById(employeeId, tenantObjectId);
        if (!target)
            throw new common_1.NotFoundException('Employee not found');
        if (currentUser.role === 'STAFF' &&
            target.userId?.toString() !== currentUser.sub) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (currentUser.role === 'BRANCH_MANAGER') {
            const targetBranchId = this.refId(target.branchId);
            if (!currentUser.branchId || targetBranchId !== currentUser.branchId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (currentUser.role === 'SUPERVISOR') {
            const actor = await this.employeesRepository.findByUserIdAndTenant(new mongoose_1.Types.ObjectId(currentUser.sub), tenantObjectId);
            const actorId = actor?._id?.toString();
            if (!actorId ||
                (target.managerId?.toString() !== actorId &&
                    target.supervisorId?.toString() !== actorId)) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        return this.shiftsRepository.findAllAssignments(new mongoose_1.Types.ObjectId(employeeId), tenantObjectId);
    }
    async bulkAssignShift(user, dto) {
        const tenantId = user.companyId;
        const assignDto = {
            employeeId: '',
            effectiveDate: dto.effectiveDate,
            endDate: dto.endDate,
        };
        const success = [];
        const failed = [];
        for (const employeeId of dto.employeeIds) {
            try {
                assignDto.employeeId = employeeId;
                const assignment = await this.assignToEmployee(tenantId, dto.shiftId, { ...assignDto });
                success.push(assignment);
            }
            catch (err) {
                const reason = err instanceof Error ? err.message : 'Unknown error';
                failed.push({ employeeId, reason });
            }
        }
        return { success, failed };
    }
    assertObjectId(value, field) {
        if (!mongoose_1.Types.ObjectId.isValid(value))
            throw new common_1.BadRequestException(`${field} is invalid`);
    }
    refId(value) {
        if (!value)
            return null;
        if (typeof value === 'object' &&
            '_id' in value) {
            return String(value._id);
        }
        return String(value);
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shifts_repository_1.ShiftsRepository,
        employees_repository_1.EmployeesRepository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map