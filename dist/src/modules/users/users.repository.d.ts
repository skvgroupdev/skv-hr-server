import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
export declare class UsersRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument | null>;
    findByIdWithSensitive(id: string): Promise<UserDocument | null>;
    private phoneVariants;
    findByPhoneAndCompany(phone: string, companyId: Types.ObjectId | null): Promise<UserDocument | null>;
    findAllByPhone(phone: string): Promise<UserDocument[]>;
    create(data: Partial<User>): Promise<UserDocument>;
    deleteById(userId: string): Promise<void>;
    updateRefreshToken(userId: string, hashedToken: string | null): Promise<void>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    updatePhone(userId: string, phone: string): Promise<void>;
    updateRole(userId: string, role: string): Promise<void>;
    updateRoleAndBranch(userId: string, companyId: Types.ObjectId, role: string, branchId: Types.ObjectId): Promise<void>;
    findByCompanyId(companyId: Types.ObjectId): Promise<UserDocument[]>;
    findByRolesAndTenant(companyId: Types.ObjectId, roles: UserRole[]): Promise<UserDocument[]>;
    existsByPhoneAndCompany(phone: string, companyId: Types.ObjectId | null): Promise<boolean>;
}
