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
exports.HolidaysService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const holidays_repository_1 = require("./holidays.repository");
let HolidaysService = class HolidaysService {
    holidaysRepository;
    constructor(holidaysRepository) {
        this.holidaysRepository = holidaysRepository;
    }
    async create(tenantId, dto) {
        return this.holidaysRepository.create(new mongoose_1.Types.ObjectId(tenantId), dto);
    }
    async findAll(tenantId, query) {
        const year = query.year ? parseInt(query.year, 10) : undefined;
        const holidays = await this.holidaysRepository.findAll(new mongoose_1.Types.ObjectId(tenantId), year);
        return { data: holidays };
    }
    async findOne(tenantId, id) {
        const holiday = await this.holidaysRepository.findById(id, new mongoose_1.Types.ObjectId(tenantId));
        if (!holiday)
            throw new common_1.NotFoundException('Holiday not found');
        return holiday;
    }
    async update(tenantId, id, dto) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.holidaysRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Holiday not found');
        return this.holidaysRepository.update(id, tenantObjectId, dto);
    }
    async softDelete(tenantId, id) {
        const tenantObjectId = new mongoose_1.Types.ObjectId(tenantId);
        const existing = await this.holidaysRepository.findById(id, tenantObjectId);
        if (!existing)
            throw new common_1.NotFoundException('Holiday not found');
        return this.holidaysRepository.softDelete(id, tenantObjectId);
    }
};
exports.HolidaysService = HolidaysService;
exports.HolidaysService = HolidaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [holidays_repository_1.HolidaysRepository])
], HolidaysService);
//# sourceMappingURL=holidays.service.js.map