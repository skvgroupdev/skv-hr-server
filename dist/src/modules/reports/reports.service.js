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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const attendance_repository_1 = require("../attendance/attendance.repository");
const leave_repository_1 = require("../leave/leave.repository");
const ot_repository_1 = require("../ot/ot.repository");
let ReportsService = class ReportsService {
    attendanceRepository;
    leaveRepository;
    otRepository;
    constructor(attendanceRepository, leaveRepository, otRepository) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.otRepository = otRepository;
    }
    async getDailyAttendance(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const branchId = query.branchId ? new mongoose_1.Types.ObjectId(query.branchId) : undefined;
        return this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
    }
    async getMonthlyAttendance(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
        const month = parseInt(query.month ?? String(new Date().getMonth() + 1), 10);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        const branchId = query.branchId ? new mongoose_1.Types.ObjectId(query.branchId) : undefined;
        return this.attendanceRepository.findByDateRange(tenantObjectId, start, end, branchId);
    }
    async getLateAttendance(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const start = query.startDate ? new Date(query.startDate) : new Date();
        const end = query.endDate ? new Date(query.endDate) : new Date();
        const branchId = query.branchId ? new mongoose_1.Types.ObjectId(query.branchId) : undefined;
        return this.attendanceRepository.findByStatus(tenantObjectId, 'LATE', start, end, branchId);
    }
    async getAbsentAttendance(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const branchId = query.branchId ? new mongoose_1.Types.ObjectId(query.branchId) : undefined;
        return this.attendanceRepository.findByStatus(tenantObjectId, 'ABSENT', start, end, branchId);
    }
    async getMissingCheckout(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const date = query.date ? new Date(query.date) : new Date();
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const branchId = query.branchId ? new mongoose_1.Types.ObjectId(query.branchId) : undefined;
        return this.attendanceRepository.findByStatus(tenantObjectId, 'MISSING_CHECKOUT', start, end, branchId);
    }
    async getLeaveSummary(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const filter = { status: 'APPROVED' };
        if (query.leaveTypeId)
            filter.leaveTypeId = new mongoose_1.Types.ObjectId(query.leaveTypeId);
        if (query.startDate || query.endDate) {
            filter.startDate = {};
            if (query.startDate)
                filter.startDate.$gte = new Date(query.startDate);
            if (query.endDate)
                filter.startDate.$lte = new Date(query.endDate);
        }
        const { items } = await this.leaveRepository.findReport(tenantObjectId, filter, 1, 1000);
        return items;
    }
    async getLeaveBalance(tenantId, query) {
        const year = parseInt(query.year ?? String(new Date().getFullYear()), 10);
        return { message: 'Leave balance report', year };
    }
    async getOTSummary(tenantId, query) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const start = query.startDate ? new Date(query.startDate) : new Date();
        const end = query.endDate ? new Date(query.endDate) : new Date();
        return this.otRepository.findApprovedInDateRange(tenantObjectId, start, end);
    }
    async getOTCost(tenantId, query) {
        const requests = await this.getOTSummary(tenantId, query);
        const totalHours = requests.reduce((sum, r) => sum + (r.totalHours ?? 0), 0);
        return { requests, totalHours };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.AttendanceRepository,
        leave_repository_1.LeaveRepository,
        ot_repository_1.OTRepository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map