import { DashboardService } from './dashboard.service';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getPendingCounts(user: JwtPayload): Promise<{
        data: {
            leave: number;
            ot: number;
            outsideWork: number;
        };
    }>;
    getDashboard(user: JwtPayload): Promise<{
        data: import("./dto/dashboard.dto").DashboardDto;
    }>;
}
