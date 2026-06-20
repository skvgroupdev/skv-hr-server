import { Types } from 'mongoose';
import { HolidaysRepository } from './holidays.repository';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidayQueryDto } from './dto/holiday-query.dto';
export declare class HolidaysService {
    private readonly holidaysRepository;
    constructor(holidaysRepository: HolidaysRepository);
    create(tenantId: string, dto: CreateHolidayDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(tenantId: string, query: HolidayQueryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(tenantId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateHolidayDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    softDelete(tenantId: string, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
