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
exports.BranchesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("./schemas/branch.schema");
let BranchesRepository = class BranchesRepository {
    branchModel;
    constructor(branchModel) {
        this.branchModel = branchModel;
    }
    async create(tenantId, dto) {
        const coords = dto.location?.coordinates;
        const location = Array.isArray(coords) && coords.length === 2
            ? { type: 'Point', coordinates: coords }
            : undefined;
        return this.branchModel.create({
            ...dto,
            tenantId,
            location,
            managerId: dto.managerId ? new mongoose_2.Types.ObjectId(dto.managerId) : null,
        });
    }
    async findById(id, tenantId) {
        return this.branchModel.findOne({ _id: id, tenantId }).exec();
    }
    async findPaginated(tenantId, page, limit, sort, filter = {}) {
        const skip = (page - 1) * limit;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.replace(/^-/, '');
        const query = { tenantId, ...filter };
        const [branches, total] = await Promise.all([
            this.branchModel.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).exec(),
            this.branchModel.countDocuments(query).exec(),
        ]);
        return { branches, total };
    }
    async update(id, tenantId, dto) {
        const updateData = { ...dto };
        if (dto.managerId)
            updateData.managerId = new mongoose_2.Types.ObjectId(dto.managerId);
        if ('location' in dto) {
            const coords = dto.location?.coordinates;
            updateData.location =
                Array.isArray(coords) && coords.length === 2
                    ? { type: 'Point', coordinates: coords }
                    : undefined;
        }
        return this.branchModel.findOneAndUpdate({ _id: id, tenantId }, updateData, { returnDocument: 'after' }).exec();
    }
    async setActive(id, tenantId, isActive) {
        return this.branchModel.findOneAndUpdate({ _id: id, tenantId }, { isActive }, { returnDocument: 'after' }).exec();
    }
    async countByTenant(tenantId) {
        return this.branchModel.countDocuments({ tenantId, isActive: true }).exec();
    }
};
exports.BranchesRepository = BranchesRepository;
exports.BranchesRepository = BranchesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BranchesRepository);
//# sourceMappingURL=branches.repository.js.map