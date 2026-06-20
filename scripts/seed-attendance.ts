/**
 * seed-attendance.ts
 *
 * Generate random attendance data for 2 employees covering:
 *   - May 2026    (days 1-31)
 *   - June 2026   (days 1-20)
 *
 * Run: pnpm seed:attendance
 */

import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr';

const TENANT_ID = new Types.ObjectId('6a3625190317b5257181872a');
const BRANCH_ID = new Types.ObjectId('6a362bf0734ec29f025b7f0c');
const SHIFT_ID = new Types.ObjectId('6a363870734ec29f025b804e');

const EMPLOYEES = [
  { id: new Types.ObjectId('6a365b6fd23942f9191330c9'), name: 'ຈິນດຳ' },
  { id: new Types.ObjectId('6a3637e2734ec29f025b7ffe'), name: 'ສຸລິໄຊ' },
];

// Shift times (hours in UTC+7 → subtract 7 for UTC storage)
const SHIFT_START_HOUR = 9; // 09:00 local
const SHIFT_END_HOUR = 17;
const SHIFT_END_MINUTE = 30;

const SCHEDULE_SNAPSHOT = {
  source: 'SHIFT',
  startTime: '09:00',
  endTime: '17:30',
  workDays: [1, 2, 3, 4, 5],
  gracePeriodMinutes: 15,
  isOvernight: false,
  shiftId: SHIFT_ID.toString(),
};

const BRANCH_COORDS: [number, number] = [102.6797, 17.9855]; // [lng, lat]

// ---------------------------------------------------------------------------
// Mongoose schema (inline — no NestJS DI)
// ---------------------------------------------------------------------------

const attendanceLogSchema = new mongoose.Schema(
  {
    tenantId: { type: Types.ObjectId, ref: 'Company', required: true },
    employeeId: { type: Types.ObjectId, ref: 'Employee', required: true },
    branchId: { type: Types.ObjectId, ref: 'Branch' },
    type: {
      type: String,
      enum: ['CHECK_IN', 'CHECK_OUT', 'BREAK_IN', 'BREAK_OUT', 'MANUAL_ADJUSTMENT'],
      required: true,
    },
    checkTime: { type: Date, required: true },
    serverTime: { type: Date, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
    gpsAccuracy: Number,
    distanceFromBranch: Number,
    isInsideGeofence: Boolean,
    status: {
      type: String,
      enum: [
        'NORMAL',
        'LATE_MINOR',
        'LATE',
        'EARLY_LEAVE',
        'ABSENT',
        'MISSING_CHECKOUT',
        'OUTSIDE_PENDING',
        'OUTSIDE_APPROVED',
        'OUTSIDE_REJECTED',
        'MANUAL_ADJUSTED',
      ],
      default: 'NORMAL',
    },
    lateMinutes: { type: Number, default: 0 },
    note: String,
    earlyLeaveReason: String,
    scheduleSnapshot: { type: Object },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: 'attendancelogs',
  },
);

attendanceLogSchema.index({ location: '2dsphere' }, { sparse: true });

const AttendanceLogModel = mongoose.model('AttendanceLog', attendanceLogSchema);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Build a UTC Date for a local Asia/Vientiane (UTC+7) time. */
function localToUtc(
  year: number,
  month: number, // 1-based
  day: number,
  hour: number,
  minute: number,
): Date {
  const utcHour = hour - 7;
  return new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0, 0));
}

type CheckInResult = {
  status: 'NORMAL' | 'LATE_MINOR' | 'LATE';
  checkTime: Date;
  lateMinutes: number;
};

type CheckOutResult = {
  status: 'NORMAL' | 'EARLY_LEAVE';
  checkTime: Date;
};

/**
 * Returns CHECK_IN timing based on probability:
 *   70% NORMAL  → 08:45–09:00
 *   20% LATE    → 09:05–10:30  (LATE_MINOR if ≤ 15 min, else LATE)
 *   10% absent  → null
 */
function generateCheckIn(
  year: number,
  month: number,
  day: number,
): CheckInResult | null {
  const roll = Math.random();

  if (roll < 0.10) {
    // 10% absent
    return null;
  }

  if (roll < 0.30) {
    // 20% late  (0.10–0.30)
    const lateMinute = randomInt(5, 90); // 5–90 min after 09:00
    const totalMinute = SHIFT_START_HOUR * 60 + lateMinute;
    const hour = Math.floor(totalMinute / 60);
    const minute = totalMinute % 60;
    const checkTime = localToUtc(year, month, day, hour, minute);

    const status: 'LATE_MINOR' | 'LATE' =
      lateMinute <= 15 ? 'LATE_MINOR' : 'LATE';

    return { status, checkTime, lateMinutes: lateMinute };
  }

  // 70% normal  (0.30–1.00)
  const minutesBefore = randomInt(0, 15); // 08:45–09:00
  const totalMinute = SHIFT_START_HOUR * 60 - minutesBefore;
  const hour = Math.floor(totalMinute / 60);
  const minute = totalMinute % 60;
  const checkTime = localToUtc(year, month, day, hour, minute);

  return { status: 'NORMAL', checkTime, lateMinutes: 0 };
}

