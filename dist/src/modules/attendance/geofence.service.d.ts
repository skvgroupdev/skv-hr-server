export declare class GeofenceService {
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    isInsideGeofence(employeeLat: number, employeeLon: number, branchLat: number, branchLon: number, radiusMeters: number): boolean;
}
