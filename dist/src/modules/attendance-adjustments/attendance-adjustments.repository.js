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
exports.AttendanceAdjustmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_adjustment_schema_1 = require("./schemas/attendance-adjustment.schema");
let AttendanceAdjustmentsRepository = class AttendanceAdjustmentsRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return this.model.create(data);
    }
    findById(id, tenantId) {
        return this.model.findOne({ _id: id, tenantId }).exec();
    }
    findByEmployee(tenantId, employeeId) {
        return this.model
            .find({ tenantId, employeeId })
            .sort({ createdAt: -1 })
            .exec();
    }
    findAll(tenantId, branchId, status) {
        return this.model
            .find({
            tenantId,
            ...(branchId ? { branchId } : {}),
            ...(status ? { status } : {}),
        })
            .populate('employeeId', 'firstName lastName firstNameEn lastNameEn nickname employeeCode')
            .sort({ createdAt: -1 })
            .exec();
    }
    findTodayActive(tenantId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return this.model
            .find({ tenantId, workDate: { $gte: start, $lte: end }, status: { $in: ['PENDING', 'APPROVED'] } })
            .populate({
            path: 'employeeId',
            select: 'firstName lastName nickname employeeCode phone branchId',
            populate: { path: 'branchId', select: 'name' },
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    update(id, tenantId, data) {
        return this.model
            .findOneAndUpdate({ _id: id, tenantId }, data, {
            returnDocument: 'after',
        })
            .exec();
    }
};
exports.AttendanceAdjustmentsRepository = AttendanceAdjustmentsRepository;
exports.AttendanceAdjustmentsRepository = AttendanceAdjustmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_adjustment_schema_1.AttendanceAdjustment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AttendanceAdjustmentsRepository);
//# sourceMappingURL=attendance-adjustments.repository.js.map