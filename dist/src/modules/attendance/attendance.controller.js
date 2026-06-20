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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const check_in_dto_1 = require("./dto/check-in.dto");
const check_out_dto_1 = require("./dto/check-out.dto");
const adjust_attendance_dto_1 = require("./dto/adjust-attendance.dto");
const attendance_query_dto_1 = require("./dto/attendance-query.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkIn(dto, user) {
        const result = await this.attendanceService.checkIn(user.companyId, user.sub, dto);
        return { data: result };
    }
    async checkOut(dto, user) {
        const result = await this.attendanceService.checkOut(user.companyId, user.sub, dto);
        return { data: result };
    }
    async getMyToday(user) {
        const logs = await this.attendanceService.getMyToday(user.companyId, user.sub);
        return { data: logs };
    }
    async getMyHistory(query, user) {
        return this.attendanceService.getMyHistory(user.companyId, user.sub, query);
    }
    async getDailyReport(query, user) {
        const logs = await this.attendanceService.getDailyReport(user.companyId, scopeQuery(user, query));
        return { data: logs };
    }
    async getMonthlyReport(query, user) {
        const logs = await this.attendanceService.getMonthlyReport(user.companyId, scopeQuery(user, query));
        return { data: logs };
    }
    async getLateReport(query, user) {
        const logs = await this.attendanceService.getLateReport(user.companyId, query);
        return { data: logs };
    }
    async getAbsentReport(query, user) {
        const logs = await this.attendanceService.getAbsentReport(user.companyId, query);
        return { data: logs };
    }
    async getSummary(dateStr, user) {
        const date = dateStr ? new Date(dateStr) : new Date();
        const data = await this.attendanceService.getSummary(user.companyId, date, branchScope(user));
        return { data };
    }
    async getNotCheckedIn(query, user) {
        const data = await this.attendanceService.getNotCheckedInReport(user.companyId, scopeQuery(user, query));
        return { data };
    }
    async getEmployeeMonthlyReport(employeeId, query, user) {
        const year = parseInt(query.year, 10);
        const month = parseInt(query.month, 10);
        const data = await this.attendanceService.getEmployeeMonthlyReport(user.companyId, employeeId, year, month, branchScope(user));
        return { data };
    }
    async getOne(id, user) {
        const log = await this.attendanceService.getOne(user.companyId, id, branchScope(user));
        return { data: log };
    }
    async adjust(id, dto, user) {
        const log = await this.attendanceService.manualAdjust(user.companyId, id, user.sub, dto);
        return { data: log };
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_in_dto_1.CheckInDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_out_dto_1.CheckOutDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('my-today'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyToday", null);
__decorate([
    (0, common_1.Get)('my-history'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceHistoryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyHistory", null);
__decorate([
    (0, common_1.Get)('report/daily'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDailyReport", null);
__decorate([
    (0, common_1.Get)('report/monthly'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMonthlyReport", null);
__decorate([
    (0, common_1.Get)('report/late'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getLateReport", null);
__decorate([
    (0, common_1.Get)('report/absent'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAbsentReport", null);
__decorate([
    (0, common_1.Get)('report/summary'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('report/not-checked-in'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_query_dto_1.AttendanceReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getNotCheckedIn", null);
__decorate([
    (0, common_1.Get)('report/employee/:employeeId/monthly'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_query_dto_1.EmployeeMonthlyReportQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getEmployeeMonthlyReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN', 'BRANCH_MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id/adjust'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, adjust_attendance_dto_1.AdjustAttendanceDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "adjust", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
function branchScope(user) {
    if (user.role !== 'BRANCH_MANAGER')
        return undefined;
    if (!user.branchId)
        throw new common_1.ForbiddenException('Branch assignment is required');
    return user.branchId;
}
function scopeQuery(user, query) {
    const branchId = branchScope(user);
    return branchId ? { ...query, branchId } : query;
}
//# sourceMappingURL=attendance.controller.js.map