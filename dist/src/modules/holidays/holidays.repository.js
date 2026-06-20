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
exports.HolidaysRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const holiday_schema_1 = require("./schemas/holiday.schema");
let HolidaysRepository = class HolidaysRepository {
    holidayModel;
    constructor(holidayModel) {
        this.holidayModel = holidayModel;
    }
    create(tenantId, dto) {
        return this.holidayModel.create({ ...dto, tenantId, date: new Date(dto.date) });
    }
    findAll(tenantId, year) {
        const filter = { tenantId, isActive: true };
        if (year) {
            filter.date = {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
            };
        }
        return this.holidayModel.find(filter).sort({ date: 1 }).exec();
    }
    findById(id, tenantId) {
        return this.holidayModel.findOne({ _id: id, tenantId }).exec();
    }
    update(id, tenantId, dto) {
        const updateData = { ...dto };
        if (dto.date)
            updateData.date = new Date(dto.date);
        return this.holidayModel.findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' }).exec();
    }
    softDelete(id, tenantId) {
        return this.holidayModel.findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' }).exec();
    }
    findByDateRange(tenantId, startDate, endDate) {
        return this.holidayModel.find({ tenantId, isActive: true, date: { $gte: startDate, $lte: endDate } }).exec();
    }
};
exports.HolidaysRepository = HolidaysRepository;
exports.HolidaysRepository = HolidaysRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(holiday_schema_1.Holiday.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HolidaysRepository);
//# sourceMappingURL=holidays.repository.js.map