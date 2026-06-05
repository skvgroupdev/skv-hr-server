import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { TaxConfig, TaxConfigDocument } from '../modules/tax-configs/schemas/tax-config.schema';
import { Plan, PlanDocument } from '../modules/plans/schemas/plan.schema';
import { Position, PositionDocument } from '../modules/positions/schemas/position.schema';
import { Employee, EmployeeDocument, Gender } from '../modules/employees/schemas/employee.schema';

const BCRYPT_ROUNDS = 12;

const SKV_TENANT_ID = new Types.ObjectId('6a204182197fa00bfbb414f4');

const SKV_POSITIONS = [
  { name: 'General Manager', description: 'ຜູ້ຈັດການທົ່ວໄປ', level: 1, banding: 'L1' },
  { name: 'Sales Manager', description: 'ຜູ້ຈັດການຝ່າຍຂາຍ', level: 2, banding: 'L2' },
  { name: 'Finance Manager', description: 'ຜູ້ຈັດການຝ່າຍການເງິນ', level: 2, banding: 'L2' },
  { name: 'Service Manager', description: 'ຜູ້ຈັດການຝ່າຍບໍລິການ', level: 2, banding: 'L2' },
  { name: 'Sales Executive', description: 'ພະນັກງານຂາຍ', level: 3, banding: 'L3' },
  { name: 'Accountant', description: 'ນັກບັນຊີ', level: 3, banding: 'L3' },
  { name: 'Technician', description: 'ຊ່າງເຕັກນິກ', level: 3, banding: 'L3' },
  { name: 'Receptionist', description: 'ພະນັກງານຕ້ອນຮັບ', level: 4, banding: 'L4' },
];

const SKV_EMPLOYEES_DATA: { firstName: string; lastName: string; gender: Gender; dob: string; phone: string; position: string; salary: number; start: string }[] = [
  { firstName: 'ສົມສັກ', lastName: 'ວົງສາ', gender: 'MALE', dob: '1982-05-14', phone: '+85620123001', position: 'General Manager', salary: 15000000, start: '2024-01-15' },
  { firstName: 'ນາລີ', lastName: 'ພົມມະ', gender: 'FEMALE', dob: '1988-03-22', phone: '+85620123002', position: 'Sales Manager', salary: 10000000, start: '2024-02-01' },
  { firstName: 'ກິດຕິພົນ', lastName: 'ແສງດາລາ', gender: 'MALE', dob: '1990-07-08', phone: '+85620123003', position: 'Finance Manager', salary: 9000000, start: '2024-02-15' },
  { firstName: 'ບຸນມີ', lastName: 'ສີສຸວັນ', gender: 'MALE', dob: '1985-11-30', phone: '+85620123004', position: 'Service Manager', salary: 8000000, start: '2024-03-01' },
  { firstName: 'ມາລີ', lastName: 'ດວງຈັນ', gender: 'FEMALE', dob: '1995-04-18', phone: '+85620123005', position: 'Sales Executive', salary: 6000000, start: '2024-04-01' },
  { firstName: 'ສຸລິຍາ', lastName: 'ແກ້ວມະນີ', gender: 'MALE', dob: '1993-09-25', phone: '+85620123006', position: 'Sales Executive', salary: 6000000, start: '2024-04-01' },
  { firstName: 'ວິໄລ', lastName: 'ທອງລີ', gender: 'FEMALE', dob: '1997-01-12', phone: '+85620123007', position: 'Sales Executive', salary: 6000000, start: '2024-05-01' },
  { firstName: 'ພອນທິບ', lastName: 'ສີລາວົງ', gender: 'FEMALE', dob: '1992-06-03', phone: '+85620123008', position: 'Accountant', salary: 6500000, start: '2024-03-15' },
  { firstName: 'ຄຳພັນ', lastName: 'ໄຊຍະວົງ', gender: 'MALE', dob: '1991-12-20', phone: '+85620123009', position: 'Technician', salary: 5000000, start: '2024-04-15' },
  { firstName: 'ອຳໄພ', lastName: 'ລັດດາວົງ', gender: 'FEMALE', dob: '2001-08-07', phone: '+85620123010', position: 'Receptionist', salary: 4500000, start: '2025-01-06' },
];

