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
exports.DevicesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const device_token_schema_1 = require("./schemas/device-token.schema");
let DevicesRepository = class DevicesRepository {
    tokenModel;
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    async upsertToken(tenantId, userId, token, platform) {
        return this.tokenModel.findOneAndUpdate({ token }, { tenantId, userId, token, platform }, { upsert: true, returnDocument: 'after' }).exec();
    }
    async removeToken(token) {
        await this.tokenModel.deleteOne({ token }).exec();
    }
    async findTokensByUser(userId) {
        return this.tokenModel.find({ userId }).exec();
    }
};
exports.DevicesRepository = DevicesRepository;
exports.DevicesRepository = DevicesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(device_token_schema_1.DeviceToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DevicesRepository);
//# sourceMappingURL=devices.repository.js.map