import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Shift, ShiftDocument } from './schemas/shift.schema';
import {
  ShiftAssignment,
  ShiftAssignmentDocument,
} from './schemas/shift-assignment.schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsRepository {
  constructor(
    @InjectModel(Shift.name) private readonly shiftModel: Model<ShiftDocument>,
    @InjectModel(ShiftAssignment.name)
    private readonly assignmentModel: Model<ShiftAssignmentDocument>,
  ) {}

  create(
    tenantId: Types.ObjectId,
    dto: CreateShiftDto,
  ): Promise<ShiftDocument> {
    return this.shiftModel.create({ ...dto, tenantId });
  }

  findAll(tenantId: Types.ObjectId): Promise<ShiftDocument[]> {
    return this.shiftModel
      .find({ tenantId, isActive: true })
      .sort({ name: 1 })
      .exec();
  }

  findById(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<ShiftDocument | null> {
    return this.shiftModel.findOne({ _id: id, tenantId }).exec();
  }

  update(
    id: string,
    tenantId: Types.ObjectId,
    dto: UpdateShiftDto,
  ): Promise<ShiftDocument | null> {
    return this.shiftModel
      .findOneAndUpdate({ _id: id, tenantId }, dto, { returnDocument: 'after' })
      .exec();
  }

  softDelete(
    id: string,
    tenantId: Types.ObjectId,
  ): Promise<ShiftDocument | null> {
    return this.shiftModel
      .findOneAndUpdate(
        { _id: id, tenantId },
        { isActive: false },
        { returnDocument: 'after' },
      )
      .exec();
  }

  createAssignment(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    shiftId: Types.ObjectId,
    effectiveDate: Date,
    endDate?: Date,
  ): Promise<ShiftAssignmentDocument> {
    return this.assignmentModel.create({
      tenantId,
      employeeId,
      shiftId,
      effectiveDate,
      endDate,
    });
  }

  findOverlappingAssignment(
    tenantId: Types.ObjectId,
    employeeId: Types.ObjectId,
    effectiveDate: Date,
    endDate?: Date,
  ): Promise<ShiftAssignmentDocument | null> {
    return this.assignmentModel
      .findOne({
        tenantId,
        employeeId,
        effectiveDate: {
          $lte: endDate ?? new Date('9999-12-31T23:59:59.999Z'),
        },
        $or: [
          { endDate: { $gte: effectiveDate } },
          { endDate: null },
          { endDate: { $exists: false } },
        ],
      })
      .exec();
  }

  findAssignmentsForRange(
    tenantId: Types.ObjectId,
    employeeIds: Types.ObjectId[],
    startDate: Date,
    endDate: Date,
  ): Promise<ShiftAssignmentDocument[]> {
    return this.assignmentModel
      .find({
        tenantId,
        employeeId: { $in: employeeIds },
        effectiveDate: { $lte: endDate },
        $or: [
          { endDate: { $gte: startDate } },
          { endDate: null },
          { endDate: { $exists: false } },
        ],
      })
      .populate('shiftId')
      .sort({ effectiveDate: 1 })
      .exec();
  }

  closeAssignment(
    id: Types.ObjectId,
    tenantId: Types.ObjectId,
    endDate: Date,
  ): Promise<ShiftAssignmentDocument | null> {
    return this.assignmentModel
      .findOneAndUpdate(
        { _id: id, tenantId },
        { endDate },
        { returnDocument: 'after' },
      )
      .exec();
  }

  updateAssignment(
    id: Types.ObjectId,
    tenantId: Types.ObjectId,
    shiftId: Types.ObjectId,
    effectiveDate: Date,
    endDate?: Date,
  ): Promise<ShiftAssignmentDocument | null> {
    return this.assignmentModel
      .findOneAndUpdate(
        { _id: id, tenantId },
        {
          $set: {
            shiftId,
            effectiveDate,
            ...(endDate ? { endDate } : {}),
          },
          ...(!endDate ? { $unset: { endDate: 1 } } : {}),
        },
        { returnDocument: 'after' },
      )
      .populate('shiftId')
      .exec();
  }

  async findCurrentAssignmentsByEmployeeIds(
    employeeIds: Types.ObjectId[],
    tenantId: Types.ObjectId,
  ): Promise<ShiftAssignmentDocument[]> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const assignments = (await this.assignmentModel
      .find({
        tenantId,
        employeeId: { $in: employeeIds },
        effectiveDate: { $lte: today },
        $or: [
          { endDate: { $gte: today } },
          { endDate: null },
          { endDate: { $exists: false } },
        ],
      })
      .sort({ effectiveDate: -1 })
      .populate('shiftId')
      .lean()
      .exec()) as unknown as ShiftAssignmentDocument[];

    // Keep only the latest assignment per employee
    const seen = new Set<string>();
    return assignments.filter((a) => {
      const empKey = a.employeeId.toString();
      if (seen.has(empKey)) return false;
      seen.add(empKey);
      return true;
    });
  }

  findAllAssignments(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<ShiftAssignmentDocument[]> {
    return this.assignmentModel
      .find({ employeeId, tenantId })
      .sort({ effectiveDate: -1 })
      .populate('shiftId')
      .exec();
  }

  findCurrentAssignment(
    employeeId: Types.ObjectId,
    tenantId: Types.ObjectId,
  ): Promise<ShiftAssignmentDocument | null> {
    // Use UTC midnight so the date boundary aligns with how effectiveDate is stored (UTC).
    // setHours(0,0,0,0) on a UTC server is correct, but using setUTCHours makes the
    // intent explicit and safe regardless of server TZ.
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return this.assignmentModel
      .findOne({
        employeeId,
        tenantId,
        effectiveDate: { $lte: today },
        $or: [
          { endDate: { $gte: today } },
          { endDate: null },
          { endDate: { $exists: false } },
        ],
      })
      .sort({ effectiveDate: -1 })
      .populate('shiftId')
      .exec();
  }
}
