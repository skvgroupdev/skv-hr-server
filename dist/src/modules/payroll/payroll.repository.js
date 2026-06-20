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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payroll_period_schema_1 = require("./schemas/payroll-period.schema");
const payslip_schema_1 = require("./schemas/payslip.schema");
const MAX_LIMIT = 100;
let PayrollRepository = class PayrollRepository {
    periodModel;
    payslipModel;
    constructor(periodModel, payslipModel) {
        this.periodModel = periodModel;
        this.payslipModel = payslipModel;
    }
    createPeriod(data) {
        return this.periodModel.create(data);
    }
    findPeriodById(id, tenantId) {
        return this.periodModel.findOne({ _id: id, tenantId }).exec();
    }
    async findPeriodsPaginated(tenantId, page, limit) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.periodModel
                .find({ tenantId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.periodModel.countDocuments({ tenantId }).exec(),
        ]);
        return { items, total };
    }
    updatePeriod(id, tenantId, data) {
        return this.periodModel
            .findOneAndUpdate({ _id: id, tenantId }, data, {
            returnDocument: 'after',
        })
            .exec();
    }
    async createPayslips(payslips) {
        return this.payslipModel.insertMany(payslips);
    }
    async findPayslipsByPeriod(tenantId, periodId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, payrollPeriodId: periodId };
        const [items, total] = await Promise.all([
            this.payslipModel
                .find(filter)
                .populate('employeeId', 'firstName lastName employeeCode')
                .skip(skip)
                .limit(limit)
                .exec(),
            this.payslipModel.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    async findMyPayslips(tenantId, employeeId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { tenantId, employeeId };
        const [items, total] = await Promise.all([
            this.payslipModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.payslipModel.countDocuments(filter).exec(),
        ]);
        return { items, total };
    }
    findPayslipById(id, tenantId) {
        return this.payslipModel.findOne({ _id: id, tenantId }).exec();
    }
    updatePayslip(id, tenantId, data) {
        return this.payslipModel
            .findOneAndUpdate({ _id: id, tenantId }, data, {
            returnDocument: 'after',
        })
            .exec();
    }
    async updatePayslipStatuses(tenantId, periodId, status) {
        await this.payslipModel
            .updateMany({ tenantId, payrollPeriodId: periodId }, { status })
            .exec();
    }
    findPayslipByIdWithPopulate(id, tenantId) {
        return this.payslipModel
            .findOne({ _id: id, tenantId })
            .populate('employeeId', 'firstName lastName employeeCode')
            .populate('payrollPeriodId', 'name startDate endDate')
            .exec();
    }
    findPayslipByEmployeeAndPeriod(tenantId, periodId, employeeId) {
        return this.payslipModel
            .findOne({ tenantId, payrollPeriodId: periodId, employeeId })
            .exec();
    }
    async findAllPayslipsPaginated(tenantId, filter, page, limit, sort) {
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const skip = (page - 1) * safeLimit;
        const query = { tenantId };
        if (filter.periodId)
            query.payrollPeriodId = new mongoose_2.Types.ObjectId(filter.periodId);
        if (filter.status)
            query.status = filter.status;
        if (filter.employeeId)
            query.employeeId = new mongoose_2.Types.ObjectId(filter.employeeId);
        if (filter.employeeIds)
            query.employeeId = { $in: filter.employeeIds };
        if (filter.startDate)
            query['createdAt'] = {
                ...query['createdAt'],
                $gte: new Date(filter.startDate),
            };
        if (filter.endDate)
            query['createdAt'] = {
                ...query['createdAt'],
                $lte: new Date(filter.endDate),
            };
        const sortObj = buildSortObject(sort);
        const [data, total] = await Promise.all([
            this.payslipModel
                .find(query)
                .populate('employeeId', 'firstName lastName employeeCode')
                .sort(sortObj)
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.payslipModel.countDocuments(query).exec(),
        ]);
        return { data, total };
    }
    async findPayslipsByEmployee(tenantId, employeeId, page, limit) {
        const safeLimit = Math.min(MAX_LIMIT, limit);
        const skip = (page - 1) * safeLimit;
        const filter = { tenantId, employeeId };
        const [data, total] = await Promise.all([
            this.payslipModel
                .find(filter)
                .populate('payrollPeriodId', 'name startDate endDate')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit)
                .exec(),
            this.payslipModel.countDocuments(filter).exec(),
        ]);
        return { data, total };
    }
    async aggregatePeriodReport(tenantId, periodId) {
        const [result] = await this.payslipModel.aggregate([
            { $match: { tenantId, payrollPeriodId: periodId } },
            {
                $group: {
                    _id: null,
                    payslipCount: { $sum: 1 },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] },
                    },
                    totalGrossSalary: { $sum: '$grossSalary' },
                    totalNetSalary: { $sum: '$netSalary' },
                    totalEmployeeSsAmount: { $sum: '$employeeSsAmount' },
                    totalEmployerSsAmount: { $sum: '$employerSsAmount' },
                    totalIncomeTax: { $sum: '$incomeTax' },
                    totalOtAmount: { $sum: '$otAmount' },
                    totalLeaveDeductions: { $sum: '$leaveDeductionAmount' },
                    totalAllowances: {
                        $sum: {
                            $reduce: {
                                input: '$allowances',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.amount'] },
                            },
                        },
                    },
                    totalOtherDeductions: {
                        $sum: {
                            $reduce: {
                                input: '$otherDeductions',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.amount'] },
                            },
                        },
                    },
                },
            },
            { $project: { _id: 0 } },
        ]);
        return (result ?? {
            payslipCount: 0,
            approvedCount: 0,
            totalGrossSalary: 0,
            totalNetSalary: 0,
            totalEmployeeSsAmount: 0,
            totalEmployerSsAmount: 0,
            totalIncomeTax: 0,
            totalOtAmount: 0,
            totalLeaveDeductions: 0,
            totalAllowances: 0,
            totalOtherDeductions: 0,
        });
    }
    async getFinanceSummaryByEmployee(tenantId, employeeId) {
        const [summary] = await this.payslipModel.aggregate([
            { $match: { tenantId, employeeId } },
            {
                $group: {
                    _id: null,
                    totalPayslips: { $sum: 1 },
                    totalNetSalary: { $sum: '$netSalary' },
                    totalGrossSalary: { $sum: '$grossSalary' },
                    averageNetSalary: { $avg: '$netSalary' },
                },
            },
        ]);
        const monthlyBreakdown = await this.payslipModel.aggregate([
            { $match: { tenantId, employeeId } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    netSalary: { $sum: '$netSalary' },
                    grossSalary: { $sum: '$grossSalary' },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    netSalary: 1,
                    grossSalary: 1,
                },
            },
        ]);
        return {
            totalPayslips: summary?.totalPayslips ?? 0,
            totalNetSalary: summary?.totalNetSalary ?? 0,
            totalGrossSalary: summary?.totalGrossSalary ?? 0,
            averageNetSalary: summary?.averageNetSalary ?? 0,
            monthlyBreakdown,
        };
    }
};
exports.PayrollRepository = PayrollRepository;
exports.PayrollRepository = PayrollRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payroll_period_schema_1.PayrollPeriod.name)),
    __param(1, (0, mongoose_1.InjectModel)(payslip_schema_1.Payslip.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PayrollRepository);
function buildSortObject(sort) {
    const field = sort.startsWith('-') ? sort.slice(1) : sort;
    const order = sort.startsWith('-') ? -1 : 1;
    return { [field]: order };
}
//# sourceMappingURL=payroll.repository.js.map