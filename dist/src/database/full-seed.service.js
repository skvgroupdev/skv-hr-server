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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FullSeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullSeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const company_schema_1 = require("../modules/companies/schemas/company.schema");
const branch_schema_1 = require("../modules/branches/schemas/branch.schema");
const department_schema_1 = require("../modules/departments/schemas/department.schema");
const position_schema_1 = require("../modules/positions/schemas/position.schema");
const user_schema_1 = require("../modules/users/schemas/user.schema");
const employee_schema_1 = require("../modules/employees/schemas/employee.schema");
const shift_schema_1 = require("../modules/shifts/schemas/shift.schema");
const shift_assignment_schema_1 = require("../modules/shifts/schemas/shift-assignment.schema");
const holiday_schema_1 = require("../modules/holidays/schemas/holiday.schema");
const attendance_log_schema_1 = require("../modules/attendance/schemas/attendance-log.schema");
const leave_type_schema_1 = require("../modules/leave/schemas/leave-type.schema");
const leave_balance_schema_1 = require("../modules/leave/schemas/leave-balance.schema");
const leave_request_schema_1 = require("../modules/leave/schemas/leave-request.schema");
const ot_request_schema_1 = require("../modules/ot/schemas/ot-request.schema");
function seededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash) / 2147483647;
}
function seededRandInt(seed, min, max) {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
function parseTimeOnDate(dateStr, timeStr, tzOffsetHours = 7) {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(`${dateStr}T00:00:00.000Z`);
    d.setUTCHours(h - tzOffsetHours, m, 0, 0);
    return d;
}
function dateToYMD(date) {
    return date.toISOString().slice(0, 10);
}
function isWeekend(date) {
    const day = date.getUTCDay();
    return day === 0 || day === 6;
}
function addDays(date, days) {
    return new Date(date.getTime() + days * 86400000);
}
const LAO_HOLIDAYS = new Set([
    '2025-01-01', '2025-01-20', '2025-03-08',
    '2025-04-14', '2025-04-15', '2025-04-16',
    '2025-05-01', '2025-12-02',
    '2026-01-01', '2026-01-20', '2026-03-08',
    '2026-04-14', '2026-04-15', '2026-04-16',
    '2026-05-01',
]);
function isHoliday(dateStr) {
    return LAO_HOLIDAYS.has(dateStr);
}
let FullSeedService = FullSeedService_1 = class FullSeedService {
    companyModel;
    branchModel;
    departmentModel;
    positionModel;
    userModel;
    employeeModel;
    shiftModel;
    shiftAssignmentModel;
    holidayModel;
    attendanceLogModel;
    leaveTypeModel;
    leaveBalanceModel;
    leaveRequestModel;
    otRequestModel;
    logger = new common_1.Logger(FullSeedService_1.name);
    constructor(companyModel, branchModel, departmentModel, positionModel, userModel, employeeModel, shiftModel, shiftAssignmentModel, holidayModel, attendanceLogModel, leaveTypeModel, leaveBalanceModel, leaveRequestModel, otRequestModel) {
        this.companyModel = companyModel;
        this.branchModel = branchModel;
        this.departmentModel = departmentModel;
        this.positionModel = positionModel;
        this.userModel = userModel;
        this.employeeModel = employeeModel;
        this.shiftModel = shiftModel;
        this.shiftAssignmentModel = shiftAssignmentModel;
        this.holidayModel = holidayModel;
        this.attendanceLogModel = attendanceLogModel;
        this.leaveTypeModel = leaveTypeModel;
        this.leaveBalanceModel = leaveBalanceModel;
        this.leaveRequestModel = leaveRequestModel;
        this.otRequestModel = otRequestModel;
    }
    async run() {
        this.logger.log('=== Full Seed Start ===');
        const company = await this.seedCompany();
        const tenantId = company._id;
        await this.clearTenantData(tenantId);
        const branches = await this.seedBranches(tenantId);
        const departments = await this.seedDepartments(tenantId);
        const positions = await this.seedPositions(tenantId);
        const shifts = await this.seedShifts(tenantId);
        await this.seedHolidays(tenantId);
        const hashedPassword = await bcrypt.hash('Test@1234', 10);
        const { users, employees } = await this.seedUsersAndEmployees(tenantId, branches, departments, positions, hashedPassword);
        await this.seedShiftAssignments(tenantId, employees, shifts);
        await this.seedAttendanceLogs(tenantId, employees, shifts, branches);
        await this.seedLeaveTypesAndRequests(tenantId, employees, users);
        await this.seedOTRequests(tenantId, employees, users);
        this.logger.log('=== Full Seed Complete ===');
    }
    async seedCompany() {
        const existing = await this.companyModel.findOne({ name: 'SKV Motors Group' });
        if (existing) {
            this.logger.log('Company already exists — reusing');
            return existing;
        }
        const company = await this.companyModel.create({
            name: 'SKV Motors Group',
            status: 'ACTIVE',
            defaultTimezone: 'Asia/Vientiane',
            defaultLanguage: 'lo',
        });
        this.logger.log(`Company created: ${company._id}`);
        return company;
    }
    async clearTenantData(tenantId) {
        const id = tenantId;
        const results = await Promise.all([
            this.branchModel.deleteMany({ tenantId: id }),
            this.departmentModel.deleteMany({ tenantId: id }),
            this.positionModel.deleteMany({ tenantId: id }),
            this.shiftModel.deleteMany({ tenantId: id }),
            this.shiftAssignmentModel.deleteMany({ tenantId: id }),
            this.holidayModel.deleteMany({ tenantId: id }),
            this.attendanceLogModel.deleteMany({ tenantId: id }),
            this.leaveTypeModel.deleteMany({ tenantId: id }),
            this.leaveBalanceModel.deleteMany({ tenantId: id }),
            this.leaveRequestModel.deleteMany({ tenantId: id }),
            this.otRequestModel.deleteMany({ tenantId: id }),
        ]);
        this.logger.log(`Cleared tenant data: branch=${results[0].deletedCount}, dept=${results[1].deletedCount}, pos=${results[2].deletedCount}, shift=${results[3].deletedCount}, logs=${results[7].deletedCount}`);
        const existingEmps = await this.employeeModel.find({ tenantId: id }).lean();
        const userIds = existingEmps.map(e => e.userId).filter(Boolean);
        await this.employeeModel.deleteMany({ tenantId: id });
        if (userIds.length > 0) {
            await this.userModel.deleteMany({ _id: { $in: userIds } });
        }
        this.logger.log(`Cleared ${existingEmps.length} employees and ${userIds.length} users`);
    }
    async seedBranches(tenantId) {
        const branchDefs = [
            { key: 'HQ', name: 'ສຳນັກງານໃຫຍ່', coords: [102.6331, 17.9757], radius: 150 },
            { key: 'ຊ້າລົມ', name: 'ສາຂາ ຊ້າລົມ', coords: [102.6012, 17.9623], radius: 100 },
            { key: 'ປາກເຊ', name: 'ສາຂາ ປາກເຊ', coords: [105.7897, 15.1200], radius: 100 },
        ];
        const map = new Map();
        for (const def of branchDefs) {
            const doc = await this.branchModel.create({
                tenantId,
                name: def.name,
                location: { type: 'Point', coordinates: def.coords },
                radiusMeters: def.radius,
                isActive: true,
            });
            map.set(def.key, doc);
        }
        this.logger.log(`Branches created: ${branchDefs.length}`);
        return map;
    }
    async seedDepartments(tenantId) {
        const names = ['ຝ່າຍບໍລິຫານ', 'ຝ່າຍຂາຍ', 'ຝ່າຍການເງິນ', 'ຝ່າຍວິຊາການ', 'ຝ່າຍຕ້ອນຮັບ'];
        const map = new Map();
        for (const name of names) {
            const doc = await this.departmentModel.create({ tenantId, name, isActive: true });
            map.set(name, doc);
        }
        this.logger.log(`Departments created: ${names.length}`);
        return map;
    }
    async seedPositions(tenantId) {
        const defs = [
            { name: 'General Manager', level: 1, banding: 'L1' },
            { name: 'HR Manager', level: 2, banding: 'L2' },
            { name: 'Finance Manager', level: 2, banding: 'L2' },
            { name: 'Branch Manager', level: 2, banding: 'L2' },
            { name: 'Sales Supervisor', level: 3, banding: 'L3' },
            { name: 'Sales Executive', level: 4, banding: 'L4' },
            { name: 'Accountant', level: 4, banding: 'L4' },
            { name: 'Technician', level: 4, banding: 'L4' },
            { name: 'Receptionist', level: 5, banding: 'L5' },
        ];
        const map = new Map();
        for (const def of defs) {
            const doc = await this.positionModel.create({ tenantId, ...def, isActive: true });
            map.set(def.name, doc);
        }
        this.logger.log(`Positions created: ${defs.length}`);
        return map;
    }
    async seedShifts(tenantId) {
        const defs = [
            { key: 'Morning', name: 'Morning Shift', startTime: '08:00', endTime: '17:00', gracePeriodMinutes: 15 },
            { key: 'Evening', name: 'Evening Shift', startTime: '13:00', endTime: '21:00', gracePeriodMinutes: 10 },
            { key: 'Technician', name: 'Technician Shift', startTime: '07:30', endTime: '16:30', gracePeriodMinutes: 15 },
        ];
        const map = new Map();
        for (const def of defs) {
            const doc = await this.shiftModel.create({
                tenantId,
                name: def.name,
                startTime: def.startTime,
                endTime: def.endTime,
                gracePeriodMinutes: def.gracePeriodMinutes,
                isActive: true,
            });
            map.set(def.key, doc);
        }
        this.logger.log(`Shifts created: ${defs.length}`);
        return map;
    }
    async seedHolidays(tenantId) {
        const holidays = [
            { date: '2025-01-01', name: 'ວັນປີໃໝ່' },
            { date: '2025-01-20', name: 'ວັນສ້າງຕັ້ງພັກ' },
            { date: '2025-03-08', name: 'ວັນແມ່ຍິງ' },
            { date: '2025-04-14', name: 'ວັນປີໃໝ່ລາວ (1)' },
            { date: '2025-04-15', name: 'ວັນປີໃໝ່ລາວ (2)' },
            { date: '2025-04-16', name: 'ວັນປີໃໝ່ລາວ (3)' },
            { date: '2025-05-01', name: 'ວັນກຳມະກອນ' },
            { date: '2025-12-02', name: 'ວັນຊາດ' },
            { date: '2026-01-01', name: 'ວັນປີໃໝ່' },
            { date: '2026-01-20', name: 'ວັນສ້າງຕັ້ງພັກ' },
            { date: '2026-03-08', name: 'ວັນແມ່ຍິງ' },
            { date: '2026-04-14', name: 'ວັນປີໃໝ່ລາວ (1)' },
            { date: '2026-04-15', name: 'ວັນປີໃໝ່ລາວ (2)' },
            { date: '2026-04-16', name: 'ວັນປີໃໝ່ລາວ (3)' },
            { date: '2026-05-01', name: 'ວັນກຳມະກອນ' },
        ];
        await this.holidayModel.insertMany(holidays.map(h => ({
            tenantId,
            name: h.name,
            date: new Date(h.date),
            type: 'PUBLIC',
            isActive: true,
        })));
        this.logger.log(`Holidays created: ${holidays.length}`);
    }
    async seedUsersAndEmployees(tenantId, branches, departments, positions, hashedPassword) {
        const empDefs = [
            { idx: 1, phone: '+8562011000001', name: 'ສົມສັກ ວົງສາ', firstName: 'ສົມສັກ', lastName: 'ວົງສາ', role: 'COMPANY_OWNER', position: 'General Manager', dept: 'ຝ່າຍບໍລິຫານ', branch: 'HQ', salary: 15000000, status: 'ACTIVE', startDate: '2020-01-01', gender: 'MALE', dob: '1978-03-10' },
            { idx: 2, phone: '+8562011000002', name: 'ນາລີ ພົມມະ', firstName: 'ນາລີ', lastName: 'ພົມມະ', role: 'HR_ADMIN', position: 'HR Manager', dept: 'ຝ່າຍບໍລິຫານ', branch: 'HQ', salary: 10000000, status: 'ACTIVE', startDate: '2020-03-01', gender: 'FEMALE', dob: '1985-07-22' },
            { idx: 3, phone: '+8562011000003', name: 'ກິດຕິພົນ ແສງດາລາ', firstName: 'ກິດຕິພົນ', lastName: 'ແສງດາລາ', role: 'HR_ADMIN', position: 'Finance Manager', dept: 'ຝ່າຍການເງິນ', branch: 'HQ', salary: 9000000, status: 'ACTIVE', startDate: '2020-06-01', gender: 'MALE', dob: '1983-11-15' },
            { idx: 4, phone: '+8562011000004', name: 'ບຸນມີ ສີສຸວັນ', firstName: 'ບຸນມີ', lastName: 'ສີສຸວັນ', role: 'BRANCH_MANAGER', position: 'Branch Manager', dept: 'ຝ່າຍບໍລິຫານ', branch: 'ຊ້າລົມ', salary: 8000000, status: 'ACTIVE', startDate: '2021-01-15', gender: 'MALE', dob: '1980-05-08' },
            { idx: 5, phone: '+8562011000005', name: 'ອານຸສອນ ແກ້ວ', firstName: 'ອານຸສອນ', lastName: 'ແກ້ວ', role: 'BRANCH_MANAGER', position: 'Branch Manager', dept: 'ຝ່າຍບໍລິຫານ', branch: 'ປາກເຊ', salary: 8000000, status: 'ACTIVE', startDate: '2021-04-01', gender: 'MALE', dob: '1982-09-20' },
            { idx: 6, phone: '+8562011000006', name: 'ມາລີ ດວງຈັນ', firstName: 'ມາລີ', lastName: 'ດວງຈັນ', role: 'SUPERVISOR', position: 'Sales Supervisor', dept: 'ຝ່າຍຂາຍ', branch: 'HQ', salary: 7000000, status: 'ACTIVE', startDate: '2021-07-01', gender: 'FEMALE', dob: '1990-02-14' },
            { idx: 7, phone: '+8562011000007', name: 'ສຸລິຍາ ແກ້ວມະນີ', firstName: 'ສຸລິຍາ', lastName: 'ແກ້ວມະນີ', role: 'STAFF', position: 'Sales Executive', dept: 'ຝ່າຍຂາຍ', branch: 'HQ', salary: 6000000, status: 'ACTIVE', startDate: '2022-01-01', gender: 'MALE', dob: '1995-06-30' },
            { idx: 8, phone: '+8562011000008', name: 'ວິໄລ ທອງລີ', firstName: 'ວິໄລ', lastName: 'ທອງລີ', role: 'STAFF', position: 'Sales Executive', dept: 'ຝ່າຍຂາຍ', branch: 'ຊ້າລົມ', salary: 6000000, status: 'ACTIVE', startDate: '2022-03-01', gender: 'FEMALE', dob: '1997-04-12' },
            { idx: 9, phone: '+8562011000009', name: 'ພອນທິບ ສີລາວົງ', firstName: 'ພອນທິບ', lastName: 'ສີລາວົງ', role: 'STAFF', position: 'Accountant', dept: 'ຝ່າຍການເງິນ', branch: 'HQ', salary: 6500000, status: 'ACTIVE', startDate: '2021-09-01', gender: 'FEMALE', dob: '1992-08-03' },
            { idx: 10, phone: '+8562011000010', name: 'ຄຳພັນ ໄຊຍະວົງ', firstName: 'ຄຳພັນ', lastName: 'ໄຊຍະວົງ', role: 'STAFF', position: 'Technician', dept: 'ຝ່າຍວິຊາການ', branch: 'HQ', salary: 5000000, status: 'ACTIVE', startDate: '2022-06-01', gender: 'MALE', dob: '1993-12-20' },
            { idx: 11, phone: '+8562011000011', name: 'ອຳໄພ ລັດດາວົງ', firstName: 'ອຳໄພ', lastName: 'ລັດດາວົງ', role: 'STAFF', position: 'Receptionist', dept: 'ຝ່າຍຕ້ອນຮັບ', branch: 'HQ', salary: 4500000, status: 'ACTIVE', startDate: '2025-01-06', gender: 'FEMALE', dob: '2001-08-07' },
            { idx: 12, phone: '+8562011000012', name: 'ສົມພອນ ບຸນທ້ອງ', firstName: 'ສົມພອນ', lastName: 'ບຸນທ້ອງ', role: 'STAFF', position: 'Technician', dept: 'ຝ່າຍວິຊາການ', branch: 'ຊ້າລົມ', salary: 5000000, status: 'ACTIVE', startDate: '2022-08-01', gender: 'MALE', dob: '1994-03-18' },
            { idx: 13, phone: '+8562011000013', name: 'ຈັນທະລາ ສ້ານ', firstName: 'ຈັນທະລາ', lastName: 'ສ້ານ', role: 'STAFF', position: 'Sales Executive', dept: 'ຝ່າຍຂາຍ', branch: 'ປາກເຊ', salary: 6000000, status: 'ACTIVE', startDate: '2023-01-01', gender: 'FEMALE', dob: '1998-05-25' },
            { idx: 14, phone: '+8562011000014', name: 'ນ້ຳຟ້າ ລາດ', firstName: 'ນ້ຳຟ້າ', lastName: 'ລາດ', role: 'STAFF', position: 'Sales Executive', dept: 'ຝ່າຍຂາຍ', branch: 'ປາກເຊ', salary: 6000000, status: 'ACTIVE', startDate: '2023-04-01', gender: 'FEMALE', dob: '1999-11-10' },
            { idx: 15, phone: '+8562011000015', name: 'ສຸດາ ທ', firstName: 'ສຸດາ', lastName: 'ທ', role: 'STAFF', position: 'Accountant', dept: 'ຝ່າຍການເງິນ', branch: 'ຊ້າລົມ', salary: 6500000, status: 'ACTIVE', startDate: '2022-11-01', gender: 'FEMALE', dob: '1995-07-14' },
            { idx: 16, phone: '+8562011000016', name: 'ວັນນະ ພ', firstName: 'ວັນນະ', lastName: 'ພ', role: 'STAFF', position: 'Technician', dept: 'ຝ່າຍວິຊາການ', branch: 'ປາກເຊ', salary: 5000000, status: 'PROBATION', startDate: '2026-04-01', gender: 'MALE', dob: '2000-01-28' },
            { idx: 17, phone: '+8562011000017', name: 'ບຸນຄຳ ສ', firstName: 'ບຸນຄຳ', lastName: 'ສ', role: 'STAFF', position: 'Sales Executive', dept: 'ຝ່າຍຂາຍ', branch: 'HQ', salary: 6000000, status: 'RESIGNED', startDate: '2021-05-01', resignDate: '2025-07-31', gender: 'MALE', dob: '1992-06-05' },
            { idx: 18, phone: '+8562011000018', name: 'ດາວ ພ', firstName: 'ດາວ', lastName: 'ພ', role: 'STAFF', position: 'Receptionist', dept: 'ຝ່າຍຕ້ອນຮັບ', branch: 'ຊ້າລົມ', salary: 4500000, status: 'RESIGNED', startDate: '2022-02-01', resignDate: '2025-02-28', gender: 'FEMALE', dob: '1998-09-16' },
        ];
        const userMap = new Map();
        const empMap = new Map();
        for (const def of empDefs) {
            const user = await this.userModel.create({
                phone: def.phone,
                password: hashedPassword,
                name: def.name,
                role: def.role,
                companyId: tenantId,
                branchId: branches.get(def.branch)?._id ?? null,
                isActive: def.status !== 'RESIGNED',
            });
            const employee = await this.employeeModel.create({
                tenantId,
                firstName: def.firstName,
                lastName: def.lastName,
                gender: def.gender,
                dateOfBirth: new Date(def.dob),
                phone: def.phone,
                nationality: 'Laos',
                employmentType: 'FULL_TIME',
                status: def.status,
                startDate: new Date(def.startDate),
                resignationDate: def.resignDate ? new Date(def.resignDate) : undefined,
                positionId: positions.get(def.position)?._id ?? null,
                departmentId: departments.get(def.dept)?._id ?? null,
                branchId: branches.get(def.branch)?._id ?? null,
                baseSalary: def.salary,
                workingHoursPerMonth: 208,
                userId: user._id,
            });
            userMap.set(String(def.idx), user);
            empMap.set(String(def.idx), employee);
        }
        this.logger.log(`Users and Employees created: ${empDefs.length}`);
        return { users: userMap, employees: empMap };
    }
    async seedShiftAssignments(tenantId, employees, shifts) {
        const eveningIdxs = new Set(['11', '18']);
        const techIdxs = new Set(['10', '12', '16']);
        const docs = [];
        for (const [idx, emp] of employees.entries()) {
            let shiftKey = 'Morning';
            if (eveningIdxs.has(idx))
                shiftKey = 'Evening';
            if (techIdxs.has(idx))
                shiftKey = 'Technician';
            const shift = shifts.get(shiftKey);
            if (!shift)
                continue;
            docs.push({
                tenantId,
                employeeId: emp._id,
                shiftId: shift._id,
                effectiveDate: emp.startDate ?? new Date('2020-01-01'),
            });
        }
        await this.shiftAssignmentModel.insertMany(docs);
        this.logger.log(`Shift assignments created: ${docs.length}`);
    }
    async seedAttendanceLogs(tenantId, employees, shifts, branches) {
        const shiftInfoMap = new Map();
        for (const [key, shift] of shifts.entries()) {
            shiftInfoMap.set(key, {
                startTime: shift.startTime ?? '08:00',
                endTime: shift.endTime ?? '17:00',
                gracePeriodMinutes: shift.gracePeriodMinutes ?? 15,
            });
        }
        const eveningIdxs = new Set(['11', '18']);
        const techIdxs = new Set(['10', '12', '16']);
        function getShiftKey(idx) {
            if (eveningIdxs.has(idx))
                return 'Evening';
            if (techIdxs.has(idx))
                return 'Technician';
            return 'Morning';
        }
        const startDate = new Date('2025-06-01T00:00:00Z');
        const endDate = new Date('2026-05-31T00:00:00Z');
        const batchSize = 500;
        let batch = [];
        let totalLogs = 0;
        const flushBatch = async () => {
            if (batch.length > 0) {
                await this.attendanceLogModel.insertMany(batch);
                totalLogs += batch.length;
                batch = [];
            }
        };
        for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
            const dateStr = dateToYMD(d);
            if (isWeekend(d) || isHoliday(dateStr))
                continue;
            for (const [idx, emp] of employees.entries()) {
                if (emp.status === 'RESIGNED' && emp.resignationDate) {
                    if (d > emp.resignationDate)
                        continue;
                }
                if (idx === '16' && d < new Date('2026-04-01T00:00:00Z'))
                    continue;
                if (emp.startDate && d < emp.startDate)
                    continue;
                const shiftKey = getShiftKey(idx);
                const shiftInfo = shiftInfoMap.get(shiftKey);
                const empIdStr = String(emp._id);
                const randSeed = `${empIdStr}${dateStr}`;
                const roll = seededRandom(randSeed);
                const branchId = emp.branchId;
                let branchCoords = [102.6331, 17.9757];
                for (const br of branches.values()) {
                    if (br._id.toString() === branchId?.toString()) {
                        branchCoords = br.location?.coordinates ?? branchCoords;
                        break;
                    }
                }
                const isOffsite = seededRandom(randSeed + 'offsite') < 0.05;
                const gpsJitter = () => (seededRandom(randSeed + 'jitter' + Math.random()) - 0.5) * 0.001;
                const location = {
                    type: 'Point',
                    coordinates: [
                        branchCoords[0] + (seededRandom(randSeed + 'lng') - 0.5) * 0.001,
                        branchCoords[1] + (seededRandom(randSeed + 'lat') - 0.5) * 0.001,
                    ],
                };
                if (roll < 0.04)
                    continue;
                let status;
                let lateMinutes = 0;
                let checkIn;
                let checkOut = null;
                const shiftStartBase = parseTimeOnDate(dateStr, shiftInfo.startTime);
                const shiftEndBase = parseTimeOnDate(dateStr, shiftInfo.endTime);
                const graceEnd = addMinutes(shiftStartBase, shiftInfo.gracePeriodMinutes);
                if (roll < 0.04) {
                    continue;
                }
                else if (roll < 0.07) {
                    status = 'MISSING_CHECKOUT';
                    const earlyMinutes = seededRandInt(randSeed + 'in', 0, 30);
                    checkIn = addMinutes(shiftStartBase, -earlyMinutes);
                }
                else if (roll < 0.12) {
                    status = 'EARLY_LEAVE';
                    const earlyMinutes = seededRandInt(randSeed + 'in', 0, 30);
                    checkIn = addMinutes(shiftStartBase, -earlyMinutes);
                    const leaveEarlyBy = seededRandInt(randSeed + 'early', 30, 90);
                    checkOut = addMinutes(shiftEndBase, -leaveEarlyBy);
                }
                else if (roll < 0.20) {
                    status = 'LATE';
                    const lateBy = seededRandInt(randSeed + 'late', 16, 120);
                    checkIn = addMinutes(shiftStartBase, lateBy);
                    lateMinutes = lateBy - shiftInfo.gracePeriodMinutes;
                    checkOut = addMinutes(shiftEndBase, seededRandInt(randSeed + 'out', 0, 90));
                }
                else if (roll < 0.30) {
                    status = 'LATE_MINOR';
                    const lateBy = seededRandInt(randSeed + 'lm', shiftInfo.gracePeriodMinutes + 1, shiftInfo.gracePeriodMinutes + 15);
                    checkIn = addMinutes(shiftStartBase, lateBy);
                    lateMinutes = lateBy - shiftInfo.gracePeriodMinutes;
                    checkOut = addMinutes(shiftEndBase, seededRandInt(randSeed + 'out', 0, 90));
                }
                else {
                    status = 'NORMAL';
                    const earlyIn = seededRandInt(randSeed + 'in', 0, 30);
                    checkIn = addMinutes(shiftStartBase, -earlyIn);
                    checkOut = addMinutes(shiftEndBase, seededRandInt(randSeed + 'out', 0, 90));
                }
                const checkInDoc = {
                    tenantId,
                    employeeId: emp._id,
                    branchId: emp.branchId,
                    type: 'CHECK_IN',
                    checkTime: checkIn,
                    serverTime: checkIn,
                    location,
                    gpsAccuracy: seededRandInt(randSeed + 'acc', 3, 15),
                    isInsideGeofence: !isOffsite,
                    status,
                    lateMinutes,
                };
                batch.push(checkInDoc);
                if (checkOut) {
                    batch.push({
                        tenantId,
                        employeeId: emp._id,
                        branchId: emp.branchId,
                        type: 'CHECK_OUT',
                        checkTime: checkOut,
                        serverTime: checkOut,
                        location,
                        gpsAccuracy: seededRandInt(randSeed + 'acc2', 3, 15),
                        isInsideGeofence: !isOffsite,
                        status: 'NORMAL',
                        lateMinutes: 0,
                    });
                }
                if (batch.length >= batchSize) {
                    await flushBatch();
                }
            }
        }
        await flushBatch();
        this.logger.log(`Attendance logs created: ${totalLogs}`);
    }
    async seedLeaveTypesAndRequests(tenantId, employees, users) {
        const leaveTypeDefs = [
            { code: 'AL', name: 'ລາພັກ (Annual)', defaultDaysPerYear: 15, isPaid: true },
            { code: 'SL', name: 'ລາປ່ວຍ (Sick)', defaultDaysPerYear: 30, isPaid: true },
            { code: 'ML', name: 'ລາເກີດລູກ (Maternity)', defaultDaysPerYear: 105, isPaid: true },
            { code: 'PL', name: 'ລາເກີດລູກ ຊາຍ (Paternity)', defaultDaysPerYear: 3, isPaid: true },
            { code: 'UL', name: 'ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid)', defaultDaysPerYear: 0, isPaid: false },
        ];
        const leaveTypeMap = new Map();
        for (const def of leaveTypeDefs) {
            const doc = await this.leaveTypeModel.create({
                tenantId,
                code: def.code,
                name: def.name,
                defaultDaysPerYear: def.defaultDaysPerYear,
                isPaid: def.isPaid,
                isActive: true,
            });
            leaveTypeMap.set(def.code, doc);
        }
        this.logger.log(`Leave types created: ${leaveTypeDefs.length}`);
        const hrAdminUser = users.get('2');
        const activeIdxs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        const usedDaysMap = new Map();
        const incUsedDays = (empIdx, code, year, days) => {
            const key = `${empIdx}:${code}:${year}`;
            usedDaysMap.set(key, (usedDaysMap.get(key) ?? 0) + days);
        };
        const getUsedDays = (empIdx, code, year) => {
            return usedDaysMap.get(`${empIdx}:${code}:${year}`) ?? 0;
        };
        const leaveRequests = [];
        for (const idx of activeIdxs) {
            const emp = employees.get(idx);
            const count = seededRandInt(`${idx}:AL:count`, 1, 3);
            for (let r = 0; r < count; r++) {
                const year = seededRandom(`${idx}:AL:year:${r}`) < 0.5 ? 2025 : 2026;
                const days = seededRandInt(`${idx}:AL:days:${r}`, 1, 5);
                const monthDay = buildLeaveDate(idx, 'AL', r, year);
                const startDate = new Date(`${year}-${monthDay}`);
                const endDate = addDays(startDate, days - 1);
                const statusRoll = seededRandom(`${idx}:AL:status:${r}`);
                const status = statusRoll < 0.70 ? 'APPROVED' : statusRoll < 0.90 ? 'PENDING' : 'REJECTED';
                const req = {
                    tenantId,
                    employeeId: emp._id,
                    leaveTypeId: leaveTypeMap.get('AL')?._id,
                    leaveTypeName: 'ລາພັກ (Annual)',
                    startDate,
                    endDate,
                    totalDays: days,
                    reason: 'ຂໍລາພັກປະຈຳປີ',
                    status,
                    currentApprovalStep: 1,
                    approvals: [],
                };
                if (status === 'APPROVED') {
                    req.approvals = [{ approverId: hrAdminUser._id, role: 'HR_ADMIN', status: 'APPROVED', approvedAt: addDays(startDate, -1) }];
                    incUsedDays(idx, 'AL', year, days);
                }
                leaveRequests.push(req);
            }
        }
        const slIdxs = activeIdxs.slice(0, 8);
        for (const idx of slIdxs) {
            const emp = employees.get(idx);
            const count = seededRandInt(`${idx}:SL:count`, 1, 2);
            for (let r = 0; r < count; r++) {
                const year = seededRandom(`${idx}:SL:year:${r}`) < 0.5 ? 2025 : 2026;
                const days = seededRandInt(`${idx}:SL:days:${r}`, 1, 3);
                const monthDay = buildLeaveDate(idx, 'SL', r, year);
                const startDate = new Date(`${year}-${monthDay}`);
                const endDate = addDays(startDate, days - 1);
                const statusRoll = seededRandom(`${idx}:SL:status:${r}`);
                const status = statusRoll < 0.80 ? 'APPROVED' : 'PENDING';
                const req = {
                    tenantId,
                    employeeId: emp._id,
                    leaveTypeId: leaveTypeMap.get('SL')?._id,
                    leaveTypeName: 'ລາປ່ວຍ (Sick)',
                    startDate,
                    endDate,
                    totalDays: days,
                    reason: 'ເຈັບເປັນ',
                    status,
                    currentApprovalStep: 1,
                    approvals: [],
                };
                if (status === 'APPROVED') {
                    req.approvals = [{ approverId: hrAdminUser._id, role: 'HR_ADMIN', status: 'APPROVED', approvedAt: addDays(startDate, -1) }];
                    incUsedDays(idx, 'SL', year, days);
                }
                leaveRequests.push(req);
            }
        }
        const emp9 = employees.get('9');
        leaveRequests.push({
            tenantId,
            employeeId: emp9._id,
            leaveTypeId: leaveTypeMap.get('ML')?._id,
            leaveTypeName: 'ລາເກີດລູກ (Maternity)',
            startDate: new Date('2025-09-01'),
            endDate: new Date('2025-12-14'),
            totalDays: 105,
            reason: 'ລາຄອດລູກ',
            status: 'APPROVED',
            currentApprovalStep: 1,
            approvals: [{ approverId: hrAdminUser._id, role: 'HR_ADMIN', status: 'APPROVED', approvedAt: new Date('2025-08-25') }],
        });
        incUsedDays('9', 'ML', 2025, 105);
        const ulIdxs = ['5', '8', '13'];
        for (const idx of ulIdxs) {
            const emp = employees.get(idx);
            const year = 2025;
            const days = seededRandInt(`${idx}:UL:days`, 1, 5);
            const monthDay = buildLeaveDate(idx, 'UL', 0, year);
            const startDate = new Date(`${year}-${monthDay}`);
            const endDate = addDays(startDate, days - 1);
            const status = seededRandom(`${idx}:UL:status`) < 0.5 ? 'APPROVED' : 'PENDING';
            const req = {
                tenantId,
                employeeId: emp._id,
                leaveTypeId: leaveTypeMap.get('UL')?._id,
                leaveTypeName: 'ລາໂດຍບໍ່ໄດ້ຮັບ (Unpaid)',
                startDate,
                endDate,
                totalDays: days,
                reason: 'ກິດທຸລະສ່ວນຕົວ',
                status,
                currentApprovalStep: 1,
                approvals: [],
            };
            if (status === 'APPROVED') {
                req.approvals = [{ approverId: hrAdminUser._id, role: 'HR_ADMIN', status: 'APPROVED', approvedAt: addDays(startDate, -1) }];
                incUsedDays(idx, 'UL', year, days);
            }
            leaveRequests.push(req);
        }
        await this.leaveRequestModel.insertMany(leaveRequests);
        this.logger.log(`Leave requests created: ${leaveRequests.length}`);
        const balanceDocs = [];
        for (const idx of activeIdxs) {
            const emp = employees.get(idx);
            for (const year of [2025, 2026]) {
                for (const [code, lt] of leaveTypeMap.entries()) {
                    const totalDays = lt.defaultDaysPerYear;
                    const usedDays = getUsedDays(idx, code, year);
                    const remainingDays = Math.max(0, totalDays - usedDays);
                    balanceDocs.push({
                        tenantId,
                        employeeId: emp._id,
                        leaveTypeId: lt._id,
                        year,
                        totalDays,
                        usedDays,
                        remainingDays,
                    });
                }
            }
        }
        await this.leaveBalanceModel.insertMany(balanceDocs);
        this.logger.log(`Leave balances created: ${balanceDocs.length}`);
    }
    async seedOTRequests(tenantId, employees, users) {
        const hrAdminUser = users.get('2');
        const otIdxs = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        const eveningIdxs = new Set(['11', '18']);
        const techIdxs = new Set(['10', '12', '16']);
        function getShiftEndTime(idx) {
            if (eveningIdxs.has(idx))
                return '21:00';
            if (techIdxs.has(idx))
                return '16:30';
            return '17:00';
        }
        const otRequests = [];
        const allHolidayDates = Array.from(LAO_HOLIDAYS);
        for (const idx of otIdxs) {
            const emp = employees.get(idx);
            if (!emp)
                continue;
            const count = seededRandInt(`${idx}:OT:count`, 3, 8);
            const shiftEnd = getShiftEndTime(idx);
            for (let r = 0; r < count; r++) {
                const dayTypeRoll = seededRandom(`${idx}:OT:daytype:${r}`);
                let dayType;
                if (dayTypeRoll < 0.60)
                    dayType = 'weekday';
                else if (dayTypeRoll < 0.90)
                    dayType = 'weekend';
                else
                    dayType = 'holiday';
                let otDate;
                if (dayType === 'holiday') {
                    const hIdx = seededRandInt(`${idx}:OT:hdate:${r}`, 0, allHolidayDates.length - 1);
                    otDate = allHolidayDates[hIdx];
                }
                else if (dayType === 'weekend') {
                    otDate = buildWeekendDate(idx, r);
                }
                else {
                    otDate = buildWeekdayDate(idx, r);
                }
                const durationHours = dayType === 'weekday'
                    ? seededRandInt(`${idx}:OT:dur:${r}`, 1, 3)
                    : seededRandInt(`${idx}:OT:dur:${r}`, 2, dayType === 'holiday' ? 6 : 8);
                const startTime = parseTimeOnDate(otDate, shiftEnd);
                const endTime = new Date(startTime.getTime() + durationHours * 3600000);
                const statusRoll = seededRandom(`${idx}:OT:status:${r}`);
                let status;
                if (statusRoll < 0.60)
                    status = 'APPROVED';
                else if (statusRoll < 0.85)
                    status = 'PENDING';
                else if (statusRoll < 0.95)
                    status = 'REJECTED';
                else
                    status = 'CANCELLED';
                const approvalFlow = status === 'APPROVED'
                    ? [{ approverId: hrAdminUser._id, role: 'HR_ADMIN', status: 'APPROVED', approvedAt: addDays(startTime, -1) }]
                    : [];
                otRequests.push({
                    tenantId,
                    employeeId: emp._id,
                    date: new Date(otDate),
                    startTime,
                    endTime,
                    totalHours: durationHours,
                    dayType,
                    reason: 'ເຮັດວຽກລ່ວງເວລາ',
                    status,
                    approvalFlow,
                });
            }
        }
        await this.otRequestModel.insertMany(otRequests);
        this.logger.log(`OT requests created: ${otRequests.length}`);
    }
};
exports.FullSeedService = FullSeedService;
exports.FullSeedService = FullSeedService = FullSeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.Company.name)),
    __param(1, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __param(2, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __param(3, (0, mongoose_1.InjectModel)(position_schema_1.Position.name)),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(5, (0, mongoose_1.InjectModel)(employee_schema_1.Employee.name)),
    __param(6, (0, mongoose_1.InjectModel)(shift_schema_1.Shift.name)),
    __param(7, (0, mongoose_1.InjectModel)(shift_assignment_schema_1.ShiftAssignment.name)),
    __param(8, (0, mongoose_1.InjectModel)(holiday_schema_1.Holiday.name)),
    __param(9, (0, mongoose_1.InjectModel)(attendance_log_schema_1.AttendanceLog.name)),
    __param(10, (0, mongoose_1.InjectModel)(leave_type_schema_1.LeaveType.name)),
    __param(11, (0, mongoose_1.InjectModel)(leave_balance_schema_1.LeaveBalance.name)),
    __param(12, (0, mongoose_1.InjectModel)(leave_request_schema_1.LeaveRequest.name)),
    __param(13, (0, mongoose_1.InjectModel)(ot_request_schema_1.OTRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FullSeedService);
function buildLeaveDate(empIdx, code, r, year) {
    const month = seededRandInt(`${empIdx}:${code}:month:${r}`, 1, 12);
    const day = seededRandInt(`${empIdx}:${code}:day:${r}`, 1, 20);
    return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function buildWeekendDate(empIdx, r) {
    const year = seededRandom(`${empIdx}:OT:weyear:${r}`) < 0.5 ? 2025 : 2026;
    const weekNo = seededRandInt(`${empIdx}:OT:week:${r}`, 0, 51);
    const jan1 = new Date(`${year}-01-01T00:00:00Z`);
    const jan1Day = jan1.getUTCDay();
    const daysToSaturday = (6 - jan1Day + 7) % 7;
    const firstSat = addDays(jan1, daysToSaturday);
    const targetSat = addDays(firstSat, weekNo * 7);
    return dateToYMD(targetSat);
}
function buildWeekdayDate(empIdx, r) {
    const year = seededRandom(`${empIdx}:OT:wdyear:${r}`) < 0.5 ? 2025 : 2026;
    const dayOfYear = seededRandInt(`${empIdx}:OT:wdday:${r}`, 0, 364);
    const jan1 = new Date(`${year}-01-01T00:00:00Z`);
    let candidate = addDays(jan1, dayOfYear);
    const dow = candidate.getUTCDay();
    if (dow === 0)
        candidate = addDays(candidate, 1);
    if (dow === 6)
        candidate = addDays(candidate, 2);
    return dateToYMD(candidate);
}
//# sourceMappingURL=full-seed.service.js.map