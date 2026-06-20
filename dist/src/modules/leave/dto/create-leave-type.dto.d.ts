export declare class CreateLeaveTypeDto {
    name: string;
    code: string;
    defaultDaysPerYear?: number;
    isPaid?: boolean;
    category?: 'LEAVE' | 'REST_DAY';
    requireAttachment?: boolean;
}
