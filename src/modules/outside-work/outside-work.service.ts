import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OutsideWorkRepository } from './outside-work.repository';
import { OutsideWorkDocument } from './schemas/outside-work.schema';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { CreateOutsideWorkDto } from './dto/create-outside-work.dto';
import { ApproveOutsideWorkDto, RejectOutsideWorkDto } from './dto/approve-outside-work.dto';
import { OutsideWorkQueryDto } from './dto/outside-work-query.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationType } from '../notifications/schemas/notification.schema';
import { UsersRepository } from '../users/users.repository';
import { UserRole } from '../users/schemas/user.schema';

const MAX_LIMIT = 100;

@Injectable()
export class OutsideWorkService {
  constructor(
    private readonly outsideWorkRepository: OutsideWorkRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly usersRepository: UsersRepository,
  ) {}

  async request(tenantId: string, userId: string, dto: CreateOutsideWorkDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);

    const location =
      dto.lat !== undefined && dto.lng !== undefined
        ? { type: 'Point' as const, coordinates: [dto.lng, dto.lat] as [number, number] }
        : undefined;

    const outsideWork = await this.outsideWorkRepository.create({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      outsideType: dto.outsideType,
      reason: dto.reason,
      locationName: dto.locationName,
      location,
      gpsAccuracy: dto.gpsAccuracy,
      photoUrls: dto.photoUrls ?? [],
      attendanceLogId: dto.attendanceLogId ? new Types.ObjectId(dto.attendanceLogId) : undefined,
    });

    const outsideWorkId = (outsideWork._id as Types.ObjectId).toString();
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    await this.notifyManagersOnNewRequest(tenantObjectId, employee, employeeName, outsideWorkId);

    return outsideWork;
  }

  async getMy(tenantId: string, userId: string, query: OutsideWorkQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));

    const { items, total } = await this.outsideWorkRepository.findByEmployee(
      tenantObjectId,
      employee._id as Types.ObjectId,
      page,
      limit,
    );

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getPending(tenantId: string) {
    const docs = await this.outsideWorkRepository.findPending(new Types.ObjectId(tenantId));
    return docs.map((doc) => this.toResponse(doc));
  }

  async getOne(tenantId: string, id: string) {
    const item = await this.outsideWorkRepository.findById(id, new Types.ObjectId(tenantId));
    if (!item) throw new NotFoundException('Outside work request not found');
    return item;
  }

  async approve(tenantId: string, id: string, actorId: string, dto: ApproveOutsideWorkDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const item = await this.outsideWorkRepository.findById(id, tenantObjectId);
    if (!item) throw new NotFoundException('Outside work request not found');
    if (item.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.outsideWorkRepository.update(id, tenantObjectId, {
      status: 'APPROVED',
      approvedBy: new Types.ObjectId(actorId),
      approvedAt: new Date(),
    });

    // Update linked attendance log status
    if (item.attendanceLogId) {
      await this.attendanceRepository.updateStatus(
        item.attendanceLogId.toString(),
        'OUTSIDE_APPROVED',
      );
    }

    await this.notifyEmployee(item.employeeId, tenantObjectId, {
      title: 'ຄຳຮ້ອງອອກວຽກນອກໄດ້ຮັບການອະນຸມັດ',
      body: dto.comment ? `ໝາຍເຫດ: ${dto.comment}` : 'ຄຳຮ້ອງຂອງທ່ານໄດ້ຮັບການອະນຸມັດແລ້ວ',
      type: 'OUTSIDE_WORK_APPROVED' as NotificationType,
      data: { outsideWorkId: id },
    });

    await this.emitStatusChangedToEmployee(item.employeeId, tenantObjectId, {
      outsideWorkId: id,
      status: 'APPROVED',
      approverName: actorId,
      comment: dto.comment,
    });

    return updated;
  }

  async reject(tenantId: string, id: string, actorId: string, dto: RejectOutsideWorkDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const item = await this.outsideWorkRepository.findById(id, tenantObjectId);
    if (!item) throw new NotFoundException('Outside work request not found');
    if (item.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.outsideWorkRepository.update(id, tenantObjectId, {
      status: 'REJECTED',
      rejectedBy: new Types.ObjectId(actorId),
      rejectedAt: new Date(),
      rejectReason: dto.reason,
    });

    await this.notifyEmployee(item.employeeId, tenantObjectId, {
      title: 'ຄຳຮ້ອງອອກວຽກນອກຖືກປະຕິເສດ',
      body: dto.reason ?? 'ຄຳຮ້ອງຂອງທ່ານຖືກປະຕິເສດ',
      type: 'OUTSIDE_WORK_REJECTED' as NotificationType,
      data: { outsideWorkId: id },
    });

    await this.emitStatusChangedToEmployee(item.employeeId, tenantObjectId, {
      outsideWorkId: id,
      status: 'REJECTED',
      reason: dto.reason,
    });

    return updated;
  }

  async getReport(tenantId: string, query: OutsideWorkQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.startDate);
      if (query.endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(query.endDate);
    }

    const { items, total } = await this.outsideWorkRepository.findReport(tenantObjectId, filter, page, limit);
    return { data: items.map((doc) => this.toResponse(doc)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  private async notifyManagersOnNewRequest(
    tenantId: Types.ObjectId,
    employee: Awaited<ReturnType<typeof this.findEmployeeByUserId>>,
    employeeName: string,
    outsideWorkId: string,
  ): Promise<void> {
    const notifyPayload = {
      type: 'OUTSIDE_WORK_REQUEST',
      message: `ພະນັກງານ ${employeeName} ຂໍອອກນອກສະຖານທີ່`,
      outsideWorkId,
    };

    // Notify HR_ADMIN and COMPANY_OWNER
    const managers = await this.usersRepository.findByRolesAndTenant(tenantId, [
      'HR_ADMIN' as UserRole,
      'COMPANY_OWNER' as UserRole,
    ]);
    for (const manager of managers) {
      this.notificationsGateway.sendToUser(
        (manager._id as Types.ObjectId).toString(),
        'notification:new',
        notifyPayload,
      );
    }

    // Notify BRANCH_MANAGER of employee's branch
    if (employee.branchId) {
      await this.notifyBranchManager(tenantId, employee.branchId, notifyPayload);
    }

    // Notify SUPERVISOR directly linked to employee
    if (employee.supervisorId) {
      const supervisor = await this.employeesRepository.findById(
        employee.supervisorId.toString(),
        tenantId,
      );
      if (supervisor?.userId) {
        this.notificationsGateway.sendToUser(
          supervisor.userId.toString(),
          'notification:new',
          notifyPayload,
        );
      }
    }
  }

  private async notifyBranchManager(
    tenantId: Types.ObjectId,
    branchId: Types.ObjectId,
    payload: unknown,
  ): Promise<void> {
    const branchManagers = await this.usersRepository.findByRolesAndTenant(tenantId, [
      'BRANCH_MANAGER' as UserRole,
    ]);
    for (const user of branchManagers) {
      const userBranchId = (user as unknown as Record<string, unknown>).branchId;
      if (userBranchId && userBranchId.toString() === branchId.toString()) {
        this.notificationsGateway.sendToUser(
          (user._id as Types.ObjectId).toString(),
          'notification:new',
          payload,
        );
      }
    }
  }

  private async emitStatusChangedToEmployee(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
    payload: unknown,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(employeeId.toString(), tenantId);
    if (employee?.userId) {
      this.notificationsGateway.sendToUser(
        employee.userId.toString(),
        'outside-work:status_changed',
        payload,
      );
    }
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

  private toResponse(doc: OutsideWorkDocument) {
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
