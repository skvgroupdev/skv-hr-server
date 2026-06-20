import { Model, Types } from 'mongoose';
import { PayrollPeriod, PayrollPeriodDocument } from './schemas/payroll-period.schema';
import { Payslip, PayslipDocument } from './schemas/payslip.schema';
export declare class PayrollRepository {
    private readonly periodModel;
    private readonly payslipModel;
    constructor(periodModel: Model<PayrollPeriodDocument>, payslipModel: Model<PayslipDocument>);
    createPeriod(data: Partial<PayrollPeriod>): Promise<PayrollPeriodDocument>;
    findPeriodById(id: string, tenantId: Types.ObjectId): Promise<PayrollPeriodDocument | null>;
    findPeriodsPaginated(tenantId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & PayrollPeriod & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, PayrollPeriod, {}, import("mongoose").DefaultSchemaOptions> & PayrollPeriod & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    updatePeriod(id: string, tenantId: Types.ObjectId, data: Partial<PayrollPeriod>): Promise<PayrollPeriodDocument | null>;
    createPayslips(payslips: Partial<Payslip>[]): Promise<PayslipDocument[]>;
    findPayslipsByPeriod(tenantId: Types.ObjectId, periodId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payslip, {}, import("mongoose").DefaultSchemaOptions> & Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Payslip, {}, import("mongoose").DefaultSchemaOptions> & Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    findMyPayslips(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Payslip, {}, import("mongoose").DefaultSchemaOptions> & Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Payslip, {}, import("mongoose").DefaultSchemaOptions> & Payslip & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        total: number;
    }>;
    findPayslipById(id: string, tenantId: Types.ObjectId): Promise<PayslipDocument | null>;
    updatePayslip(id: string, tenantId: Types.ObjectId, data: Partial<Payslip>): Promise<PayslipDocument | null>;
    updatePayslipStatuses(tenantId: Types.ObjectId, periodId: Types.ObjectId, status: Payslip['status']): Promise<void>;
    findPayslipByIdWithPopulate(id: string, tenantId: Types.ObjectId): Promise<PayslipDocument | null>;
    findPayslipByEmployeeAndPeriod(tenantId: Types.ObjectId, periodId: Types.ObjectId, employeeId: Types.ObjectId): Promise<PayslipDocument | null>;
    findAllPayslipsPaginated(tenantId: Types.ObjectId, filter: {
        periodId?: string;
        employeeId?: string;
        status?: string;
        employeeIds?: Types.ObjectId[];
        startDate?: string;
        endDate?: string;
    }, page: number, limit: number, sort: string): Promise<{
        data: PayslipDocument[];
        total: number;
    }>;
    findPayslipsByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId, page: number, limit: number): Promise<{
        data: PayslipDocument[];
        total: number;
    }>;
    aggregatePeriodReport(tenantId: Types.ObjectId, periodId: Types.ObjectId): Promise<any>;
    getFinanceSummaryByEmployee(tenantId: Types.ObjectId, employeeId: Types.ObjectId): Promise<{
        totalPayslips: number;
        totalNetSalary: number;
        totalGrossSalary: number;
        averageNetSalary: number;
        monthlyBreakdown: {
            year: number;
            month: number;
            netSalary: number;
            grossSalary: number;
        }[];
    }>;
}
