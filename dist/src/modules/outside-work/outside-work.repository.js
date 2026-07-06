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
exports.OutsideWorkRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const outside_work_schema_1 = require("./schemas/outside-work.schema");
const MAX_LIMIT = 100;
let OutsideWorkRepository = class OutsideWorkRepository {
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
    async findByEmployee(tenantId, employeeId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, employeeId };
        const [items, total] = await Promise.all([
            this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    findPending(tenantId) {
        return this.model
            .find({ tenantId, status: 'PENDING' })
            .sort({ createdAt: -1 })
            .populate('employeeId', 'firstName lastName phone')
            .exec();
    }
    findTodayActive(tenantId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return this.model
            .find({
            tenantId,
            status: { $in: ['PENDING', 'APPROVED'] },
            createdAt: { $gte: start, $lte: end },
        })
            .select('employeeId status outsideType')
            .populate({
            path: 'employeeId',
            select: 'firstName lastName nickname employeeCode phone branchId',
            populate: { path: 'branchId', select: 'name' },
        })
            .lean()
            .exec();
    }
    update(id, tenantId, update) {
        return this.model.findOneAndUpdate({ _id: id, tenantId }, update, { returnDocument: 'after' }).exec();
    }
    async findReport(tenantId, filter, page, limit) {
        const skip = (page - 1) * limit;
        const query = { tenantId, ...filter };
        const [items, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('employeeId', 'firstName lastName phone').exec(),
            this.model.countDocuments(query).exec(),
        ]);
        return { items, total };
    }
};
exports.OutsideWorkRepository = OutsideWorkRepository;
exports.OutsideWorkRepository = OutsideWorkRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(outside_work_schema_1.OutsideWork.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OutsideWorkRepository);
//# sourceMappingURL=outside-work.repository.js.map