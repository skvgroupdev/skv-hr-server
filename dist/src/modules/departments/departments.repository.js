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
exports.DepartmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const department_schema_1 = require("./schemas/department.schema");
let DepartmentsRepository = class DepartmentsRepository {
    departmentModel;
    constructor(departmentModel) {
        this.departmentModel = departmentModel;
    }
    async create(tenantId, dto) {
        return this.departmentModel.create({
            ...dto,
            tenantId,
            headId: dto.headId ? new mongoose_2.Types.ObjectId(dto.headId) : null,
        });
    }
    async findById(id, tenantId) {
        return this.departmentModel.findOne({ _id: id, tenantId }).exec();
    }
    async findPaginated(tenantId, page, limit, sort) {
        const skip = (page - 1) * limit;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.replace(/^-/, '');
        const query = { tenantId };
        const [departments, total] = await Promise.all([
            this.departmentModel.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
            this.departmentModel.countDocuments(query).exec(),
        ]);
        return { departments, total };
    }
    async update(id, tenantId, dto) {
        const updateData = { ...dto };
        if (dto.headId)
            updateData.headId = new mongoose_2.Types.ObjectId(dto.headId);
        return this.departmentModel
            .findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' })
            .exec();
    }
    async softDelete(id, tenantId) {
        return this.departmentModel
            .findOneAndUpdate({ _id: id, tenantId }, { isActive: false }, { returnDocument: 'after' })
            .exec();
    }
};
exports.DepartmentsRepository = DepartmentsRepository;
exports.DepartmentsRepository = DepartmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DepartmentsRepository);
//# sourceMappingURL=departments.repository.js.map