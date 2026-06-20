import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceAdjustmentsService } from '../attendance-adjustments.service';
import { AttendanceAdjustmentsRepository } from '../attendance-adjustments.repository';
import { AttendanceRepository } from '../../attendance/attendance.repository';
import { EmployeesRepository } from '../../employees/employees.repository';
import { AuditLogService } from '../../audit-logs/audit-log.service';
import type { JwtPayload } from '../../auth/strategies/jwt.strategy';

const tenantId = new Types.ObjectId();
const branchId = new Types.ObjectId();
const employeeId = new Types.ObjectId();
const userId = new Types.ObjectId();
const requestId = new Types.ObjectId();

function user(role: string, branch = branchId.toString()): JwtPayload {
  return {
    sub: userId.toString(),
    role,
    companyId: tenantId.toString(),
    branchId: branch,
  };
}

describe('AttendanceAdjustmentsService', () => {
  let service: AttendanceAdjustmentsService;
  const repository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmployee: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };
  const attendanceRepository = { findById: jest.fn(), create: jest.fn() };
  const employeesRepository = { findByUserIdAndTenant: jest.fn() };
  const auditLogService = { log: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AttendanceAdjustmentsService,
        { provide: AttendanceAdjustmentsRepository, useValue: repository },
        { provide: AttendanceRepository, useValue: attendanceRepository },
        { provide: EmployeesRepository, useValue: employeesRepository },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();
    service = module.get(AttendanceAdjustmentsService);
    jest.clearAllMocks();
  });

  it('scopes branch-manager lists to the JWT branch', async () => {
    repository.findAll.mockResolvedValue([]);
    await service.listForReviewer(user('BRANCH_MANAGER'), 'PENDING');
    expect(repository.findAll).toHaveBeenCalledWith(
      tenantId,
      branchId,
      'PENDING',
    );
  });

  it('does not allow HR to approve a request', async () => {
    await expect(
      service.approve(user('HR_ADMIN'), requestId.toString()),
    ).rejects.toThrow(ForbiddenException);
  });

  it('hides a request from a manager in another branch', async () => {
    repository.findById.mockResolvedValue({
      _id: requestId,
      branchId: new Types.ObjectId(),
      status: 'PENDING',
    });
    await expect(
      service.approve(user('BRANCH_MANAGER'), requestId.toString()),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when employee profile is missing on getMine', async () => {
    employeesRepository.findByUserIdAndTenant.mockResolvedValue(null);
    await expect(service.getMine(user('STAFF'))).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws BadRequestException when cancelling a non-PENDING request', async () => {
    employeesRepository.findByUserIdAndTenant.mockResolvedValue({
      _id: employeeId,
    });
    repository.findById.mockResolvedValue({
      _id: requestId,
      employeeId,
      status: 'APPROVED',
    });
    await expect(service.cancel(user('STAFF'), requestId.toString())).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects with BadRequestException when approving a non-PENDING request', async () => {
    repository.findById.mockResolvedValue({
      _id: requestId,
      branchId,
      status: 'CANCELLED',
    });
    await expect(
      service.approve(user('BRANCH_MANAGER'), requestId.toString()),
    ).rejects.toThrow(BadRequestException);
  });

  it('creates a correction log and approves without changing the original log', async () => {
    const originalLogId = new Types.ObjectId();
    repository.findById.mockResolvedValue({
      _id: requestId,
      branchId,
      employeeId,
      attendanceLogId: originalLogId,
      type: 'CHECK_IN',
      requestedCheckTime: new Date('2026-06-01T02:00:00.000Z'),
      reason: 'Traffic accident',
      status: 'PENDING',
    });
    const correctionId = new Types.ObjectId();
    attendanceRepository.create.mockResolvedValue({ _id: correctionId });
    repository.update.mockResolvedValue({ status: 'APPROVED' });

    await service.approve(
      user('BRANCH_MANAGER'),
      requestId.toString(),
      'Verified',
    );

    expect(attendanceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        correctionFor: originalLogId,
        status: 'MANUAL_ADJUSTED',
        checkTime: new Date('2026-06-01T02:00:00.000Z'),
      }),
    );
    expect(repository.update).toHaveBeenCalledWith(
      requestId.toString(),
      tenantId,
      expect.objectContaining({
        status: 'APPROVED',
        correctionLogId: correctionId,
      }),
    );
  });
});
