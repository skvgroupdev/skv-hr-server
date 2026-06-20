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
exports.ShiftsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_schema_1 = require("./schemas/shift.schema");
const shift_assignment_schema_1 = require("./schemas/shift-assignment.schema");
let ShiftsRepository = class ShiftsRepository {
    shiftModel;
    assignmentModel;
    constructor(shiftModel, assignmentModel) {
        this.shiftModel = shiftModel;
        this.assignmentModel = assignmentModel;
    }
    create(tenantId, dto) {
        return this.shiftModel.create({ ...dto, tenantId });
    }
    findAll(tenantId) {
        return this.shiftModel
            .find({ tenantId, isActive: true })
            .sort({ name: 1 })
            .exec();
    }
    findById(id, tenantId) {
        return this.shiftModel.findOne({ _id: id, tenantId }).exec();
    }
    update(id, tenantId, dto) {
        return this.shiftModel
            .findOneAndUpdate({ _id: id, tenantId }, dto, { returnDocument: 'after' })
            .exec();
    }
    softDelete(id, tenantId) {
        return this.shiftModel
            .findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' })
            .exec();
    }
    createAssignment(tenantId, employeeId, shiftId, effectiveDate, endDate) {
        return this.assignmentModel.create({
            tenantId,
            employeeId,
            shiftId,
            effectiveDate,
            endDate,
        });
    }
    findOverlappingAssignment(tenantId, employeeId, effectiveDate, endDate) {
        return this.assignmentModel
            .findOne({
            tenantId,
            employeeId,
            effectiveDate: {
                $lte: endDate ?? new Date('9999-12-31T23:59:59.999Z'),
            },
            $or: [
                { endDate: { $gte: effectiveDate } },
                { endDate: null },
                { endDate: { $exists: false } },
            ],
        })
            .exec();
    }
    findAssignmentsForRange(tenantId, employeeIds, startDate, endDate) {
        return this.assignmentModel
            .find({
            tenantId,
            employeeId: { $in: employeeIds },
            effectiveDate: { $lte: endDate },
            $or: [
                { endDate: { $gte: startDate } },
                { endDate: null },
                { endDate: { $exists: false } },
            ],
        })
            .populate('shiftId')
            .sort({ effectiveDate: 1 })
            .exec();
    }
    closeAssignment(id, tenantId, endDate) {
        return this.assignmentModel
            .findOneAndUpdate({ _id: id, tenantId }, { endDate }, { returnDocument: 'after' })
            .exec();
    }
    async findCurrentAssignmentsByEmployeeIds(employeeIds, tenantId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const assignments = (await this.assignmentModel
            .find({
            tenantId,
            employeeId: { $in: employeeIds },
            effectiveDate: { $lte: today },
            $or: [
                { endDate: { $gte: today } },
                { endDate: null },
                { endDate: { $exists: false } },
            ],
        })
            .sort({ effectiveDate: -1 })
            .populate('shiftId')
            .lean()
            .exec());
        const seen = new Set();
        return assignments.filter((a) => {
            const empKey = a.employeeId.toString();
            if (seen.has(empKey))
                return false;
            seen.add(empKey);
            return true;
        });
    }
    findAllAssignments(employeeId, tenantId) {
        return this.assignmentModel
            .find({ employeeId, tenantId })
            .sort({ effectiveDate: -1 })
            .populate('shiftId')
            .exec();
    }
    findCurrentAssignment(employeeId, tenantId) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return this.assignmentModel
            .findOne({
            employeeId,
            tenantId,
            effectiveDate: { $lte: today },
            $or: [
                { endDate: { $gte: today } },
                { endDate: null },
                { endDate: { $exists: false } },
            ],
        })
            .sort({ effectiveDate: -1 })
            .populate('shiftId')
            .exec();
    }
};
exports.ShiftsRepository = ShiftsRepository;
exports.ShiftsRepository = ShiftsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_schema_1.Shift.name)),
    __param(1, (0, mongoose_1.InjectModel)(shift_assignment_schema_1.ShiftAssignment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ShiftsRepository);
//# sourceMappingURL=shifts.repository.js.map