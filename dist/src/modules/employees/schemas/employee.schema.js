"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSchema = exports.Employee = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Employee = class Employee {
    tenantId;
    employeeCode;
    firstName;
    lastName;
    firstNameEn;
    lastNameEn;
    nickname;
    gender;
    dateOfBirth;
    phone;
    email;
    address;
    photoUrl;
    nationality;
    emergencyContact;
    employmentType;
    startDate;
    probationEndDate;
    resignationDate;
    status;
    branchId;
    departmentId;
    positionId;
    managerId;
    supervisorId;
    baseSalary;
    allowances;
    workingHoursPerMonth;
    bankName;
    bankAccount;
    paymentMethod;
    userId;
    isDeleted;
};
exports.Employee = Employee;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Employee.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "firstNameEn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "lastNameEn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['MALE', 'FEMALE', 'OTHER'] }),
    __metadata("design:type", String)
], Employee.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Employee.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, lowercase: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "photoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "nationality", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: String,
            phone: String,
            relation: String,
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Employee.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'],
    }),
    __metadata("design:type", String)
], Employee.prototype, "employmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "probationEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Employee.prototype, "resignationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [
            'ACTIVE',
            'INACTIVE',
            'PROBATION',
            'RESIGNED',
            'SUSPENDED',
            'TERMINATED',
        ],
        default: 'ACTIVE',
    }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "branchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Department', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "departmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Position', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "positionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "managerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "supervisorId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Employee.prototype, "baseSalary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ name: String, amount: Number }], default: [] }),
    __metadata("design:type", Array)
], Employee.prototype, "allowances", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 208 }),
    __metadata("design:type", Number)
], Employee.prototype, "workingHoursPerMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "bankName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "bankAccount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Employee.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", Object)
], Employee.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Employee.prototype, "isDeleted", void 0);
exports.Employee = Employee = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
            },
        },
    })
], Employee);
exports.EmployeeSchema = mongoose_1.SchemaFactory.createForClass(Employee);
exports.EmployeeSchema.index({ tenantId: 1 });
exports.EmployeeSchema.index({ tenantId: 1, phone: 1 }, { unique: true });
exports.EmployeeSchema.index({ tenantId: 1, branchId: 1 });
exports.EmployeeSchema.index({ tenantId: 1, departmentId: 1 });
//# sourceMappingURL=employee.schema.js.map