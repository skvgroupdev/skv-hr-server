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
exports.LeaveRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const leave_type_schema_1 = require("./schemas/leave-type.schema");
const leave_balance_schema_1 = require("./schemas/leave-balance.schema");
const leave_request_schema_1 = require("./schemas/leave-request.schema");
const MAX_LIMIT = 100;
let LeaveRepository = class LeaveRepository {
    leaveTypeModel;
    balanceModel;
    requestModel;
    constructor(leaveTypeModel, balanceModel, requestModel) {
        this.leaveTypeModel = leaveTypeModel;
        this.balanceModel = balanceModel;
        this.requestModel = requestModel;
    }
    createLeaveType(data) {
        return this.leaveTypeModel.create(data);
    }
    findAllLeaveTypes(tenantId) {
        return this.leaveTypeModel.find({ tenantId, isActive: true }).exec();
    }
    findLeaveTypeById(id, tenantId) {
        return this.leaveTypeModel.findOne({ _id: id, tenantId }).exec();
    }
    updateLeaveType(id, tenantId, data) {
        return this.leaveTypeModel
            .findOneAndUpdate({ _id: id, tenantId }, data, {
            returnDocument: 'after',
        })
            .exec();
    }
    softDeleteLeaveType(id, tenantId) {
        return this.leaveTypeModel
            .findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' })
            .exec();
    }
    findBalance(tenantId, employeeId, leaveTypeId, year) {
        return this.balanceModel
            .findOne({ tenantId, employeeId, leaveTypeId, year })
            .exec();
    }
    findBalancesByEmployee(tenantId, employeeId) {
        const year = new Date().getFullYear();
        return this.balanceModel
            .find({ tenantId, employeeId, year })
            .populate('leaveTypeId')
            .exec();
    }
    async upsertBalance(tenantId, employeeId, leaveTypeId, year, adjustUsed) {
        const balance = await this.balanceModel
            .findOneAndUpdate({ tenantId, employeeId, leaveTypeId, year }, {
            $inc: { usedDays: adjustUsed, remainingDays: -adjustUsed },
        }, { returnDocument: 'after', upsert: true })
            .exec();
        return balance;
    }
    createBalance(data) {
        return this.balanceModel.create(data);
    }
    async adjustBalance(tenantId, employeeId, leaveTypeId, year, adjustment) {
        return this.balanceModel
            .findOneAndUpdate({ tenantId, employeeId, leaveTypeId, year }, { $inc: { totalDays: adjustment, remainingDays: adjustment } }, { returnDocument: 'after', upsert: true })
            .exec();
    }
    createRequest(data) {
        return this.requestModel.create(data);
    }
    findRequestById(id, tenantId) {
        return this.requestModel.findOne({ _id: id, tenantId }).exec();
    }
    async findRequestsByEmployee(tenantId, employeeId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, employeeId };
        const [items, total] = await Promise.all([
            this.requestModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.requestModel.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    findPendingRequests(tenantId) {
        return this.requestModel
            .find({ tenantId, status: 'PENDING' })
            .sort({ createdAt: -1 })
            .populate('employeeId', 'firstName lastName phone')
            .populate('leaveTypeId', 'name code')
            .exec();
    }
    updateRequest(id, tenantId, data) {
        return this.requestModel
            .findOneAndUpdate({ _id: id, tenantId }, data, {
            returnDocument: 'after',
        })
            .exec();
    }
    findOverlapping(tenantId, employeeId, startDate, endDate) {
        return this.requestModel
            .findOne({
            tenantId,
            employeeId,
            status: { $in: ['PENDING', 'APPROVED'] },
            $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
        })
            .exec();
    }
    async findReport(tenantId, filter, page, limit) {
        const skip = (page - 1) * limit;
        const query = { tenantId, ...filter };
        const [items, total] = await Promise.all([
            this.requestModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('employeeId', 'firstName lastName phone')
                .populate('leaveTypeId', 'name code')
                .exec(),
            this.requestModel.countDocuments(query).exec(),
        ]);
        return { items, total };
    }
    async findApprovedInDateRange(tenantId, startDate, endDate) {
        return this.requestModel
            .find({
            tenantId,
            status: 'APPROVED',
            startDate: { $gte: startDate },
            endDate: { $lte: endDate },
        })
            .select('employeeId totalDays leaveTypeId')
            .populate('leaveTypeId', 'category isPaid')
            .lean()
            .exec()
            .then((items) => items.map((item) => ({
            employeeId: item.employeeId,
            totalDays: item.totalDays,
            category: item.leaveTypeId?.category ?? 'LEAVE',
            isPaid: item.leaveTypeId
                ?.isPaid ?? false,
        })));
    }
};
exports.LeaveRepository = LeaveRepository;
exports.LeaveRepository = LeaveRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(leave_type_schema_1.LeaveType.name)),
    __param(1, (0, mongoose_1.InjectModel)(leave_balance_schema_1.LeaveBalance.name)),
    __param(2, (0, mongoose_1.InjectModel)(leave_request_schema_1.LeaveRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], LeaveRepository);
//# sourceMappingURL=leave.repository.js.map