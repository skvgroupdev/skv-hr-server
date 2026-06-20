import { Model, Types } from 'mongoose';
import { HolidayDocument } from './schemas/holiday.schema';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
export declare class HolidaysRepository {
    private readonly holidayModel;
    constructor(holidayModel: Model<HolidayDocument>);
    create(tenantId: Types.ObjectId, dto: CreateHolidayDto): Promise<HolidayDocument>;
    findAll(tenantId: Types.ObjectId, year?: number): Promise<HolidayDocument[]>;
    findById(id: string, tenantId: Types.ObjectId): Promise<HolidayDocument | null>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdateHolidayDto): Promise<HolidayDocument | null>;
    softDelete(id: string, tenantId: Types.ObjectId): Promise<HolidayDocument | null>;
    findByDateRange(tenantId: Types.ObjectId, startDate: Date, endDate: Date): Promise<HolidayDocument[]>;
}
