import { Connection } from 'mongoose';
export declare class HealthController {
    private readonly connection;
    constructor(connection: Connection);
    check(): {
        status: string;
        db: string;
        timestamp: string;
    };
}