const LAO_PDR_2026_BRACKETS = [
  { from: 0, to: 1300000, rate: 0.00 },
  { from: 1300001, to: 5000000, rate: 0.05 },
  { from: 5000001, to: 15000000, rate: 0.10 },
  { from: 15000001, to: 25000000, rate: 0.15 },
  { from: 25000001, to: 65000000, rate: 0.20 },
  { from: 65000001, to: null, rate: 0.24 },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(TaxConfig.name) private readonly taxConfigModel: Model<TaxConfigDocument>,
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
    @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSuperAdmin();
    await this.seedTaxConfig();
    await this.seedPlans();
    await this.seedSkvGroupData();
  }

  private async seedSuperAdmin() {
    const superAdminPhone = '+85620000001';
    const existing = await this.userModel.findOne({ phone: superAdminPhone, role: 'SUPER_ADMIN' });
    if (existing) return;

    const hashedPassword = await bcrypt.hash('Admin@1234', BCRYPT_ROUNDS);
    await this.userModel.create({
      phone: superAdminPhone,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      companyId: null,
      branchId: null,
      isActive: true,
    });

    this.logger.log('Super Admin seeded: phone=+85620000001 password=Admin@1234');
  }

  private async seedTaxConfig() {
    const existing = await this.taxConfigModel.findOne({ country: 'LA', year: 2026 });
    if (existing) return;

    await this.taxConfigModel.create({
      country: 'LA',
      year: 2026,
      currency: 'LAK',
      brackets: LAO_PDR_2026_BRACKETS,
      employeeSsRate: 0.055,
      employerSsRate: 0.06,
      effectiveFrom: new Date('2026-01-01'),
    });

    this.logger.log('Lao PDR 2026 tax config seeded');
  }

  private async seedPlans() {
    const count = await this.planModel.countDocuments();
    if (count > 0) return;

    await this.planModel.insertMany([
      {
        name: 'Basic',
        description: 'For small businesses',
        maxEmployees: 50,
        maxBranches: 3,
        maxStorageGB: 5,
        features: { attendance: true, leave: true, ot: true, payroll: false, advancedReport: false, announcement: true },
        trialDays: 30,
        price: 500000,
        currency: 'LAK',
      },
      {
        name: 'Standard',
        description: 'For medium businesses',
        maxEmployees: 200,
        maxBranches: 10,
        maxStorageGB: 20,
        features: { attendance: true, leave: true, ot: true, payroll: true, advancedReport: false, announcement: true },
        trialDays: 30,
        price: 1500000,
        currency: 'LAK',
      },
      {
        name: 'Enterprise',
        description: 'Unlimited plan for large enterprises',
        maxEmployees: 999999,
        maxBranches: 999999,
        maxStorageGB: 100,
        features: { attendance: true, leave: true, ot: true, payroll: true, advancedReport: true, announcement: true },
        trialDays: 30,
        price: 5000000,
        currency: 'LAK',
      },
    ]);

    this.logger.log('Default plans seeded: Basic, Standard, Enterprise');
  }

  private async seedSkvGroupData() {
    const positionMap = await this.seedSkvPositions();
    await this.seedSkvEmployees(positionMap);
  }

  private async seedSkvPositions(): Promise<Map<string, Types.ObjectId>> {
    const positionMap = new Map<string, Types.ObjectId>();

    for (const pos of SKV_POSITIONS) {
      const existing = await this.positionModel.findOne({ tenantId: SKV_TENANT_ID, name: pos.name });
      if (existing) {
        positionMap.set(pos.name, existing._id as Types.ObjectId);
        continue;
      }
      const created = await this.positionModel.create({ tenantId: SKV_TENANT_ID, ...pos });
      positionMap.set(pos.name, created._id as Types.ObjectId);
    }

    this.logger.log(`SKV Group positions seeded: ${SKV_POSITIONS.length} positions`);
    return positionMap;
  }

  private async seedSkvEmployees(positionMap: Map<string, Types.ObjectId>) {
    const hashedPassword = await bcrypt.hash('Staff@1234', BCRYPT_ROUNDS);
    let seededCount = 0;

    for (const emp of SKV_EMPLOYEES_DATA) {
      const existing = await this.employeeModel.findOne({ tenantId: SKV_TENANT_ID, phone: emp.phone });
      if (existing) continue;

      const user = await this.seedSkvUser(emp.phone, `${emp.firstName} ${emp.lastName}`, hashedPassword);

      await this.employeeModel.create({
        tenantId: SKV_TENANT_ID,
        firstName: emp.firstName,
        lastName: emp.lastName,
        gender: emp.gender,
        dateOfBirth: new Date(emp.dob),
        phone: emp.phone,
        nationality: 'Laos',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        startDate: new Date(emp.start),
        positionId: positionMap.get(emp.position) ?? null,
        baseSalary: emp.salary,
        workingHoursPerMonth: 208,
        branchId: null,
        departmentId: null,
        managerId: null,
        supervisorId: null,
        userId: user._id,
      });
      seededCount++;
    }

    this.logger.log(`SKV Group employees seeded: ${seededCount} new employees (password: Staff@1234)`);
  }

  private async seedSkvUser(phone: string, name: string, hashedPassword: string) {
    const existing = await this.userModel.findOne({ phone, companyId: SKV_TENANT_ID });
    if (existing) return existing;

    return this.userModel.create({
      phone,
      password: hashedPassword,
      name,
      role: 'STAFF',
      companyId: SKV_TENANT_ID,
      branchId: null,
      isActive: true,
    });
  }
}
