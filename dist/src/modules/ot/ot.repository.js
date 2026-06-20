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
exports.OTRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ot_policy_schema_1 = require("./schemas/ot-policy.schema");
const ot_request_schema_1 = require("./schemas/ot-request.schema");
let OTRepository = class OTRepository {
    policyModel;
    requestModel;
    constructor(policyModel, requestModel) {
        this.policyModel = policyModel;
        this.requestModel = requestModel;
    }
    async getPolicy(tenantId) {
        return this.policyModel.findOne({ tenantId }).exec();
    }
    async upsertPolicy(tenantId, data) {
        return this.policyModel.findOneAndUpdate({ tenantId }, { ...data, tenantId }, { upsert: true, returnDocument: 'after' }).exec();
    }
    createRequest(data) {
        return this.requestModel.create(data);
    }
    findById(id, tenantId) {
        return this.requestModel.findOne({ _id: id, tenantId }).exec();
    }
    async findByEmployee(tenantId, employeeId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, employeeId };
        const [items, total] = await Promise.all([
            this.requestModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.requestModel.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    findPending(tenantId) {
        return this.requestModel.find({ tenantId, status: 'PENDING' }).sort({ createdAt: -1 }).exec();
    }
    updateRequest(id, tenantId, data) {
        return this.requestModel.findOneAndUpdate({ _id: id, tenantId }, data, { returnDocument: 'after' }).exec();
    }
    findApprovedInDateRange(tenantId, startDate, endDate, employeeId) {
        const filter = {
            tenantId,
            status: 'APPROVED',
            date: { $gte: startDate, $lte: endDate },
        };
        if (employeeId)
            filter.employeeId = employeeId;
        return this.requestModel.find(filter).exec();
    }
    async findReport(tenantId, filter, page, limit) {
        const skip = (page - 1) * limit;
        const query = { tenantId, ...filter };
        const [items, total] = await Promise.all([
            this.requestModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.requestModel.countDocuments(query).exec(),
        ]);
        return { items, total };
    }
};
exports.OTRepository = OTRepository;
exports.OTRepository = OTRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ot_policy_schema_1.OTPolicy.name)),
    __param(1, (0, mongoose_1.InjectModel)(ot_request_schema_1.OTRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OTRepository);
//# sourceMappingURL=ot.repository.js.map