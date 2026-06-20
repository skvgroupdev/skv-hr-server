import { Model, Types } from 'mongoose';
import { PositionDocument } from './schemas/position.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
interface PaginatedPositions {
    positions: PositionDocument[];
    total: number;
}
export declare class PositionsRepository {
    private readonly positionModel;
    constructor(positionModel: Model<PositionDocument>);
    create(tenantId: Types.ObjectId, dto: CreatePositionDto): Promise<PositionDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<PositionDocument | null>;
    findPaginated(tenantId: Types.ObjectId, page: number, limit: number, sort: string): Promise<PaginatedPositions>;
    update(id: string, tenantId: Types.ObjectId, dto: UpdatePositionDto): Promise<PositionDocument | null>;
    softDelete(id: string, tenantId: Types.ObjectId): Promise<PositionDocument | null>;
}
export {};
