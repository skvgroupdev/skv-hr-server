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
exports.AnnouncementsController = void 0;
const common_1 = require("@nestjs/common");
const announcements_service_1 = require("./announcements.service");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
const update_announcement_dto_1 = require("./dto/update-announcement.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const require_features_decorator_1 = require("../../common/decorators/require-features.decorator");
let AnnouncementsController = class AnnouncementsController {
    announcementsService;
    constructor(announcementsService) {
        this.announcementsService = announcementsService;
    }
    async create(dto, user) {
        const item = await this.announcementsService.create(user.companyId, user.sub, dto);
        return { data: item };
    }
    async findAll(page, limit, user) {
        return this.announcementsService.findAll(user.companyId, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
    }
    async getMobileFeed(page, limit, user) {
        return this.announcementsService.getMobileFeed(user.companyId, parseInt(page ?? '1', 10), parseInt(limit ?? '20', 10));
    }
    async findOne(id, user) {
        const item = await this.announcementsService.findOne(user.companyId, id);
        return { data: item };
    }
    async update(id, dto, user) {
        const item = await this.announcementsService.update(user.companyId, id, dto);
        return { data: item };
    }
    async delete(id, user) {
        await this.announcementsService.delete(user.companyId, id);
        return { data: { deleted: true } };
    }
    async publish(id, user) {
        const item = await this.announcementsService.publish(user.companyId, id);
        return { data: item };
    }
    async markRead(id, user) {
        const item = await this.announcementsService.markRead(id, user.sub);
        return { data: item };
    }
};
exports.AnnouncementsController = AnnouncementsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_announcement_dto_1.CreateAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mobile/feed'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "getMobileFeed", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_announcement_dto_1.UpdateAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, roles_decorator_1.Roles)('COMPANY_OWNER', 'HR_ADMIN'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "markRead", null);
exports.AnnouncementsController = AnnouncementsController = __decorate([
    (0, common_1.Controller)('announcements'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, require_features_decorator_1.RequireFeatures)('announcement'),
    __metadata("design:paramtypes", [announcements_service_1.AnnouncementsService])
], AnnouncementsController);
//# sourceMappingURL=announcements.controller.js.map