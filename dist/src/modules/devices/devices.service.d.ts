import { Types } from 'mongoose';
import { DevicesRepository } from './devices.repository';
import { RegisterTokenDto } from './dto/register-token.dto';
import { RemoveTokenDto } from './dto/remove-token.dto';
export declare class DevicesService {
    private readonly devicesRepository;
    constructor(devicesRepository: DevicesRepository);
    registerToken(tenantId: string, userId: string, dto: RegisterTokenDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/device-token.schema").DeviceToken, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/device-token.schema").DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    removeToken(dto: RemoveTokenDto): Promise<{
        message: string;
    }>;
    getTokensByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/device-token.schema").DeviceToken, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/device-token.schema").DeviceToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
