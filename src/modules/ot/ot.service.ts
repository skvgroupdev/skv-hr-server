import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OTRepository } from './ot.repository';
import { EmployeesRepository } from '../employees/employees.repository';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UsersRepository } from '../users/users.repository';
import { UserRole } from '../users/schemas/user.schema';
import { CreateOTRequestDto } from './dto/create-ot-request.dto';
import { UpdateOTPolicyDto } from './dto/update-ot-policy.dto';
import { ApproveOTDto, RejectOTDto } from './dto/approve-ot.dto';
import { OTQueryDto } from './dto/ot-query.dto';

const MAX_LIMIT = 100;

@Injectable()
export class OTService {
  constructor(
    private readonly otRepository: OTRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getPolicy(tenantId: string) {
    const policy = await this.otRepository.getPolicy(new Types.ObjectId(tenantId));
    if (!policy) {
      // Return default policy if not set
      return { weekdayRate: 1.5, weekendRate: 2.0, holidayRate: 3.0, maxOtHoursPerDay: 4, minOtMinutes: 30, requirePreApproval: true };
    }
    return policy;
  }

  async updatePolicy(tenantId: string, dto: UpdateOTPolicyDto) {
    return this.otRepository.upsertPolicy(new Types.ObjectId(tenantId), dto);
  }

  async request(tenantId: string, userId: string, dto: CreateOTRequestDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    const policy = await this.getPolicy(tenantId);

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    if (endTime <= startTime) throw new BadRequestException('endTime must be after startTime');

    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const maxHours = (policy as { maxOtHoursPerDay: number }).maxOtHoursPerDay ?? 4;
    if (totalHours > maxHours) {
      throw new BadRequestException(`OT cannot exceed ${maxHours} hours per day`);
    }

    const otRequest = await this.otRepository.createRequest({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      date: new Date(dto.date),
      startTime,
      endTime,
      totalHours,
      reason: dto.reason,
    });

    const otRequestId = (otRequest._id as Types.ObjectId).toString();
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    await this.notifyManagersOnNewOTRequest(tenantObjectId, employee, employeeName, otRequestId);

    return otRequest;
  }

  async getMy(tenantId: string, userId: string, query: OTQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));

    const { items, total } = await this.otRepository.findByEmployee(
      tenantObjectId,
      employee._id as Types.ObjectId,
      page,
      limit,
    );

    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getPending(tenantId: string) {
    return this.otRepository.findPending(new Types.ObjectId(tenantId));
  }

  async getOne(tenantId: string, id: string) {
    const request = await this.otRepository.findById(id, new Types.ObjectId(tenantId));
    if (!request) throw new NotFoundException('OT request not found');
    return request;
  }

  async approve(tenantId: string, id: string, actorId: string, actorRole: string, dto: ApproveOTDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.otRepository.findById(id, tenantObjectId);
    if (!request) throw new NotFoundException('OT request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.otRepository.updateRequest(id, tenantObjectId, {
      status: 'APPROVED',
      approvalFlow: [
        ...request.approvalFlow,
        { approverId: new Types.ObjectId(actorId), role: actorRole, status: 'APPROVED', comment: dto.comment, approvedAt: new Date() },
      ],
    });

    await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
      otRequestId: id,
      status: 'APPROVED',
      comment: dto.comment,
    });

    return updated;
  }

  async reject(tenantId: string, id: string, actorId: string, actorRole: string, dto: RejectOTDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.otRepository.findById(id, tenantObjectId);
    if (!request) throw new NotFoundException('OT request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request is not pending');

    const updated = await this.otRepository.updateRequest(id, tenantObjectId, {
      status: 'REJECTED',
      approvalFlow: [
        ...request.approvalFlow,
        { approverId: new Types.ObjectId(actorId), role: actorRole, status: 'REJECTED', comment: dto.reason, approvedAt: new Date() },
      ],
    });

    await this.emitStatusChangedToEmployee(request.employeeId, tenantObjectId, {
      otRequestId: id,
      status: 'REJECTED',
      reason: dto.reason,
    });

    return updated;
  }

  async cancel(tenantId: string, id: string, userId: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const request = await this.otRepository.findById(id, tenantObjectId);
    if (!request) throw new NotFoundException('OT request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Only pending requests can be cancelled');

    const employee = await this.findEmployeeByUserId(userId, tenantObjectId);
    if (request.employeeId.toString() !== (employee._id as Types.ObjectId).toString()) {
      throw new ForbiddenException('You can only cancel your own OT requests');
    }

    return this.otRepository.updateRequest(id, tenantObjectId, { status: 'CANCELLED' });
  }

  async getReport(tenantId: string, query: OTQueryDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const filter: Record<string, unknown> = {};
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) (filter.date as Record<string, unknown>).$gte = new Date(query.startDate);
      if (query.endDate) (filter.date as Record<string, unknown>).$lte = new Date(query.endDate);
    }

    const { items, total } = await this.otRepository.findReport(tenantObjectId, filter, page, limit);
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  private async notifyManagersOnNewOTRequest(
    tenantId: Types.ObjectId,
    employee: Awaited<ReturnType<typeof this.findEmployeeByUserId>>,
    employeeName: string,
    otRequestId: string,
  ): Promise<void> {
    const payload = { type: 'OT_REQUEST', message: `ພະນັກງານ ${employeeName} ຂໍໂອທີ`, otRequestId };

    const managers = await this.usersRepository.findByRolesAndTenant(tenantId, [
      'HR_ADMIN' as UserRole,
      'COMPANY_OWNER' as UserRole,
    ]);
    for (const manager of managers) {
      this.notificationsGateway.sendToUser((manager._id as Types.ObjectId).toString(), 'notification:new', payload);
    }

    if (employee.branchId) {
      await this.notifyBranchManager(tenantId, employee.branchId, payload);
    }

    if (employee.supervisorId) {
      const supervisor = await this.employeesRepository.findById(employee.supervisorId.toString(), tenantId);
      if (supervisor?.userId) {
        this.notificationsGateway.sendToUser(supervisor.userId.toString(), 'notification:new', payload);
      }
    }
  }

  private async notifyBranchManager(tenantId: Types.ObjectId, branchId: Types.ObjectId, payload: unknown): Promise<void> {
    const branchManagers = await this.usersRepository.findByRolesAndTenant(tenantId, ['BRANCH_MANAGER' as UserRole]);
    for (const user of branchManagers) {
      const userBranchId = (user as unknown as Record<string, unknown>).branchId;
      if (userBranchId && userBranchId.toString() === branchId.toString()) {
        this.notificationsGateway.sendToUser((user._id as Types.ObjectId).toString(), 'notification:new', payload);
      }
    }
  }

  private async emitStatusChangedToEmployee(employeeId: Types.ObjectId, tenantId: Types.ObjectId, payload: unknown): Promise<void> {
    const employee = await this.employeesRepository.findById(employeeId.toString(), tenantId);
    if (employee?.userId) {
      this.notificationsGateway.sendToUser(employee.userId.toString(), 'ot:status_changed', payload);
    }
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
