import { DashboardRepository } from './dashboard.repository';
import type { DashboardDto } from './dto/dashboard.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class DashboardService {
    private readonly dashboardRepository;
    constructor(dashboardRepository: DashboardRepository);
    getPendingCounts(currentUser: JwtPayload): Promise<{
        leave: number;
        ot: number;
        outsideWork: number;
    }>;
    getDashboard(currentUser: JwtPayload): Promise<DashboardDto>;
}
