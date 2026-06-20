"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr';
const TENANT_ID = new mongoose_1.Types.ObjectId('6a3625190317b5257181872a');
const BRANCH_ID = new mongoose_1.Types.ObjectId('6a362bf0734ec29f025b7f0c');
const SHIFT_ID = new mongoose_1.Types.ObjectId('6a363870734ec29f025b804e');
const EMPLOYEES = [
    { id: new mongoose_1.Types.ObjectId('6a365b6fd23942f9191330c9'), name: 'ຈິນດຳ' },
    { id: new mongoose_1.Types.ObjectId('6a3637e2734ec29f025b7ffe'), name: 'ສຸລິໄຊ' },
];
const SHIFT_START_HOUR = 9;
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
const BRANCH_COORDS = [102.6797, 17.9855];
const attendanceLogSchema = new mongoose_1.default.Schema({
    tenantId: { type: mongoose_1.Types.ObjectId, ref: 'Company', required: true },
    employeeId: { type: mongoose_1.Types.ObjectId, ref: 'Employee', required: true },
    branchId: { type: mongoose_1.Types.ObjectId, ref: 'Branch' },
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
}, {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: 'attendancelogs',
});
attendanceLogSchema.index({ location: '2dsphere' }, { sparse: true });
const AttendanceLogModel = mongoose_1.default.model('AttendanceLog', attendanceLogSchema);
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function localToUtc(year, month, day, hour, minute) {
    const utcHour = hour - 7;
    return new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0, 0));
}
function generateCheckIn(year, month, day) {
    const roll = Math.random();
    if (roll < 0.10) {
        return null;
    }
    if (roll < 0.30) {
        const lateMinute = randomInt(5, 90);
        const totalMinute = SHIFT_START_HOUR * 60 + lateMinute;
        const hour = Math.floor(totalMinute / 60);
        const minute = totalMinute % 60;
        const checkTime = localToUtc(year, month, day, hour, minute);
        const status = lateMinute <= 15 ? 'LATE_MINOR' : 'LATE';
        return { status, checkTime, lateMinutes: lateMinute };
    }
    const minutesBefore = randomInt(0, 15);
    const totalMinute = SHIFT_START_HOUR * 60 - minutesBefore;
    const hour = Math.floor(totalMinute / 60);
    const minute = totalMinute % 60;
    const checkTime = localToUtc(year, month, day, hour, minute);
    return { status: 'NORMAL', checkTime, lateMinutes: 0 };
}
function generateCheckOut(year, month, day) {
    const roll = Math.random();
    if (roll < 0.20) {
        const totalMinute = 16 * 60 + randomInt(0, 85);
        const hour = Math.floor(totalMinute / 60);
        const minute = totalMinute % 60;
        return {
            status: 'EARLY_LEAVE',
            checkTime: localToUtc(year, month, day, hour, minute),
        };
    }
    const shiftEndMinute = SHIFT_END_HOUR * 60 + SHIFT_END_MINUTE;
    const totalMinute = shiftEndMinute + randomInt(0, 60);
    const hour = Math.floor(totalMinute / 60);
    const minute = totalMinute % 60;
    return {
        status: 'NORMAL',
        checkTime: localToUtc(year, month, day, hour, minute),
    };
}
function buildRecord(employeeId, type, checkTime, status, lateMinutes) {
    return {
        tenantId: TENANT_ID,
        employeeId,
        branchId: BRANCH_ID,
        type,
        checkTime,
        serverTime: checkTime,
        location: { type: 'Point', coordinates: BRANCH_COORDS },
        gpsAccuracy: 35,
        distanceFromBranch: randomInt(1, 50),
        isInsideGeofence: true,
        status,
        lateMinutes,
        scheduleSnapshot: SCHEDULE_SNAPSHOT,
    };
}
function buildDateRange() {
    const dates = [];
    for (let day = 1; day <= 31; day++) {
        dates.push({ year: 2026, month: 5, day });
    }
    for (let day = 1; day <= 20; day++) {
        dates.push({ year: 2026, month: 6, day });
    }
    return dates;
}
function isWeekend(year, month, day) {
    const dow = new Date(year, month - 1, day).getDay();
    return dow === 0 || dow === 6;
}
async function main() {
    console.log(`Connecting to ${MONGODB_URI} ...`);
    await mongoose_1.default.connect(MONGODB_URI);
    console.log('Connected.\n');
    const employeeIds = EMPLOYEES.map((e) => e.id);
    const deleted = await AttendanceLogModel.deleteMany({
        tenantId: TENANT_ID,
        employeeId: { $in: employeeIds },
    });
    console.log(`Cleared ${deleted.deletedCount} existing records.\n`);
    const dates = buildDateRange();
    const records = [];
    for (const { year, month, day } of dates) {
        if (isWeekend(year, month, day))
            continue;
        const dateLabel = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        for (const employee of EMPLOYEES) {
            const checkIn = generateCheckIn(year, month, day);
            if (checkIn === null) {
                console.log(`  ${dateLabel} | ${employee.name} → ABSENT (no record)`);
                continue;
            }
            const checkOut = generateCheckOut(year, month, day);
            records.push(buildRecord(employee.id, 'CHECK_IN', checkIn.checkTime, checkIn.status, checkIn.lateMinutes));
            records.push(buildRecord(employee.id, 'CHECK_OUT', checkOut.checkTime, checkOut.status, 0));
            const lateLabel = checkIn.lateMinutes > 0 ? ` (+${checkIn.lateMinutes}m)` : '';
            console.log(`  ${dateLabel} | ${employee.name} → CHECK_IN ${checkIn.status}${lateLabel}, CHECK_OUT ${checkOut.status}`);
        }
    }
    console.log(`\nInserting ${records.length} records ...`);
    await AttendanceLogModel.insertMany(records);
    console.log('Done.\n');
    await mongoose_1.default.disconnect();
    console.log('Disconnected.');
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-attendance.js.map