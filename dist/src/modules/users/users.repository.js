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
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersRepository = class UsersRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findByIdWithSensitive(id) {
        return this.userModel.findById(id).select('+password +refreshToken').exec();
    }
    phoneVariants(phone) {
        const local = phone.replace(/^\+?856/, '').replace(/^0/, '');
        return [local, `0${local}`, `856${local}`, `+856${local}`];
    }
    async findByPhoneAndCompany(phone, companyId) {
        return this.userModel
            .findOne({ phone: { $in: this.phoneVariants(phone) }, companyId })
            .select('+password +refreshToken')
            .exec();
    }
    async findAllByPhone(phone) {
        return this.userModel
            .find({ phone: { $in: this.phoneVariants(phone) } })
            .exec();
    }
    async create(data) {
        return this.userModel.create(data);
    }
    async deleteById(userId) {
        await this.userModel.deleteOne({ _id: userId }).exec();
    }
    async updateRefreshToken(userId, hashedToken) {
        await this.userModel
            .findByIdAndUpdate(userId, { refreshToken: hashedToken })
            .exec();
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel
            .findByIdAndUpdate(userId, { password: hashedPassword })
            .exec();
    }
    async updatePhone(userId, phone) {
        await this.userModel.findByIdAndUpdate(userId, { phone }).exec();
    }
    async updateRole(userId, role) {
        await this.userModel.findByIdAndUpdate(userId, { role }).exec();
    }
    async updateRoleAndBranch(userId, companyId, role, branchId) {
        await this.userModel
            .findOneAndUpdate({ _id: userId, companyId }, { role, branchId })
            .exec();
    }
    async findByCompanyId(companyId) {
        return this.userModel.find({ companyId }).exec();
    }
    async findByRolesAndTenant(companyId, roles) {
        return this.userModel.find({ companyId, role: { $in: roles } }).exec();
    }
    async existsByPhoneAndCompany(phone, companyId) {
        const count = await this.userModel
            .countDocuments({ phone, companyId })
            .exec();
        return count > 0;
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map