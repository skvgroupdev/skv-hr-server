import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceAdjustmentsRepository } from './attendance-adjustments.repository';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateAttendanceAdjustmentDto } from './dto/create-attendance-adjustment.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import type { AttendanceAdjustment } from './schemas/attendance-adjustment.schema';

@Injectable()
export class AttendanceAdjustmentsService {
  constructor(
    private readonly repository: AttendanceAdjustmentsRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(currentUser: JwtPayload, dto: CreateAttendanceAdjustmentDto) {
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findByUserIdAndTenant(
      new Types.ObjectId(currentUser.sub),
      tenantId,
    );
    if (!employee) throw new NotFoundException('Employee profile not found');
    if (!employee.branchId) {
      throw new BadRequestException('Employee must be assigned to a branch');
    }

    const workDate = new Date(dto.workDate);
    const requestedCheckTime = new Date(dto.requestedCheckTime);
    if (dateKey(workDate) !== dateKey(requestedCheckTime)) {
      throw new BadRequestException('requestedCheckTime must be on workDate');
    }

    let originalCheckTime: Date | undefined;
    let attendanceLogId: Types.ObjectId | undefined;
    if (dto.attendanceLogId) {
      const log = await this.attendanceRepository.findById(
        dto.attendanceLogId,
        tenantId,
      );
      if (
        !log ||
        log.employeeId.toString() !==
          (employee._id as Types.ObjectId).toString()
      ) {
        throw new NotFoundException('Attendance log not found');
      }
      if (log.type !== dto.type)
        throw new BadRequestException('Attendance type does not match');
      originalCheckTime = log.checkTime;
      attendanceLogId = log._id as Types.ObjectId;
    }

    try {
      const request = await this.repository.create({
        tenantId,
        employeeId: employee._id as Types.ObjectId,
        branchId: employee.branchId,
        attendanceLogId,
        type: dto.type,
        workDate,
        originalCheckTime,
        requestedCheckTime,
        reason: dto.reason,
        evidenceUrl: dto.evidenceUrl,
      });
      await this.auditLogService.log({
        tenantId,
        actorId: currentUser.sub,
        actorRole: currentUser.role,
        action: 'CREATE_ATTENDANCE_ADJUSTMENT_REQUEST',
        module: 'attendance-adjustments',
        targetId: request._id as Types.ObjectId,
        after: {
          type: dto.type,
          workDate,
          requestedCheckTime,
          reason: dto.reason,
        },
      });
      return request;
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        throw new BadRequestException(
          'A pending request already exists for this date and type',
        );
      }
      throw error;
    }
  }

  async getMine(currentUser: JwtPayload) {
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findByUserIdAndTenant(
      new Types.ObjectId(currentUser.sub),
      tenantId,
    );
    if (!employee) throw new NotFoundException('Employee profile not found');
    return this.repository.findByEmployee(
      tenantId,
      employee._id as Types.ObjectId,
    );
  }

  async listForReviewer(
    currentUser: JwtPayload,
    status?: AttendanceAdjustment['status'],
  ) {
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    if (currentUser.role === 'BRANCH_MANAGER') {
      if (!currentUser.branchId)
        throw new ForbiddenException('Branch assignment is required');
      return this.repository.findAll(
        tenantId,
        new Types.ObjectId(currentUser.branchId),
        status,
      );
    }
    return this.repository.findAll(tenantId, undefined, status);
  }

  async cancel(currentUser: JwtPayload, id: string) {
    const { tenantId, request } = await this.getOwnedPending(currentUser, id);
    return this.repository.update(id, tenantId, { status: 'CANCELLED' });
  }

  async approve(currentUser: JwtPayload, id: string, comment?: string) {
    const { tenantId, request } = await this.getReviewablePending(
      currentUser,
      id,
    );
    const correction = await this.attendanceRepository.create({
      tenantId,
      employeeId: request.employeeId,
      branchId: request.branchId,
      type: request.type,
      checkTime: request.requestedCheckTime,
      serverTime: new Date(),
      status: 'MANUAL_ADJUSTED',
      adjustedBy: new Types.ObjectId(currentUser.sub),
      adjustReason: request.reason,
      correctionFor: request.attendanceLogId,
    });
    const updated = await this.repository.update(id, tenantId, {
      status: 'APPROVED',
      correctionLogId: correction._id as Types.ObjectId,
      reviewedBy: new Types.ObjectId(currentUser.sub),
      reviewedAt: new Date(),
      reviewComment: comment,
    });
    await this.logReview(
      currentUser,
      request._id as Types.ObjectId,
      'APPROVED',
      comment,
    );
    return updated;
  }

  async reject(currentUser: JwtPayload, id: string, reason: string) {
    const { tenantId, request } = await this.getReviewablePending(
      currentUser,
      id,
    );
    const updated = await this.repository.update(id, tenantId, {
      status: 'REJECTED',
      reviewedBy: new Types.ObjectId(currentUser.sub),
      reviewedAt: new Date(),
      reviewComment: reason,
    });
    await this.logReview(
      currentUser,
      request._id as Types.ObjectId,
      'REJECTED',
      reason,
    );
    return updated;
  }

  private async getOwnedPending(currentUser: JwtPayload, id: string) {
    this.assertId(id);
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    const request = await this.repository.findById(id, tenantId);
    if (!request) throw new NotFoundException('Adjustment request not found');
    const employee = await this.employeesRepository.findByUserIdAndTenant(
      new Types.ObjectId(currentUser.sub),
      tenantId,
    );
    if (
      !employee ||
      request.employeeId.toString() !==
        (employee._id as Types.ObjectId).toString()
    ) {
      throw new ForbiddenException('Access denied');
    }
    if (request.status !== 'PENDING')
      throw new BadRequestException('Request is not pending');
    return { tenantId, request };
  }

  private async getReviewablePending(currentUser: JwtPayload, id: string) {
    this.assertId(id);
    if (currentUser.role !== 'BRANCH_MANAGER') {
      throw new ForbiddenException('Only branch managers can review requests');
    }
    if (!currentUser.branchId)
      throw new ForbiddenException('Branch assignment is required');
    const tenantId = new Types.ObjectId(currentUser.companyId!);
    const request = await this.repository.findById(id, tenantId);
    if (!request || request.branchId.toString() !== currentUser.branchId) {
      throw new NotFoundException('Adjustment request not found');
    }
    if (request.status !== 'PENDING')
      throw new BadRequestException('Request is not pending');
    return { tenantId, request };
  }

  private async logReview(
    user: JwtPayload,
    targetId: Types.ObjectId,
    status: string,
    comment?: string,
  ) {
    await this.auditLogService.log({
      tenantId: new Types.ObjectId(user.companyId!),
      actorId: user.sub,
      actorRole: user.role,
      action: `${status}_ATTENDANCE_ADJUSTMENT_REQUEST`,
      module: 'attendance-adjustments',
      targetId,
      after: { status, comment },
    });
  }

  private assertId(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('id is invalid');
  }
}

function dateKey(date: Date) {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}
