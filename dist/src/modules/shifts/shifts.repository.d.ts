import { Model, Types } from 'mongoose';
import { ShiftDocument } from './schemas/shift.schema';
import { ShiftAssignmentDocument } from './schemas/shift-assignment.schema';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
export declare class ShiftsRepository {
    private readonly shiftModel;
    private readonly assignmentModel;
    constructor(shiftModel: Model<ShiftDocument>, assignmentModel: Model<ShiftAssignmentDocument>);
    create(tenantId: Types.ObjectId, dto: CreateShiftDto): Promise<ShiftDocument>;
    findAll(tenantId: Types.ObjectId): Promise<ShiftDocument[]>;
    findById(id: string, tenantId: Types.ObjectId): Promise<ShiftDocument | null>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdateShiftDto): Promise<ShiftDocument | null>;
    softDelete(id: string, tenantId: Types.ObjectId): Promise<ShiftDocument | null>;
    createAssignment(tenantId: Types.ObjectId, employeeId: Types.ObjectId, shiftId: Types.ObjectId, effectiveDate: Date, endDate?: Date): Promise<ShiftAssignmentDocument>;
    findOverlappingAssignment(tenantId: Types.ObjectId, employeeId: Types.ObjectId, effectiveDate: Date, endDate?: Date): Promise<ShiftAssignmentDocument | null>;
    findAssignmentsForRange(tenantId: Types.ObjectId, employeeIds: Types.ObjectId[], startDate: Date, endDate: Date): Promise<ShiftAssignmentDocument[]>;
    closeAssignment(id: Types.ObjectId, tenantId: Types.ObjectId, endDate: Date): Promise<ShiftAssignmentDocument | null>;
    findCurrentAssignmentsByEmployeeIds(employeeIds: Types.ObjectId[], tenantId: Types.ObjectId): Promise<ShiftAssignmentDocument[]>;
    findAllAssignments(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<ShiftAssignmentDocument[]>;
    findCurrentAssignment(employeeId: Types.ObjectId, tenantId: Types.ObjectId): Promise<ShiftAssignmentDocument | null>;
}
