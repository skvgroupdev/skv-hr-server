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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../../common/services/s3.service");
let UploadsController = class UploadsController {
    s3Service;
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async upload(file, type) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        const result = await this.s3Service.uploadFile(type, file);
        return { data: result };
    }
    async remove(key) {
        if (!key)
            throw new common_1.BadRequestException('Query param "key" is required');
        await this.s3Service.deleteFile(key);
        return { data: { deleted: true } };
    }
    async update(file, oldKey, type) {
        if (!file)
            throw new common_1.BadRequestException('No file provided');
        if (!oldKey)
            throw new common_1.BadRequestException('"oldKey" is required');
        const result = await this.s3Service.updateFile(oldKey, type, file);
        return { data: result };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('oldKey')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "update", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map