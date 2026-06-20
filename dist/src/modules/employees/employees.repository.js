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
exports.EmployeesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_schema_1 = require("./schemas/employee.schema");
let EmployeesRepository = class EmployeesRepository {
    employeeModel;
    constructor(employeeModel) {
        this.employeeModel = employeeModel;
    }
    async create(tenantId, dto) {
        const data = {
            ...dto,
            tenantId,
            branchId: dto.branchId ? new mongoose_2.Types.ObjectId(dto.branchId) : null,
            departmentId: dto.departmentId
                ? new mongoose_2.Types.ObjectId(dto.departmentId)
                : null,
            positionId: dto.positionId ? new mongoose_2.Types.ObjectId(dto.positionId) : null,
            managerId: dto.managerId ? new mongoose_2.Types.ObjectId(dto.managerId) : null,
            supervisorId: dto.supervisorId
                ? new mongoose_2.Types.ObjectId(dto.supervisorId)
                : null,
        };
        delete data.initialPassword;
        return this.employeeModel.create(data);
    }
    async findById(id, tenantId) {
        return this.employeeModel
            .findOne({ _id: id, tenantId })
            .populate('branchId', 'name')
            .populate('departmentId', 'name')
            .populate('positionId', 'name')
            .populate('userId', 'role')
            .exec();
    }
    async findPaginated(filter, page, limit, sort) {
        const skip = (page - 1) * limit;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.replace(/^-/, '');
        const mongoFilter = filter;
        const [employees, total] = await Promise.all([
            this.employeeModel
                .find(mongoFilter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit)
                .populate('branchId', 'name')
                .populate('departmentId', 'name')
                .populate('positionId', 'name')
                .populate('userId', 'role')
                .exec(),
            this.employeeModel.countDocuments(mongoFilter).exec(),
        ]);
        return { employees, total };
    }
    async update(id, tenantId, dto) {
        const updateData = { ...dto };
        if (dto.branchId)
            updateData.branchId = new mongoose_2.Types.ObjectId(dto.branchId);
        if (dto.departmentId)
            updateData.departmentId = new mongoose_2.Types.ObjectId(dto.departmentId);
        if (dto.positionId)
            updateData.positionId = new mongoose_2.Types.ObjectId(dto.positionId);
        if (dto.managerId)
            updateData.managerId = new mongoose_2.Types.ObjectId(dto.managerId);
        if (dto.supervisorId)
            updateData.supervisorId = new mongoose_2.Types.ObjectId(dto.supervisorId);
        return this.employeeModel
            .findOneAndUpdate({ _id: id, tenantId }, updateData, {
            returnDocument: 'after',
        })
            .exec();
    }
    async setStatus(id, tenantId, status) {
        return this.employeeModel
            .findOneAndUpdate({ _id: id, tenantId }, { status }, { returnDocument: 'after' })
            .exec();
    }
    async linkUser(id, tenantId, userId) {
        await this.employeeModel
            .findOneAndUpdate({ _id: id, tenantId }, { userId })
            .exec();
    }
    async findByUserId(userId) {
        return this.employeeModel
            .findOne({ userId })
            .select('employeeCode firstName lastName email photoUrl bankName bankAccount employmentType startDate status branchId departmentId positionId')
            .populate('positionId', 'name banding')
            .populate('departmentId', 'name')
            .populate('branchId', 'name')
            .exec();
    }
    async findFullByUserIdAndTenant(userId, tenantId) {
        return this.employeeModel
            .findOne({ userId, tenantId })
            .populate('branchId', 'name')
            .populate('departmentId', 'name')
            .populate('positionId', 'name')
            .exec();
    }
    async updateByUserIdAndTenant(userId, tenantId, data) {
        return this.employeeModel
            .findOneAndUpdate({ userId, tenantId }, data, { returnDocument: 'after' })
            .populate('branchId', 'name')
            .populate('departmentId', 'name')
            .populate('positionId', 'name')
            .exec();
    }
    async findByUserIdAndTenant(userId, tenantId) {
        return this.employeeModel
            .findOne({ userId, tenantId })
            .select('employeeCode firstName lastName status branchId managerId supervisorId userId')
            .exec();
    }
    async countByTenant(tenantId) {
        return this.employeeModel
            .countDocuments({
            tenantId,
            status: { $nin: ['RESIGNED', 'TERMINATED'] },
        })
            .exec();
    }
    async countActive(tenantId, branchId) {
        return this.employeeModel
            .countDocuments({
            tenantId,
            status: 'ACTIVE',
            ...(branchId ? { branchId } : {}),
        })
            .exec();
    }
    async findByIds(ids, tenantId) {
        return this.employeeModel
            .find({
            _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) },
            tenantId,
        })
            .select('firstName lastName employeeCode positionId departmentId')
            .populate('positionId', 'name')
            .lean()
            .exec();
    }
    async findAllActive(tenantId, branchId) {
        const filter = { tenantId, status: 'ACTIVE' };
        if (branchId)
            filter.branchId = branchId;
        return this.employeeModel
            .find(filter)
            .select('employeeCode firstName lastName positionId branchId')
            .populate('positionId', 'name')
            .populate('branchId', 'name')
            .lean()
            .exec();
    }
    async generateNextCode(tenantId, companyCode, year) {
        const prefix = `${companyCode}-${year}-`;
        const count = await this.employeeModel
            .countDocuments({ tenantId, employeeCode: { $regex: `^${prefix}` } })
            .exec();
        const seq = String(count + 1).padStart(4, '0');
        return `${prefix}${seq}`;
    }
    async findByEmployeeCode(tenantId, employeeCode) {
        return this.employeeModel.findOne({ tenantId, employeeCode }).exec();
    }
};
exports.EmployeesRepository = EmployeesRepository;
exports.EmployeesRepository = EmployeesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_schema_1.Employee.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EmployeesRepository);
//# sourceMappingURL=employees.repository.js.map