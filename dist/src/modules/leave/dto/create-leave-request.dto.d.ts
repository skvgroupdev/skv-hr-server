export declare class CreateLeaveRequestDto {
    leaveTypeId?: string;
    leaveTypeName?: string;
    startDate: string;
    endDate: string;
    isHalfDay?: boolean;
    halfDayPeriod?: 'AM' | 'PM';
    reason: string;
    attachmentUrls?: string[];
}
