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
exports.AttendanceRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_log_schema_1 = require("./schemas/attendance-log.schema");
let AttendanceRepository = class AttendanceRepository {
    logModel;
    constructor(logModel) {
        this.logModel = logModel;
    }
    create(data) {
        return this.logModel.create(data);
    }
    findById(id, tenantId) {
        return this.logModel.findOne({ _id: id, tenantId }).exec();
    }
    findTodayCheckIn(employeeId, tenantId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return this.logModel
            .findOne({
            employeeId,
            tenantId,
            type: 'CHECK_IN',
            checkTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'MANUAL_ADJUSTED' },
        })
            .sort({ checkTime: -1 })
            .exec();
    }
    findTodayLogs(employeeId, tenantId) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        return this.logModel
            .find({
            employeeId,
            tenantId,
            checkTime: { $gte: startOfDay, $lte: endOfDay },
        })
            .sort({ checkTime: 1 })
            .exec();
    }
    async findPaginated(tenantId, employeeId, page, limit, startDate, endDate) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, employeeId };
        if (startDate || endDate) {
            filter.serverTime = {};
            if (startDate)
                filter.serverTime.$gte = startDate;
            if (endDate)
                filter.serverTime.$lte = endDate;
        }
        const [logs, total] = await Promise.all([
            this.logModel
                .find(filter)
                .sort({ serverTime: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.logModel.countDocuments(filter).exec(),
        ]);
        return { logs, total };
    }
    findByDateRange(tenantId, startDate, endDate, branchId) {
        const filter = {
            tenantId,
            checkTime: { $gte: startDate, $lte: endDate },
        };
        if (branchId)
            filter.branchId = branchId;
        return this.logModel.find(filter).sort({ serverTime: -1 }).exec();
    }
    findByStatus(tenantId, status, startDate, endDate, branchId) {
        const filter = {
            tenantId,
            status,
            checkTime: { $gte: startDate, $lte: endDate },
        };
        if (branchId)
            filter.branchId = branchId;
        return this.logModel.find(filter).exec();
    }
    updateLog(id, tenantId, update) {
        return this.logModel
            .findOneAndUpdate({ _id: id, tenantId }, update, {
            returnDocument: 'after',
        })
            .exec();
    }
    updateStatus(id, status) {
        return this.logModel
            .findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
            .exec();
    }
    async findDailyPaginated(tenantId, employeeId, page, limit, startDate, endDate) {
        const matchStage = { tenantId, employeeId };
        if (startDate || endDate) {
            matchStage.checkTime = {};
            if (startDate)
                matchStage.checkTime.$gte = startDate;
            if (endDate)
                matchStage.checkTime.$lte = endDate;
        }
        const groupStage = {
            _id: {
                $dateToString: {
                    format: '%Y-%m-%d',
                    date: { $add: ['$checkTime', 7 * 60 * 60 * 1000] },
                },
            },
            logs: { $push: '$$ROOT' },
        };
        const [result] = await this.logModel.aggregate([
            { $match: matchStage },
            { $sort: { checkTime: -1 } },
            { $group: groupStage },
            { $sort: { _id: -1 } },
            {
                $facet: {
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]);
        const days = result?.data ?? [];
        const total = result?.totalCount?.[0]?.count ?? 0;
        return { days, total };
    }
    findByType(tenantId, type, startDate, endDate, branchId) {
        const filter = {
            tenantId,
            type,
            checkTime: { $gte: startDate, $lte: endDate },
        };
        if (branchId)
            filter.branchId = branchId;
        return this.logModel.find(filter).exec();
    }
    async findCheckedInEmployeeIds(tenantId, start, end) {
        const logs = await this.logModel
            .find({
            tenantId,
            type: 'CHECK_IN',
            checkTime: { $gte: start, $lte: end },
        })
            .select('employeeId')
            .lean()
            .exec();
        const uniqueIds = [...new Set(logs.map((l) => l.employeeId.toString()))];
        return uniqueIds;
    }
    async getSummaryForDate(tenantId, date, branchId) {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        const checkIns = await this.logModel
            .find({
            tenantId,
            type: 'CHECK_IN',
            checkTime: { $gte: start, $lte: end },
            ...(branchId ? { branchId } : {}),
        })
            .lean();
        const checkedIn = checkIns.length;
        const late = checkIns.filter((log) => log.status === 'LATE' || log.status === 'LATE_MINOR').length;
        return { checkedIn, late };
    }
    findLogsForEmployeeInMonth(tenantId, employeeId, start, end) {
        return this.logModel
            .find({
            tenantId,
            employeeId,
            checkTime: { $gte: start, $lte: end },
        })
            .sort({ checkTime: 1 })
            .lean()
            .exec();
    }
    async countPresenceDaysByEmployee(tenantId, employeeIds, startDate, endDate) {
        const rows = await this.logModel
            .aggregate([
            {
                $match: {
                    tenantId,
                    employeeId: { $in: employeeIds },
                    type: 'CHECK_IN',
                    checkTime: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        employeeId: '$employeeId',
                        date: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: { $add: ['$checkTime', 7 * 60 * 60 * 1000] },
                            },
                        },
                    },
                },
            },
            { $group: { _id: '$_id.employeeId', days: { $sum: 1 } } },
        ])
            .exec();
        return new Map(rows.map((row) => [row._id.toString(), row.days]));
    }
};
exports.AttendanceRepository = AttendanceRepository;
exports.AttendanceRepository = AttendanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_log_schema_1.AttendanceLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AttendanceRepository);
//# sourceMappingURL=attendance.repository.js.map