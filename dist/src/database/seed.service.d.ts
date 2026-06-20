import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../modules/users/schemas/user.schema';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly userModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>);
    onApplicationBootstrap(): Promise<void>;
    private seedSuperAdmin;
}
