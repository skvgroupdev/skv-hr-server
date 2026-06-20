import { DevicesService } from './devices.service';
import { RegisterTokenDto } from './dto/register-token.dto';
import { RemoveTokenDto } from './dto/remove-token.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    registerToken(dto: RegisterTokenDto, user: JwtPayload): Promise<{
        data: import("mongoose").Document<unknown, {}, import("./schemas/device-token.schema").DeviceToken, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/device-token.schema").DeviceToken & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    removeToken(dto: RemoveTokenDto): Promise<{
        message: string;
    }>;
}
