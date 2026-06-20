import { Model, Types } from 'mongoose';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
export declare class AnnouncementsRepository {
    private readonly model;
    constructor(model: Model<AnnouncementDocument>);
    create(data: Partial<Announcement>): Promise<AnnouncementDocument>;
    findById(id: string, tenantId: Types.ObjectId): Promise<AnnouncementDocument | null>;
    findAll(tenantId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    findPublishedFeed(tenantId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Announcement, {}, import("mongoose").DefaultSchemaOptions> & Announcement & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    update(id: string, tenantId: Types.ObjectId, data: Partial<Announcement>): Promise<AnnouncementDocument | null>;
    softDelete(id: string, tenantId: Types.ObjectId): Promise<AnnouncementDocument | null>;
    markRead(id: string, userId: Types.ObjectId): Promise<AnnouncementDocument | null>;
}
