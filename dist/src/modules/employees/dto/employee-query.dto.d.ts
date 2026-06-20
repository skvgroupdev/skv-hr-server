import type { EmployeeStatus } from '../schemas/employee.schema';
export declare class EmployeeQueryDto {
    page?: string;
    limit?: string;
    sort?: string;
    branchId?: string;
    departmentId?: string;
    status?: EmployeeStatus;
    search?: string;
}
