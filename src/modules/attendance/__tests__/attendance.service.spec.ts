import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceService } from '../attendance.service';
import { AttendanceRepository } from '../attendance.repository';
import { GeofenceService } from '../geofence.service';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import { EmployeesRepository } from '../../employees/employees.repository';
import { BranchesRepository } from '../../branches/branches.repository';
import { ShiftsRepository } from '../../shifts/shifts.repository';
import { NotificationsService } from '../../notifications/notifications.service';

// Pre-generate IDs outside tests so Date.now isn't mocked when creating them
const TENANT_ID = new Types.ObjectId().toHexString();
const USER_ID = new Types.ObjectId().toHexString();

function makeMockEmployee(branchId?: Types.ObjectId) {
  return {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    branchId: branchId ?? null,
    baseSalary: 5000000,
    allowances: [],
    workingHoursPerMonth: 208,
  };
}

function makeMockBranch(lat = 17.97, lng = 102.63, radius = 200) {
  return {
    _id: new Types.ObjectId(),
    radiusMeters: radius,
    location: { type: 'Point', coordinates: [lng, lat] },
  };
}

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockAttendanceRepository = {
    create: jest.fn(),
    findTodayCheckIn: jest.fn(),
    findTodayLogs: jest.fn(),
    updateLog: jest.fn(),
    findById: jest.fn(),
    findPaginated: jest.fn(),
    findDailyPaginated: jest.fn(),
    findByDateRange: jest.fn(),
    findByStatus: jest.fn(),
    updateStatus: jest.fn(),
    findByType: jest.fn(),
  };

  const mockGeofenceService = {
    calculateDistance: jest.fn(),
    isInsideGeofence: jest.fn(),
  };

  const mockAuditLogService = { log: jest.fn() };

  const mockEmployeesRepository = {
    findPaginated: jest.fn(),
    findById: jest.fn(),
    findByUserIdAndTenant: jest.fn(),
  };

  const mockBranchesRepository = {
    findById: jest.fn(),
  };

  const mockShiftsRepository = {
    findCurrentAssignment: jest.fn(),
  };

  const mockNotificationsService = {
    notify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: AttendanceRepository, useValue: mockAttendanceRepository },
        { provide: GeofenceService, useValue: mockGeofenceService },
        { provide: AuditLogService, useValue: mockAuditLogService },
        { provide: EmployeesRepository, useValue: mockEmployeesRepository },
        { provide: BranchesRepository, useValue: mockBranchesRepository },
        { provide: ShiftsRepository, useValue: mockShiftsRepository },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    jest.clearAllMocks();
  });

  describe('checkIn', () => {
    it('should return blocked=true when employee is outside geofence', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch(17.97, 102.63, 100);

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(500); // 500m > 100m radius

      const result = await service.checkIn(TENANT_ID, USER_ID, { lat: 17.98, lng: 102.64, gpsAccuracy: 5 });

      expect(result).toMatchObject({ blocked: true });
      expect(result.distanceFromBranch).toBeGreaterThan(0);
      expect(mockAttendanceRepository.create).not.toHaveBeenCalled();
    });

    it('should create check-in log when employee is inside geofence', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch(17.97, 102.63, 200);
      const mockLog = { _id: new Types.ObjectId(), type: 'CHECK_IN', status: 'NORMAL' };

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50); // 50m < 200m radius
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment.mockResolvedValue(null);
      mockAttendanceRepository.create.mockResolvedValue(mockLog);

      const result = await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63, gpsAccuracy: 5 });

      expect(result).toEqual(mockLog);
      expect(mockAttendanceRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw 400 when employee already checked in today', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const existingLog = { _id: new Types.ObjectId(), type: 'CHECK_IN' };

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(10);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(existingLog);

      await expect(
        service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should mark status as LATE when checking in 45 min after shift start', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();

      // shift 08:00, check-in at 08:45 (45 min late → LATE)
      const lateDate = new Date();
      lateDate.setHours(8, 45, 0, 0);
      jest.useFakeTimers({ now: lateDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '08:00' } });
      mockAttendanceRepository.create.mockImplementation((data) => Promise.resolve(data));

      await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      const createCall = mockAttendanceRepository.create.mock.calls[0][0];
      expect(createCall.status).toBe('LATE');
    });

    it('should throw NotFoundException when employee profile not found', async () => {
      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(null);

      await expect(
        service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should mark status as NORMAL when checking in on time', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();

      // shift 08:00, check-in exactly at 08:00
      const onTimeDate = new Date();
      onTimeDate.setHours(8, 0, 0, 0);
      jest.useFakeTimers({ now: onTimeDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '08:00' } });
      mockAttendanceRepository.create.mockImplementation((data) => Promise.resolve(data));

      await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      const createCall = mockAttendanceRepository.create.mock.calls[0][0];
      expect(createCall.status).toBe('NORMAL');
    });

    it('should mark status as LATE_MINOR when checking in 15 min after shift start', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();

      // shift 08:00, check-in at 08:15 (15 min late → LATE_MINOR, < 30 min threshold)
      const lateMinorDate = new Date();
      lateMinorDate.setHours(8, 15, 0, 0);
      jest.useFakeTimers({ now: lateMinorDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '08:00' } });
      mockAttendanceRepository.create.mockImplementation((data) => Promise.resolve(data));

      await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      const createCall = mockAttendanceRepository.create.mock.calls[0][0];
      expect(createCall.status).toBe('LATE_MINOR');
    });

    it('should mark status as LATE when checking in at 20:00 Bangkok with shift 09:00', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();

      // Simulate server running UTC: 20:00 Bangkok = 13:00 UTC
      // Without timezone fix, getHours() on UTC date returns 13 → actualMinutes=780
      // which still gives lateMinutes=240 → LATE.
      // But if server TZ is UTC and toLocaleString fix is absent, edge cases can slip through.
      // This test locks the correct behavior regardless of server TZ.
      const checkInDate = new Date('2026-06-01T13:00:00.000Z'); // 20:00 Bangkok
      jest.useFakeTimers({ now: checkInDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '09:00', gracePeriodMinutes: 15 } });
      mockAttendanceRepository.create.mockImplementation((data) => Promise.resolve(data));

      await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      const createCall = mockAttendanceRepository.create.mock.calls[0][0];
      expect(createCall.status).toBe('LATE');
      expect(createCall.lateMinutes).toBeGreaterThan(15);
    });

    it('should return NORMAL when shift population fails (shiftId is raw ObjectId)', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const mockLog = { _id: new Types.ObjectId(), type: 'CHECK_IN', status: 'NORMAL' };

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      // Simulate unpopulated shiftId (shift was deleted — Mongoose returns raw ObjectId)
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: new Types.ObjectId() });
      mockAttendanceRepository.create.mockResolvedValue(mockLog);

      const result = await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      expect(result).toEqual(mockLog);
      const createCall = mockAttendanceRepository.create.mock.calls[0][0];
      expect(createCall.status).toBe('NORMAL');
    });

    it('should throw BadRequestException when check-in before 2h window opens', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();

      // shift 08:00, window opens at 06:00; check-in at 05:00 → too early
      const tooEarlyDate = new Date();
      tooEarlyDate.setHours(5, 0, 0, 0);
      jest.useFakeTimers({ now: tooEarlyDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '08:00' } });

      await expect(
        service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 }),
      ).rejects.toThrow(BadRequestException);

      jest.useRealTimers();
    });

    it('should allow check-in exactly when 2h window opens', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const mockLog = { _id: new Types.ObjectId(), type: 'CHECK_IN', status: 'NORMAL' };

      // shift 08:00, window opens at 06:00; check-in at 06:00 → allowed
      const windowOpenDate = new Date();
      windowOpenDate.setHours(6, 0, 0, 0);
      jest.useFakeTimers({ now: windowOpenDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { startTime: '08:00' } });
      mockAttendanceRepository.create.mockResolvedValue(mockLog);

      const result = await service.checkIn(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      expect(result).toEqual(mockLog);
    });
  });

  describe('getMyHistory', () => {
    it('should return daily aggregated records with workDuration', async () => {
      const employee = makeMockEmployee();
      const checkInTime = new Date('2026-06-01T02:10:00.000Z'); // 09:10 Bangkok
      const checkOutTime = new Date('2026-06-01T06:30:00.000Z'); // 13:30 Bangkok

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockAttendanceRepository.findDailyPaginated.mockResolvedValue({
        days: [{
          _id: '2026-06-01',
          logs: [
            { type: 'CHECK_IN', checkTime: checkInTime, status: 'LATE', lateMinutes: 10, isInsideGeofence: true, distanceFromBranch: 45 },
            { type: 'CHECK_OUT', checkTime: checkOutTime, status: 'NORMAL', lateMinutes: 0 },
          ],
        }],
        total: 1,
      });

      const result = await service.getMyHistory(TENANT_ID, USER_ID, {});

      expect(result.data).toHaveLength(1);
      const record = result.data[0];
      expect(record.date).toBe('2026-06-01');
      expect(record.checkIn).toEqual(checkInTime);
      expect(record.checkOut).toEqual(checkOutTime);
      expect(record.status).toBe('LATE');
      expect(record.lateMinutes).toBe(10);
      expect(record.workDuration).toBe(260); // (6:30 - 2:10) = 260 min
      expect(record.isInsideGeofence).toBe(true);
      expect(record.distanceFromBranch).toBe(45);
    });

    it('should return null workDuration when no check-out log exists', async () => {
      const employee = makeMockEmployee();
      const checkInTime = new Date('2026-06-01T02:10:00.000Z');

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockAttendanceRepository.findDailyPaginated.mockResolvedValue({
        days: [{
          _id: '2026-06-01',
          logs: [
            { type: 'CHECK_IN', checkTime: checkInTime, status: 'NORMAL', lateMinutes: 0, isInsideGeofence: true, distanceFromBranch: 20 },
          ],
        }],
        total: 1,
      });

      const result = await service.getMyHistory(TENANT_ID, USER_ID, {});

      expect(result.data[0].checkOut).toBeNull();
      expect(result.data[0].workDuration).toBeNull();
    });

    it('should return correct meta pagination', async () => {
      const employee = makeMockEmployee();
      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockAttendanceRepository.findDailyPaginated.mockResolvedValue({ days: [], total: 45 });

      const result = await service.getMyHistory(TENANT_ID, USER_ID, { page: '3', limit: '20' });

      expect(result.meta).toEqual({ page: 3, limit: 20, total: 45, totalPages: 3 });
    });
  });

  describe('checkOut', () => {
    it('should throw 400 when no check-in found for today', async () => {
      const employee = makeMockEmployee();
      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(null);

      await expect(
        service.checkOut(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create checkout log when valid check-in exists', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const existingCheckIn = { _id: new Types.ObjectId(), type: 'CHECK_IN' };
      const mockLog = { _id: new Types.ObjectId(), type: 'CHECK_OUT', status: 'NORMAL' };

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(existingCheckIn);
      mockShiftsRepository.findCurrentAssignment.mockResolvedValue(null);
      mockAttendanceRepository.create.mockResolvedValue(mockLog);

      const result = await service.checkOut(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      expect(result).toEqual(mockLog);
      expect(mockAttendanceRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when check-out before shift end time', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const existingCheckIn = { _id: new Types.ObjectId(), type: 'CHECK_IN' };

      // shift ends at 17:00, check-out at 16:00 → too early
      const tooEarlyDate = new Date();
      tooEarlyDate.setHours(16, 0, 0, 0);
      jest.useFakeTimers({ now: tooEarlyDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(existingCheckIn);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { endTime: '17:00', isOvernight: false } });

      await expect(
        service.checkOut(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 }),
      ).rejects.toThrow(BadRequestException);

      jest.useRealTimers();
    });

    it('should allow check-out for overnight shift regardless of time', async () => {
      const employee = makeMockEmployee(new Types.ObjectId());
      const branch = makeMockBranch();
      const existingCheckIn = { _id: new Types.ObjectId(), type: 'CHECK_IN' };
      const mockLog = { _id: new Types.ObjectId(), type: 'CHECK_OUT', status: 'NORMAL' };

      // overnight shift: endTime 06:00, current time 05:00 → allowed because isOvernight
      const earlyDate = new Date();
      earlyDate.setHours(5, 0, 0, 0);
      jest.useFakeTimers({ now: earlyDate.getTime() });

      mockEmployeesRepository.findByUserIdAndTenant.mockResolvedValue(employee);
      mockBranchesRepository.findById.mockResolvedValue(branch);
      mockGeofenceService.calculateDistance.mockReturnValue(50);
      mockAttendanceRepository.findTodayCheckIn.mockResolvedValue(existingCheckIn);
      mockShiftsRepository.findCurrentAssignment
        .mockResolvedValue({ shiftId: { endTime: '06:00', isOvernight: true } });
      mockAttendanceRepository.create.mockResolvedValue(mockLog);

      const result = await service.checkOut(TENANT_ID, USER_ID, { lat: 17.97, lng: 102.63 });

      jest.useRealTimers();

      expect(result).toEqual(mockLog);
    });
  });
});
