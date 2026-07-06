import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ShiftsRepository } from './shifts.repository';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftDto } from './dto/assign-shift.dto';
import { BulkAssignShiftDto } from './dto/bulk-assign-shift.dto';
import { EmployeesRepository } from '../employees/employees.repository';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Injectable()
export class ShiftsService {
  constructor(
    private readonly shiftsRepository: ShiftsRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  async create(tenantId: string, dto: CreateShiftDto) {
    return this.shiftsRepository.create(new Types.ObjectId(tenantId), dto);
  }

  async findAll(tenantId: string) {
    return this.shiftsRepository.findAll(new Types.ObjectId(tenantId));
  }

  async findOne(tenantId: string, id: string) {
    const shift = await this.shiftsRepository.findById(
      id,
      new Types.ObjectId(tenantId),
    );
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }

  async update(tenantId: string, id: string, dto: UpdateShiftDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.shiftsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Shift not found');
    return this.shiftsRepository.update(id, tenantObjectId, dto);
  }

  async softDelete(tenantId: string, id: string) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const existing = await this.shiftsRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Shift not found');
    return this.shiftsRepository.softDelete(id, tenantObjectId);
  }

  async assignToEmployee(
    tenantId: string,
    shiftId: string,
    dto: AssignShiftDto,
  ) {
    this.assertObjectId(shiftId, 'shiftId');
    this.assertObjectId(dto.employeeId, 'employeeId');
    const tenantObjectId = new Types.ObjectId(tenantId);
    const shift = await this.shiftsRepository.findById(shiftId, tenantObjectId);
    if (!shift) throw new NotFoundException('Shift not found');

    const employee = await this.employeesRepository.findById(
      dto.employeeId,
      tenantObjectId,
    );
    if (!employee) throw new NotFoundException('Employee not found');

    const effectiveDate = new Date(dto.effectiveDate);
    const endDate = dto.endDate ? new Date(dto.endDate) : undefined;
    if (endDate && endDate < effectiveDate) {
      throw new BadRequestException(
        'endDate must be on or after effectiveDate',
      );
    }
    const overlap = await this.shiftsRepository.findOverlappingAssignment(
      tenantObjectId,
      employee._id as Types.ObjectId,
      effectiveDate,
      endDate,
    );
    if (overlap) {
      const existingStart = new Date(overlap.effectiveDate);
      const isOpenEnded = !overlap.endDate;
      if (existingStart.getTime() === effectiveDate.getTime()) {
        return this.shiftsRepository.updateAssignment(
          overlap._id as Types.ObjectId,
          tenantObjectId,
          new Types.ObjectId(shiftId),
          effectiveDate,
          endDate,
        );
      }
      if (!endDate && isOpenEnded && existingStart < effectiveDate) {
        const previousDay = new Date(effectiveDate);
        previousDay.setUTCDate(previousDay.getUTCDate() - 1);
        await this.shiftsRepository.closeAssignment(
          overlap._id as Types.ObjectId,
          tenantObjectId,
          previousDay,
        );
      } else {
        throw new BadRequestException(
          'Shift assignment overlaps an existing assignment',
        );
      }
    }

    return this.shiftsRepository.createAssignment(
      tenantObjectId,
      employee._id as Types.ObjectId,
      new Types.ObjectId(shiftId),
      effectiveDate,
      endDate,
    );
  }

  async getEmployeeShift(currentUser: JwtPayload, employeeId: string) {
    this.assertObjectId(employeeId, 'employeeId');
    const tenantId = currentUser.companyId!;
    const tenantObjectId = new Types.ObjectId(tenantId);
    const target = await this.employeesRepository.findById(
      employeeId,
      tenantObjectId,
    );
    if (!target) throw new NotFoundException('Employee not found');

    if (
      currentUser.role === 'STAFF' &&
      target.userId?.toString() !== currentUser.sub
    ) {
      throw new ForbiddenException('Access denied');
    }
    if (currentUser.role === 'BRANCH_MANAGER') {
      const targetBranchId = this.refId(target.branchId);
      if (!currentUser.branchId || targetBranchId !== currentUser.branchId) {
        throw new ForbiddenException('Access denied');
      }
    }
    if (currentUser.role === 'SUPERVISOR') {
      const actor = await this.employeesRepository.findByUserIdAndTenant(
        new Types.ObjectId(currentUser.sub),
        tenantObjectId,
      );
      const actorId = (actor?._id as Types.ObjectId | undefined)?.toString();
      if (
        !actorId ||
        (target.managerId?.toString() !== actorId &&
          target.supervisorId?.toString() !== actorId)
      ) {
        throw new ForbiddenException('Access denied');
      }
    }

    const assignment = await this.shiftsRepository.findCurrentAssignment(
      new Types.ObjectId(employeeId),
      tenantObjectId,
    );
    if (!assignment)
      throw new NotFoundException(
        'No shift assignment found for this employee',
      );
    return assignment;
  }

  async getEmployeeShiftHistory(currentUser: JwtPayload, employeeId: string) {
    this.assertObjectId(employeeId, 'employeeId');
    const tenantId = currentUser.companyId!;
    const tenantObjectId = new Types.ObjectId(tenantId);
    const target = await this.employeesRepository.findById(
      employeeId,
      tenantObjectId,
    );
    if (!target) throw new NotFoundException('Employee not found');

    if (
      currentUser.role === 'STAFF' &&
      target.userId?.toString() !== currentUser.sub
    ) {
      throw new ForbiddenException('Access denied');
    }
    if (currentUser.role === 'BRANCH_MANAGER') {
      const targetBranchId = this.refId(target.branchId);
      if (!currentUser.branchId || targetBranchId !== currentUser.branchId) {
        throw new ForbiddenException('Access denied');
      }
    }
    if (currentUser.role === 'SUPERVISOR') {
      const actor = await this.employeesRepository.findByUserIdAndTenant(
        new Types.ObjectId(currentUser.sub),
        tenantObjectId,
      );
      const actorId = (actor?._id as Types.ObjectId | undefined)?.toString();
      if (
        !actorId ||
        (target.managerId?.toString() !== actorId &&
          target.supervisorId?.toString() !== actorId)
      ) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.shiftsRepository.findAllAssignments(
      new Types.ObjectId(employeeId),
      tenantObjectId,
    );
  }

  async bulkAssignShift(user: JwtPayload, dto: BulkAssignShiftDto) {
    const tenantId = user.companyId!;
    const assignDto: AssignShiftDto = {
      employeeId: '',
      effectiveDate: dto.effectiveDate,
      endDate: dto.endDate,
    };

    const success: unknown[] = [];
    const failed: { employeeId: string; reason: string }[] = [];

    for (const employeeId of dto.employeeIds) {
      try {
        assignDto.employeeId = employeeId;
        const assignment = await this.assignToEmployee(
          tenantId,
          dto.shiftId,
          { ...assignDto },
        );
        success.push(assignment);
      } catch (err: unknown) {
        const reason =
          err instanceof Error ? err.message : 'Unknown error';
        failed.push({ employeeId, reason });
      }
    }

    return { success, failed };
  }

  private assertObjectId(value: string, field: string) {
    if (!Types.ObjectId.isValid(value))
      throw new BadRequestException(`${field} is invalid`);
  }

  private refId(value: unknown): string | null {
    if (!value) return null;
    if (
      typeof value === 'object' &&
      '_id' in (value as Record<string, unknown>)
    ) {
      return String((value as { _id: unknown })._id);
    }
    return String(value);
  }
}
