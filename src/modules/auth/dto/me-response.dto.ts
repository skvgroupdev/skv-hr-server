export interface RefDto {
  id: string;
  name: string;
}

export interface PositionRefDto extends RefDto {
  banding?: string;
}

export interface WorkScheduleDto {
  startTime: string;
  endTime: string;
}

export interface MeResponseDto {
  // User fields
  id: string;
  phone: string;
  name: string;
  role: string;
  companyId: string | null;
  branchId: string | null;

  // Employee fields (optional — absent for SUPER_ADMIN / users without linked employee)
  employeeId?: string;
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  bankName?: string;
  bankAccount?: string;
  position?: PositionRefDto;
  department?: RefDto;
  branch?: RefDto;
  startDate?: string;
  employmentType?: string;
  status?: string;
  workSchedule?: WorkScheduleDto;
}
