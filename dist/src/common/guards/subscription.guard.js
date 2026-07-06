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
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const companies_repository_1 = require("../../modules/companies/companies.repository");
const plans_repository_1 = require("../../modules/plans/plans.repository");
const require_features_decorator_1 = require("../decorators/require-features.decorator");
const EXEMPT_ROLES = ['SUPER_ADMIN'];
let SubscriptionGuard = class SubscriptionGuard {
    reflector;
    companiesRepository;
    plansRepository;
    constructor(reflector, companiesRepository, plansRepository) {
        this.reflector = reflector;
        this.companiesRepository = companiesRepository;
        this.plansRepository = plansRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        if (EXEMPT_ROLES.includes(user.role))
            return true;
        if (!user.companyId)
            return true;
        const company = await this.companiesRepository.findById(user.companyId);
        if (!company)
            throw new common_1.ForbiddenException('Company not found');
        const subStatus = company.subscription?.status ?? company.status;
        if (subStatus === 'SUSPENDED' ||
            subStatus === 'EXPIRED' ||
            subStatus === 'CANCELLED') {
            throw new common_1.ForbiddenException('ສັນຍາໝົດອາຍຸ ກະລຸນາຕິດຕໍ່ SKV Group');
        }
        const subscriptionEndDate = company.subscription?.endDate
            ? new Date(company.subscription.endDate)
            : null;
        if (subscriptionEndDate &&
            !Number.isNaN(subscriptionEndDate.getTime()) &&
            subscriptionEndDate < new Date()) {
            throw new common_1.ForbiddenException('ສັນຍາໝົດອາຍຸ ກະລຸນາຕິດຕໍ່ SKV Group');
        }
        const requiredFeatures = this.reflector.getAllAndOverride(require_features_decorator_1.REQUIRED_FEATURES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredFeatures?.length)
            return true;
        if (!company.planId) {
            throw new common_1.ForbiddenException('Feature is not available in the current plan');
        }
        const plan = await this.plansRepository.findById(company.planId.toString());
        const missingFeature = requiredFeatures.find((feature) => feature === 'outsideWork'
            ? plan?.features?.outsideWork === false
            : !plan?.features?.[feature]);
        if (missingFeature) {
            throw new common_1.ForbiddenException(`Feature ${missingFeature} is not available in the current plan`);
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        companies_repository_1.CompaniesRepository,
        plans_repository_1.PlansRepository])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map