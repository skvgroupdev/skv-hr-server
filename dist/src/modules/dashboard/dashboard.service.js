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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dashboard_repository_1 = require("./dashboard.repository");
let DashboardService = class DashboardService {
    dashboardRepository;
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async getPendingCounts(currentUser) {
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        return this.dashboardRepository.countPendingRequests(tenantId);
    }
    async getDashboard(currentUser) {
        const tenantId = new mongoose_1.Types.ObjectId(currentUser.companyId);
        const [employees, todayCheckIns, pendingRequests, branches, recentEmployees, monthlySummary] = await Promise.all([
            this.dashboardRepository.countEmployees(tenantId),
            this.dashboardRepository.countTodayCheckIns(tenantId),
            this.dashboardRepository.countPendingRequests(tenantId),
            this.dashboardRepository.countBranches(tenantId),
            this.dashboardRepository.findRecentEmployees(tenantId, 5),
            this.dashboardRepository.getMonthlySummary(tenantId),
        ]);
        return { employees, todayCheckIns, pendingRequests, branches, recentEmployees, monthlySummary };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_repository_1.DashboardRepository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map