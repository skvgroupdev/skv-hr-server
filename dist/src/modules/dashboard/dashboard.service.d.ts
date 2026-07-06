import { DashboardRepository } from './dashboard.repository';
import type { DashboardDto } from './dto/dashboard.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class DashboardService {
    private readonly dashboardRepository;
    constructor(dashboardRepository: DashboardRepository);
    getTodayOverview(currentUser: JwtPayload): Promise<{
        leave: {
            employeeId: string;
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                nickname: string | undefined;
                employeeCode: string | undefined;
                phone: string | undefined;
                branchName: string | undefined;
            } | null;
            status: "CANCELLED" | "PENDING" | "APPROVED" | "REJECTED";
            leaveTypeName: string | null;
        }[];
        outsideWork: {
            employeeId: string;
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                nickname: string | undefined;
                employeeCode: string | undefined;
                phone: string | undefined;
                branchName: string | undefined;
            } | null;
            status: "PENDING" | "APPROVED" | "REJECTED";
            outsideType: string;
        }[];
        adjustments: {
            employeeId: string;
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                nickname: string | undefined;
                employeeCode: string | undefined;
                phone: string | undefined;
                branchName: string | undefined;
            } | null;
            status: "CANCELLED" | "PENDING" | "APPROVED" | "REJECTED";
            workDate: Date;
            type: string;
        }[];
    }>;
    getPendingCounts(currentUser: JwtPayload): Promise<{
        leave: number;
        ot: number;
        outsideWork: number;
    }>;
    getDashboard(currentUser: JwtPayload): Promise<DashboardDto>;
}
