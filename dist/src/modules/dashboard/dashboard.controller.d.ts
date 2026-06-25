import { DashboardService } from './dashboard.service';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getTodayOverview(user: JwtPayload): Promise<{
        data: {
            leave: {
                employeeId: string;
                employee: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    employeeCode: string | undefined;
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
                    employeeCode: string | undefined;
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
                    employeeCode: string | undefined;
                } | null;
                status: "CANCELLED" | "PENDING" | "APPROVED" | "REJECTED";
                workDate: Date;
                type: string;
            }[];
        };
    }>;
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
