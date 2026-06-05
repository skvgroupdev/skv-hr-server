import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ShiftsRepository } from './shifts.repository';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftDto } from './dto/assign-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(private readonly shiftsRepository: ShiftsRepository) {}

  async create(tenantId: string, dto: CreateShiftDto) {
    return this.shiftsRepository.create(new Types.ObjectId(tenantId), dto);
  }

  async findAll(tenantId: string) {
    return this.shiftsRepository.findAll(new Types.ObjectId(tenantId));
  }

  async findOne(tenantId: string, id: string) {
    const shift = await this.shiftsRepository.findById(id, new Types.ObjectId(tenantId));
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

  async assignToEmployee(tenantId: string, shiftId: string, dto: AssignShiftDto) {
    const tenantObjectId = new Types.ObjectId(tenantId);
    const shift = await this.shiftsRepository.findById(shiftId, tenantObjectId);
    if (!shift) throw new NotFoundException('Shift not found');

    return this.shiftsRepository.createAssignment(
      tenantObjectId,
      new Types.ObjectId(dto.employeeId),
      new Types.ObjectId(shiftId),
      new Date(dto.effectiveDate),
      dto.endDate ? new Date(dto.endDate) : undefined,
    );
  }

  async getEmployeeShift(tenantId: string, employeeId: string) {
    const assignment = await this.shiftsRepository.findCurrentAssignment(
      new Types.ObjectId(employeeId),
      new Types.ObjectId(tenantId),
    );
    if (!assignment) throw new NotFoundException('No shift assignment found for this employee');
    return assignment;
  }
}
