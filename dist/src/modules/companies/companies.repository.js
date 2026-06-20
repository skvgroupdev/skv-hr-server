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
exports.CompaniesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("./schemas/company.schema");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const employee_schema_1 = require("../employees/schemas/employee.schema");
let CompaniesRepository = class CompaniesRepository {
    companyModel;
    branchModel;
    employeeModel;
    constructor(companyModel, branchModel, employeeModel) {
        this.companyModel = companyModel;
        this.branchModel = branchModel;
        this.employeeModel = employeeModel;
    }
    async create(dto) {
        const data = {
            ...dto,
            planId: dto.planId ? new mongoose_2.Types.ObjectId(dto.planId) : null,
        };
        return this.companyModel.create(data);
    }
    async findById(id) {
        return this.companyModel.findById(id).exec();
    }
    async findByIdWithPlan(id) {
        return this.companyModel.findById(id).populate('planId').exec();
    }
    async findPaginated(page, limit, sort) {
        const skip = (page - 1) * limit;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.replace(/^-/, '');
        const [companies, total] = await Promise.all([
            this.companyModel
                .find()
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.companyModel.countDocuments().exec(),
        ]);
        return { companies, total };
    }
    async update(id, dto) {
        return this.companyModel
            .findByIdAndUpdate(id, dto, { returnDocument: 'after' })
            .populate('planId')
            .exec();
    }
    async updateStatus(id, status) {
        return this.companyModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).exec();
    }
    async countActiveEmployees(companyId) {
        return this.employeeModel
            .countDocuments({
            tenantId: companyId,
            status: { $nin: ['RESIGNED', 'TERMINATED'] },
        })
            .exec();
    }
    async countActiveBranches(companyId) {
        return this.branchModel
            .countDocuments({ tenantId: companyId, isActive: true })
            .exec();
    }
};
exports.CompaniesRepository = CompaniesRepository;
exports.CompaniesRepository = CompaniesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.Company.name)),
    __param(1, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __param(2, (0, mongoose_1.InjectModel)(employee_schema_1.Employee.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CompaniesRepository);
//# sourceMappingURL=companies.repository.js.map