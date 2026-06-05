import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { LeaveRepository } from './leave.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ApproveLeaveDto, RejectLeaveDto } from './dto/approve-leave.dto';
import { LeaveBalanceAdjustDto } from './dto/leave-balance-adjust.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import { LeaveRequestDocument } from './schemas/leave-request.schema';

const MAX_LIMIT = 100;

function countWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveRepository: LeaveRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Leave Types
  async createLeaveType(tenantId: string, dto: CreateLeaveTypeDto) {
    return this.leaveRepository.createLeaveType({
      tenantId: new Types.ObjectId(tenantId),
      ...dto,
      defaultDaysPerYear: dto.defaultDaysPerYear ?? 0,
    });
  }

  async findAllLeaveTypes(tenantId: string) {
    return this.leaveRepository.findAllLeaveTypes(new Types.ObjectId(tenantId));
  }

  async updateLeaveType(tenantId: string, id: string, dto: Partial<CreateLeaveTypeDto>) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.leaveRepository.findLeaveTypeById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Leave type not found');
    return this.leaveRepository.updateLeaveType(id, tenantObjectId, dto);
  }

  async deleteLeaveType(tenantId: string, id: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.leaveRepository.findLeaveTypeById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Leave type not found');
    return this.leaveRepository.softDeleteLeaveType(id, tenantObjectId);
  }

  // Leave Requests
  async request(tenantId: string, userId: string, dto: CreateLeaveRequestDto) {
    if (!dto.leaveTypeId && !dto.leaveTypeName) {
      throw new BadRequestException('Either leaveTypeId or leaveTypeName is required');
    }

    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) throw new BadRequestException('End date must be after start date');

    const overlapping = await this.leaveRepository.findOverlapping(
      tenantObjectId,
      employee._id as Types.ObjectId,
      startDate,
      endDate,
    );
    if (overlapping) throw new ConflictException('Leave request overlaps with existing request');

    const totalDays = dto.isHalfDay ? 0.5 : countWorkingDays(startDate, endDate);

    return this.leaveRepository.createRequest({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      ...(dto.leaveTypeId && { leaveTypeId: new Types.ObjectId(dto.leaveTypeId) }),
      leaveTypeName: dto.leaveTypeName,
      startDate,
      endDate,
      totalDays,
      isHalfDay: dto.isHalfDay ?? false,
      halfDayPeriod: dto.halfDayPeriod,
      reason: dto.reason,
      attachmentUrls: dto.attachmentUrls ?? [],
    });
  }

  async getMy(tenantId: string, userId: string, query: LeaveQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));

    const { items, total } = await this.leaveRepository.findRequestsByEmployee(
      tenantObjectId,
      employee._id as Types.ObjectId,
      page,
      limit,
    );

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getPending(tenantId: string) {
    const docs = await this.leaveRepository.findPendingRequests(new Types.ObjectId(tenantId));
    return docs.map((doc) => this.toResponse(doc));
  }

  async getOne(tenantId: string, id: string) {
    const request = await this.leaveRepository.findRequestById(id, new Types.ObjectId(tenantId));
    if (!request) throw new NotFoundException('Leave request not found');
    return request;
  }

  async approve(tenantId: string, id: string, actorId: string, actorRole: string, dto: ApproveLeaveDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updatedRequest = await this.leaveRepository.updateRequest(id, tenantObjectId, {
      status: 'APPROVED',
      approvals: [
        ...request.approvals,
        {
          approverId: new Types.ObjectId(actorId),
          role: actorRole,
          status: 'APPROVED',
          comment: dto.comment,
          approvedAt: new Date(),
        },
      ],
    });

    // Deduct leave balance (skip when no leaveTypeId — name-only leave type)
    if (request.leaveTypeId) {
      await this.leaveRepository.upsertBalance(
        tenantObjectId,
        request.employeeId,
        request.leaveTypeId,
        new Date(request.startDate).getFullYear(),
        request.totalDays,
      );
    }

    await this.notifyEmployee(request.employeeId, tenantObjectId, {
      title: 'ຄຳຮ້ອງລາພັກໄດ້ຮັບການອນຸມັດ',
      body: dto.comment ? `ໝາຍເຫດ: ${dto.comment}` : 'ຄຳຮ້ອງລາພັກຂອງທ່ານໄດ້ຮັບການອນຸມັດແລ້ວ',
      type: 'LEAVE_APPROVED' as NotificationType,
      data: { leaveRequestId: id },
    });

    return updatedRequest;
  }

  async reject(tenantId: string, id: string, actorId: string, actorRole: string, dto: RejectLeaveDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updatedRequest = await this.leaveRepository.updateRequest(id, tenantObjectId, {
      status: 'REJECTED',
      approvals: [
        ...request.approvals,
        {
          approverId: new Types.ObjectId(actorId),
          role: actorRole,
          status: 'REJECTED',
          comment: dto.reason,
          approvedAt: new Date(),
        },
      ],
    });

    await this.notifyEmployee(request.employeeId, tenantObjectId, {
      title: 'ຄຳຮ້ອງລາພັກຖືກປະຕິເສດ',
      body: dto.reason ?? 'ຄຳຮ້ອງລາພັກຂອງທ່ານຖືກປະຕິເສດ',
      type: 'LEAVE_REJECTED' as NotificationType,
      data: { leaveRequestId: id },
    });

    return updatedRequest;
  }

  async cancel(tenantId: string, id: string, userId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.leaveRepository.findRequestById(id, tenantObjectId);
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Only pending requests can be cancelled');

    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    if (request.employeeId.toString() !== (employee._id as Types.ObjectId).toString()) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    return this.leaveRepository.updateRequest(id, tenantObjectId, { status: 'CANCELLED' });
  }

  async getReport(tenantId: string, query: LeaveQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.leaveTypeId) filter.leaveTypeId = new Types.ObjectId(query.leaveTypeId);
    if (query.startDate || query.endDate) {
      filter.startDate = {};
      if (query.startDate) (filter.startDate as Record<string, unknown>).$gte = new Date(query.startDate);
      if (query.endDate) (filter.startDate as Record<string, unknown>).$lte = new Date(query.endDate);
    }

    const { items, total } = await this.leaveRepository.findReport(tenantObjectId, filter, page, limit);
    return { data: items.map((doc) => this.toResponse(doc)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getMyBalance(tenantId: string, userId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    return this.leaveRepository.findBalancesByEmployee(tenantObjectId, employee._id as Types.ObjectId);
  }

  async getEmployeeBalance(tenantId: string, employeeId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.leaveRepository.findBalancesByEmployee(tenantObjectId, employee._id as Types.ObjectId);
  }

  async adjustBalance(tenantId: string, employeeId: string, dto: LeaveBalanceAdjustDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');

    const year = dto.year ?? new Date().getFullYear();
    return this.leaveRepository.adjustBalance(
      tenantObjectId,
      employee._id as Types.ObjectId,
      new Types.ObjectId(dto.leaveTypeId),
      year,
      dto.adjustment,
    );
  }

  private async notifyEmployee(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    payload: { title: string; body: string; type: NotificationType; data?: Record<string, unknown> },
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employeeId.toString(), tenantId);
    // Skip notification if employee has no linked user account
    if (!employee?.userId) return;

    await this.notificationsService.notify(employee.userId, {
      ...payload,
      tenantId,
    });
  }

  private toResponse(doc: LeaveRequestDocument) {
    const obj = doc.toJSON() as unknown as Record<string, unknown>;

    const emp = obj.employeeId as Record<string, unknown> | string | undefined;
    if (emp && typeof emp === 'object') {
      obj.employee = {
        id: emp['id'],
        firstName: emp['firstName'],
        lastName: emp['lastName'],
        phone: emp['phone'],
        fullName: `${emp['firstName'] ?? ''} ${emp['lastName'] ?? ''}`.trim(),
      };
      obj.employeeId = String(emp['id'] ?? '');
    }

    const lt = obj.leaveTypeId as Record<string, unknown> | string | undefined;
    if (lt && typeof lt === 'object') {
      obj.leaveType = { id: lt['id'], name: lt['name'], code: lt['code'] };
      obj.leaveTypeId = String(lt['id'] ?? '');
    } else if (!lt && obj.leaveTypeName) {
      // leaveTypeId not set — frontend sent leaveTypeName directly
      obj.leaveType = { id: null, name: obj.leaveTypeName, code: null };
    }

    return obj;
  }

  private async findEmployeeByUserId(userId: string, tenantId: Types.ObjectId) {
    const { employees } = await this.employeesRepository.findPaginated(
      { tenantId, userId: new Types.ObjectId(userId) } as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      1,
      1,
      '-createdAt',
    );
    if (!employees[0]) throw new NotFoundException('Employee profile not found');
    return employees[0];
  }
}
