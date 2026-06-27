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
exports.DashboardRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_schema_1 = require("../employees/schemas/employee.schema");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const attendance_repository_1 = require("../attendance/attendance.repository");
const leave_repository_1 = require("../leave/leave.repository");
const ot_repository_1 = require("../ot/ot.repository");
const outside_work_repository_1 = require("../outside-work/outside-work.repository");
const attendance_adjustments_repository_1 = require("../attendance-adjustments/attendance-adjustments.repository");
let DashboardRepository = class DashboardRepository {
    employeeModel;
    branchModel;
    attendanceRepository;
    leaveRepository;
    otRepository;
    outsideWorkRepository;
    adjustmentsRepository;
    constructor(employeeModel, branchModel, attendanceRepository, leaveRepository, otRepository, outsideWorkRepository, adjustmentsRepository) {
        this.employeeModel = employeeModel;
        this.branchModel = branchModel;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.otRepository = otRepository;
        this.outsideWorkRepository = outsideWorkRepository;
        this.adjustmentsRepository = adjustmentsRepository;
    }
    async countEmployees(tenantId) {
        const base = { tenantId, isDeleted: { $ne: true } };
        const [total, active, inactive] = await Promise.all([
            this.employeeModel.countDocuments(base).exec(),
            this.employeeModel.countDocuments({ ...base, status: 'ACTIVE' }).exec(),
            this.employeeModel.countDocuments({ ...base, status: 'INACTIVE' }).exec(),
        ]);
        return { total, active, inactive };
    }
    async countTodayCheckIns(tenantId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const logs = await this.attendanceRepository.findByType(tenantId, 'CHECK_IN', startOfDay, endOfDay);
        return logs.length;
    }
    async countPendingRequests(tenantId) {
        const [leaveList, otList, outsideList] = await Promise.all([
            this.leaveRepository.findPendingRequests(tenantId),
            this.otRepository.findPending(tenantId),
            this.outsideWorkRepository.findPending(tenantId),
        ]);
        return { leave: leaveList.length, ot: otList.length, outsideWork: outsideList.length };
    }
    async countBranches(tenantId) {
        const [total, active] = await Promise.all([
            this.branchModel.countDocuments({ tenantId }).exec(),
            this.branchModel.countDocuments({ tenantId, isActive: true }).exec(),
        ]);
        return { total, active };
    }
    async findRecentEmployees(tenantId, limit = 5) {
        const docs = await this.employeeModel
            .find({ tenantId, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('firstName lastName employeeCode status branchId positionId createdAt')
            .populate('branchId', 'name')
            .populate('positionId', 'name')
            .lean()
            .exec();
        return docs.map((doc) => {
            const branch = doc.branchId;
            const position = doc.positionId;
            return {
                id: doc._id.toString(),
                firstName: doc.firstName,
                lastName: doc.lastName,
                employeeCode: doc.employeeCode,
                status: doc.status ?? 'ACTIVE',
                branch: branch?.name ?? '-',
                position: position?.name ?? '-',
                createdAt: doc.createdAt,
            };
        });
    }
    async getTodayOverview(tenantId, date) {
        const [leaveRequests, outsideWorkRequests, adjustmentRequests] = await Promise.all([
            this.leaveRepository.findTodayActive(tenantId, date),
            this.outsideWorkRepository.findTodayActive(tenantId, date),
            this.adjustmentsRepository.findTodayActive(tenantId, date),
        ]);
        const mapEmployee = (emp) => {
            const e = emp;
            if (!e)
                return null;
            return {
                id: e.id ?? e._id?.toString() ?? '',
                firstName: e.firstName ?? '',
                lastName: e.lastName ?? '',
                employeeCode: e.employeeCode,
            };
        };
        return {
            leave: leaveRequests.map((r) => ({
                employeeId: r.employeeId.toString(),
                employee: mapEmployee(r.employeeId),
                status: r.status,
                leaveTypeName: r.leaveTypeId?.name ?? null,
            })),
            outsideWork: outsideWorkRequests.map((r) => ({
                employeeId: r.employeeId.toString(),
                employee: mapEmployee(r.employeeId),
                status: r.status,
                outsideType: r.outsideType,
            })),
            adjustments: adjustmentRequests.map((r) => ({
                employeeId: r.employeeId.toString(),
                employee: mapEmployee(r.employeeId),
                status: r.status,
                workDate: r.workDate,
                type: r.type ?? '-',
            })),
        };
    }
    async getMonthlySummary(tenantId) {
        const year = new Date().getFullYear();
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
        const [leaveRequests, otRequests] = await Promise.all([
            this.leaveRepository.findReport(tenantId, { status: 'APPROVED', startDate: { $gte: yearStart, $lte: yearEnd } }, 1, 1000),
            this.otRepository.findApprovedInDateRange(tenantId, yearStart, yearEnd),
        ]);
        return buildMonthlySummary(leaveRequests.items, otRequests);
    }
};
exports.DashboardRepository = DashboardRepository;
exports.DashboardRepository = DashboardRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_schema_1.Employee.name)),
    __param(1, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        attendance_repository_1.AttendanceRepository,
        leave_repository_1.LeaveRepository,
        ot_repository_1.OTRepository,
        outside_work_repository_1.OutsideWorkRepository,
        attendance_adjustments_repository_1.AttendanceAdjustmentsRepository])
], DashboardRepository);
function buildMonthlySummary(leaveItems, otItems) {
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        approvedLeave: 0,
        approvedOt: 0,
        otHours: 0,
    }));
    for (const leave of leaveItems) {
        const month = new Date(leave.startDate).getMonth();
        months[month].approvedLeave += leave.totalDays ?? 1;
    }
    for (const ot of otItems) {
        const month = new Date(ot.date).getMonth();
        months[month].approvedOt += 1;
        months[month].otHours += ot.totalHours ?? 0;
    }
    return months;
}
//# sourceMappingURL=dashboard.repository.js.map