import { Model, Types } from 'mongoose';
import { DeviceTokenDocument } from './schemas/device-token.schema';
export declare class DevicesRepository {
    private readonly tokenModel;
    constructor(tokenModel: Model<DeviceTokenDocument>);
    upsertToken(tenantId: Types.ObjectId, userId: Types.ObjectId, token: string, platform: 'ios' | 'android' | 'web'): Promise<DeviceTokenDocument>;
    removeToken(token: string): Promise<void>;
    findTokensByUser(userId: Types.ObjectId): Promise<DeviceTokenDocument[]>;
}
