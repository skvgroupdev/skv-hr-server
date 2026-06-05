import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ShiftsRepository } from '../shifts.repository';
import { Shift } from '../schemas/shift.schema';
import { ShiftAssignment } from '../schemas/shift-assignment.schema';

describe('ShiftsRepository.findCurrentAssignment', () => {
  let repository: ShiftsRepository;

  const mockFindOne = jest.fn();
  const mockExec = jest.fn();
  const mockSort = jest.fn();
  const mockPopulate = jest.fn();

  const mockAssignmentModel = {
    create: jest.fn(),
    findOne: mockFindOne,
  };

  beforeEach(async () => {
    mockFindOne.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ populate: mockPopulate });
    mockPopulate.mockReturnValue({ exec: mockExec });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsRepository,
        { provide: getModelToken(Shift.name), useValue: { create: jest.fn(), find: jest.fn(), findOne: jest.fn(), findOneAndUpdate: jest.fn() } },
        { provide: getModelToken(ShiftAssignment.name), useValue: mockAssignmentModel },
      ],
    }).compile();

    repository = module.get<ShiftsRepository>(ShiftsRepository);
    jest.clearAllMocks();
    mockFindOne.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ populate: mockPopulate });
    mockPopulate.mockReturnValue({ exec: mockExec });
    mockExec.mockResolvedValue(null);
  });

  it('should use setUTCHours(0,0,0,0) so today boundary is UTC midnight', async () => {
    // Mock Date so we control what "now" is: 2026-06-01T13:47:00Z (20:47 Bangkok)
    const fixedNow = new Date('2026-06-01T13:47:00.000Z');
    jest.useFakeTimers({ now: fixedNow.getTime() });

    const employeeId = new Types.ObjectId();
    const tenantId = new Types.ObjectId();

    await repository.findCurrentAssignment(employeeId, tenantId);

    const callArgs = mockFindOne.mock.calls[0][0];
    const todayUsed: Date = callArgs.effectiveDate.$lte;

    // With setUTCHours(0,0,0,0): today = 2026-06-01T00:00:00.000Z
    expect(todayUsed.toISOString()).toBe('2026-06-01T00:00:00.000Z');

    jest.useRealTimers();
  });

  it('should query with effectiveDate $lte and endDate $gte or null', async () => {
    const fixedNow = new Date('2026-06-01T06:00:00.000Z');
    jest.useFakeTimers({ now: fixedNow.getTime() });

    const employeeId = new Types.ObjectId();
    const tenantId = new Types.ObjectId();

    await repository.findCurrentAssignment(employeeId, tenantId);

    const callArgs = mockFindOne.mock.calls[0][0];

    expect(callArgs).toMatchObject({
      employeeId,
      tenantId,
    });
    expect(callArgs.effectiveDate).toHaveProperty('$lte');
    expect(callArgs.$or).toEqual(
      expect.arrayContaining([
        { endDate: { $gte: expect.any(Date) } },
        { endDate: null },
        { endDate: { $exists: false } },
      ]),
    );

    jest.useRealTimers();
  });

  it('should populate shiftId and sort by effectiveDate desc', async () => {
    const employeeId = new Types.ObjectId();
    const tenantId = new Types.ObjectId();

    await repository.findCurrentAssignment(employeeId, tenantId);

    expect(mockSort).toHaveBeenCalledWith({ effectiveDate: -1 });
    expect(mockPopulate).toHaveBeenCalledWith('shiftId');
  });
});
