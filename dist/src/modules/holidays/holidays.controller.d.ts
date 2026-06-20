import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidayQueryDto } from './dto/holiday-query.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class HolidaysController {
    private readonly holidaysService;
    constructor(holidaysService: HolidaysService);
    create(dto: CreateHolidayDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(query: HolidayQueryDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, dto: UpdateHolidayDto, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    softDelete(id: string, user: JwtPayload): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/holiday.schema").Holiday, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
}