/**
 * Returns CHECK_OUT timing based on probability:
 *   80% NORMAL      → 17:30–18:30
 *   20% EARLY_LEAVE → 16:00–17:25
 */
function generateCheckOut(
  year: number,
  month: number,
  day: number,
): CheckOutResult {
  const roll = Math.random();

  if (roll < 0.20) {
    // 20% early leave  → 16:00–17:25
    const totalMinute = 16 * 60 + randomInt(0, 85);
    const hour = Math.floor(totalMinute / 60);
    const minute = totalMinute % 60;
    return {
      status: 'EARLY_LEAVE',
      checkTime: localToUtc(year, month, day, hour, minute),
    };
  }

  // 80% normal  → 17:30–18:30
  const shiftEndMinute = SHIFT_END_HOUR * 60 + SHIFT_END_MINUTE;
  const totalMinute = shiftEndMinute + randomInt(0, 60);
  const hour = Math.floor(totalMinute / 60);
  const minute = totalMinute % 60;
  return {
    status: 'NORMAL',
    checkTime: localToUtc(year, month, day, hour, minute),
  };
}

function buildRecord(
  employeeId: Types.ObjectId,
  type: 'CHECK_IN' | 'CHECK_OUT',
  checkTime: Date,
  status: string,
  lateMinutes: number,
) {
  return {
    tenantId: TENANT_ID,
    employeeId,
    branchId: BRANCH_ID,
    type,
    checkTime,
    serverTime: checkTime,
    location: { type: 'Point' as const, coordinates: BRANCH_COORDS },
    gpsAccuracy: 35,
    distanceFromBranch: randomInt(1, 50),
    isInsideGeofence: true,
    status,
    lateMinutes,
    scheduleSnapshot: SCHEDULE_SNAPSHOT,
  };
}

// ---------------------------------------------------------------------------
// Date range helpers
// ---------------------------------------------------------------------------

interface DateRange {
  year: number;
  month: number;
  day: number;
}

function buildDateRange(): DateRange[] {
  const dates: DateRange[] = [];

  // May 2026: days 1–31
  for (let day = 1; day <= 31; day++) {
    dates.push({ year: 2026, month: 5, day });
  }

  // June 2026: days 1–20
  for (let day = 1; day <= 20; day++) {
    dates.push({ year: 2026, month: 6, day });
  }

  return dates;
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay(); // 0=Sun, 6=Sat
  return dow === 0 || dow === 6;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Connecting to ${MONGODB_URI} ...`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const employeeIds = EMPLOYEES.map((e) => e.id);

  // Clear existing attendance for these 2 employees
  const deleted = await AttendanceLogModel.deleteMany({
    tenantId: TENANT_ID,
    employeeId: { $in: employeeIds },
  });
  console.log(`Cleared ${deleted.deletedCount} existing records.\n`);

  const dates = buildDateRange();
  const records: ReturnType<typeof buildRecord>[] = [];

  for (const { year, month, day } of dates) {
    if (isWeekend(year, month, day)) continue;

    const dateLabel = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    for (const employee of EMPLOYEES) {
      const checkIn = generateCheckIn(year, month, day);

      if (checkIn === null) {
        console.log(`  ${dateLabel} | ${employee.name} → ABSENT (no record)`);
        continue;
      }

      const checkOut = generateCheckOut(year, month, day);

      records.push(
        buildRecord(employee.id, 'CHECK_IN', checkIn.checkTime, checkIn.status, checkIn.lateMinutes),
      );
      records.push(
        buildRecord(employee.id, 'CHECK_OUT', checkOut.checkTime, checkOut.status, 0),
      );

      const lateLabel =
        checkIn.lateMinutes > 0 ? ` (+${checkIn.lateMinutes}m)` : '';
      console.log(
        `  ${dateLabel} | ${employee.name} → CHECK_IN ${checkIn.status}${lateLabel}, CHECK_OUT ${checkOut.status}`,
      );
    }
  }

  console.log(`\nInserting ${records.length} records ...`);
  await AttendanceLogModel.insertMany(records);
  console.log('Done.\n');

  await mongoose.disconnect();
  console.log('Disconnected.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
