export declare class CreateAttendanceAdjustmentDto {
    attendanceLogId?: string;
    type: 'CHECK_IN' | 'CHECK_OUT';
    workDate: string;
    requestedCheckTime: string;
    reason: string;
    evidenceUrl?: string;
}
