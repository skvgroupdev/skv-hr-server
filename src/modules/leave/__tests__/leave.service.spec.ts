import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { LeaveService } from '../leave.service';
import { LeaveRepository } from '../leave.repository';
import { EmployeesRepository } from '../../employees/employees.repository';
import { NotificationsService } from '../../notifications/notifications.service';

const makeObjectId = () => new Types.ObjectId();

function makeMockEmployee(userId?: string) {
  return {
    _id: makeObjectId(),
    userId: userId ? new Types.ObjectId(userId) : makeObjectId(),
  };
}

function makeMockLeaveType() {
  return { _id: makeObjectId(), name: 'Annual Leave', code: 'ANNUAL', isPaid: true };
}

function makeMockLeaveRequest(employeeId: Types.ObjectId, status = 'PENDING') {
  return {
    _id: makeObjectId(),
    employeeId,
    leaveTypeId: makeObjectId(),
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
    totalDays: 5,
    status,
    approvals: [],
  };
}

describe('LeaveService', () => {
  let service: LeaveService;

  const mockLeaveRepository = {
    createLeaveType: jest.fn(),
    findAllLeaveTypes: jest.fn(),
    findLeaveTypeById: jest.fn(),
    updateLeaveType: jest.fn(),
    softDeleteLeaveType: jest.fn(),
    createRequest: jest.fn(),
    findRequestById: jest.fn(),
    findRequestsByEmployee: jest.fn(),
    findPendingRequests: jest.fn(),
    updateRequest: jest.fn(),
    findOverlapping: jest.fn(),
    findReport: jest.fn(),
    findBalance: jest.fn(),
    findBalancesByEmployee: jest.fn(),
    upsertBalance: jest.fn(),
    createBalance: jest.fn(),
    adjustBalance: jest.fn(),
  };

  const mockEmployeesRepository = {
    findPaginated: jest.fn(),
    findById: jest.fn(),
  };

  const mockNotificationsService = {
    notify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaveService,
        { provide: LeaveRepository, useValue: mockLeaveRepository },
        { provide: EmployeesRepository, useValue: mockEmployeesRepository },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<LeaveService>(LeaveService);
    jest.clearAllMocks();
  });

  describe('request', () => {
    it('should create a leave request with correct workingDays count', async () => {
      const employee = makeMockEmployee();
      const leaveType = makeMockLeaveType();
      const mockRequest = { _id: makeObjectId(), totalDays: 5, status: 'PENDING' };

      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [employee], total: 1 });
      mockLeaveRepository.findLeaveTypeById.mockResolvedValue(leaveType);
      mockLeaveRepository.findOverlapping.mockResolvedValue(null);
      mockLeaveRepository.createRequest.mockResolvedValue(mockRequest);

      const result = await service.request('tenantId', 'userId', {
        leaveTypeId: leaveType._id.toString(),
        startDate: '2026-06-01', // Monday
        endDate: '2026-06-05',   // Friday (5 working days)
        reason: 'Vacation',
      });

      expect(result).toEqual(mockRequest);
      expect(mockLeaveRepository.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({ totalDays: 5 }),
      );
    });

    it('should throw ConflictException when dates overlap existing request', async () => {
      const employee = makeMockEmployee();
      const leaveType = makeMockLeaveType();

      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [employee], total: 1 });
      mockLeaveRepository.findLeaveTypeById.mockResolvedValue(leaveType);
      mockLeaveRepository.findOverlapping.mockResolvedValue({ _id: makeObjectId() });

      await expect(
        service.request('tenantId', 'userId', {
          leaveTypeId: leaveType._id.toString(),
          startDate: '2026-06-01',
          endDate: '2026-06-03',
          reason: 'Sick',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when endDate is before startDate', async () => {
      const employee = makeMockEmployee();
      const leaveType = makeMockLeaveType();

      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [employee], total: 1 });
      mockLeaveRepository.findLeaveTypeById.mockResolvedValue(leaveType);

      await expect(
        service.request('tenantId', 'userId', {
          leaveTypeId: leaveType._id.toString(),
          startDate: '2026-06-05',
          endDate: '2026-06-01',
          reason: 'Test',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should count half day as 0.5 days', async () => {
      const employee = makeMockEmployee();
      const leaveType = makeMockLeaveType();
      const mockRequest = { _id: makeObjectId(), totalDays: 0.5 };

      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [employee], total: 1 });
      mockLeaveRepository.findLeaveTypeById.mockResolvedValue(leaveType);
      mockLeaveRepository.findOverlapping.mockResolvedValue(null);
      mockLeaveRepository.createRequest.mockResolvedValue(mockRequest);

      await service.request('tenantId', 'userId', {
        leaveTypeId: leaveType._id.toString(),
        startDate: '2026-06-01',
        endDate: '2026-06-01',
        isHalfDay: true,
        halfDayPeriod: 'AM',
        reason: 'Half day',
      });

      expect(mockLeaveRepository.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({ totalDays: 0.5 }),
      );
    });
  });

  describe('approve', () => {
    it('should approve request and deduct leave balance', async () => {
      const employee = makeMockEmployee();
      const leaveRequest = makeMockLeaveRequest(employee._id as Types.ObjectId);
      const approvedRequest = { ...leaveRequest, status: 'APPROVED' };

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);
      mockLeaveRepository.updateRequest.mockResolvedValue(approvedRequest);
      mockLeaveRepository.upsertBalance.mockResolvedValue({});

      const result = await service.approve('tenantId', leaveRequest._id.toString(), 'actorId', 'HR_ADMIN', { comment: 'OK' });

      expect(result).toEqual(approvedRequest);
      expect(mockLeaveRepository.upsertBalance).toHaveBeenCalledWith(
        expect.any(Types.ObjectId),
        leaveRequest.employeeId,
        leaveRequest.leaveTypeId,
        expect.any(Number),
        leaveRequest.totalDays,
      );
    });

    it('should throw BadRequestException when request is not pending', async () => {
      const employee = makeMockEmployee();
      const leaveRequest = makeMockLeaveRequest(employee._id as Types.ObjectId, 'APPROVED');

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);

      await expect(
        service.approve('tenantId', leaveRequest._id.toString(), 'actorId', 'HR_ADMIN', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when request does not exist', async () => {
      mockLeaveRepository.findRequestById.mockResolvedValue(null);

      await expect(
        service.approve('tenantId', makeObjectId().toString(), 'actorId', 'HR_ADMIN', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('reject', () => {
    it('should reject a pending leave request', async () => {
      const employee = makeMockEmployee();
      const leaveRequest = makeMockLeaveRequest(employee._id as Types.ObjectId);
      const rejectedRequest = { ...leaveRequest, status: 'REJECTED' };

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);
      mockLeaveRepository.updateRequest.mockResolvedValue(rejectedRequest);

      const result = await service.reject('tenantId', leaveRequest._id.toString(), 'actorId', 'HR_ADMIN', { reason: 'Not valid' });

      expect(result).toEqual(rejectedRequest);
      expect(mockLeaveRepository.upsertBalance).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should cancel own pending leave request', async () => {
      const userId = makeObjectId().toString();
      const employee = makeMockEmployee(userId);
      const leaveRequest = makeMockLeaveRequest(employee._id as Types.ObjectId);
      const cancelledRequest = { ...leaveRequest, status: 'CANCELLED' };

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);
      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [employee], total: 1 });
      mockLeaveRepository.updateRequest.mockResolvedValue(cancelledRequest);

      const result = await service.cancel('tenantId', leaveRequest._id.toString(), userId);

      expect(result).toEqual(cancelledRequest);
    });

    it('should throw BadRequestException when trying to cancel approved request', async () => {
      const userId = makeObjectId().toString();
      const employee = makeMockEmployee(userId);
      const leaveRequest = makeMockLeaveRequest(employee._id as Types.ObjectId, 'APPROVED');

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);

      await expect(
        service.cancel('tenantId', leaveRequest._id.toString(), userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException when trying to cancel another person request', async () => {
      const userId = makeObjectId().toString();
      const otherEmployee = makeMockEmployee();
      const leaveRequest = makeMockLeaveRequest(otherEmployee._id as Types.ObjectId);
      const currentEmployee = makeMockEmployee(userId);

      mockLeaveRepository.findRequestById.mockResolvedValue(leaveRequest);
      mockEmployeesRepository.findPaginated.mockResolvedValue({ employees: [currentEmployee], total: 1 });

      await expect(
        service.cancel('tenantId', leaveRequest._id.toString(), userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
