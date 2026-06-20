declare class LocationDto {
    coordinates: [number, number];
}
export declare class CreateBranchDto {
    name: string;
    code?: string;
    address?: string;
    location?: LocationDto;
    radiusMeters?: number;
    phone?: string;
    managerId?: string;
    isActive?: boolean;
    workingPolicy?: string;
}
export {};
