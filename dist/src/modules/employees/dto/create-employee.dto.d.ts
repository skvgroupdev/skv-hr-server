declare class EmergencyContactDto {
    name: string;
    phone: string;
    relation: string;
}
declare class AllowanceDto {
    name: string;
    amount: number;
}
export declare class CreateEmployeeDto {
    employeeCode?: string;
    firstName: string;
    lastName: string;
    firstNameEn?: string;
    lastNameEn?: string;
    nickname?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth?: string;
    phone: string;
    email?: string;
    address?: string;
    photoUrl?: string;
    nationality?: string;
    emergencyContact?: EmergencyContactDto;
    employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
    startDate?: string;
    probationEndDate?: string;
    branchId?: string;
    departmentId?: string;
    positionId?: string;
    managerId?: string;
    supervisorId?: string;
    baseSalary?: number;
    allowances?: AllowanceDto[];
    workingHoursPerMonth?: number;
    bankAccount?: string;
    paymentMethod?: string;
    role?: 'HR_ADMIN' | 'BRANCH_MANAGER' | 'SUPERVISOR' | 'STAFF';
    initialPassword?: string;
}
export {};
