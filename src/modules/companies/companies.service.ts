import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CompaniesRepository } from './companies.repository';
import { UsersRepository } from '../users/users.repository';
import { PlansRepository } from '../plans/plans.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import {
  ExtendSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/update-subscription.dto';
import type { CompanyStatus, SubscriptionStatus } from './schemas/company.schema';

const BCRYPT_ROUNDS = 12;
const MAX_LIMIT = 100;

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly plansRepository: PlansRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createCompany(dto: CreateCompanyDto, actorId: string, actorRole: string) {
    if (dto.planId) {
      this.assertObjectId(dto.planId, 'Invalid plan id');
      const plan = await this.plansRepository.findById(dto.planId);
      if (!plan || !plan.isActive) {
        throw new BadRequestException('Active plan not found');
      }
    }

    // Auto-generate companyCode from first 3 letters of name if not provided
    const companyCode = dto.companyCode ?? this.deriveCompanyCode(dto.name);
    const company = await this.companiesRepository.create({ ...dto, companyCode });

    await this.auditLogService.log({
      actorId,
      actorRole,
      action: 'CREATE_COMPANY',
      module: 'companies',
      targetId: company._id as Types.ObjectId,
      after: { name: company.name, status: company.status, planId: dto.planId },
    });

    return company;
  }

  async listCompanies(query: CompanyQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const sort = query.sort ?? '-createdAt';

    const { companies, total } = await this.companiesRepository.findPaginated(page, limit, sort);
    const totalPages = Math.ceil(total / limit);

    return {
      data: companies,
      meta: { page, limit, total, totalPages },
    };
  }

  async getCompany(id: string) {
    this.assertObjectId(id, 'Invalid company id');
    const company = await this.companiesRepository.findByIdWithPlan(id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async updateCompany(id: string, dto: UpdateCompanyDto, actorId: string, actorRole: string) {
    const existing = await this.companiesRepository.findById(id);
    if (!existing) throw new NotFoundException('Company not found');

    const updated = await this.companiesRepository.update(id, dto);

    await this.auditLogService.log({
      actorId,
      actorRole,
      action: 'UPDATE_COMPANY',
      module: 'companies',
      targetId: new Types.ObjectId(id),
      before: { name: existing.name },
      after: dto as unknown as Record<string, unknown>,
    });

    return updated;
  }

  async activateCompany(id: string, actorId: string, actorRole: string) {
    const company = await this.companiesRepository.findById(id);
    if (!company) throw new NotFoundException('Company not found');

    const updated = await this.companiesRepository.updateStatus(id, 'ACTIVE');

    await this.auditLogService.log({
      actorId,
      actorRole,
      action: 'ACTIVATE_COMPANY',
      module: 'companies',
      targetId: new Types.ObjectId(id),
      before: { status: company.status },
      after: { status: 'ACTIVE' },
    });

    return updated;
  }

  async suspendCompany(id: string, actorId: string, actorRole: string) {
    const company = await this.companiesRepository.findById(id);
    if (!company) throw new NotFoundException('Company not found');

    const updated = await this.companiesRepository.updateStatus(id, 'SUSPENDED');

    await this.auditLogService.log({
      actorId,
      actorRole,
      action: 'SUSPEND_COMPANY',
      module: 'companies',
      targetId: new Types.ObjectId(id),
      before: { status: company.status },
      after: { status: 'SUSPENDED' },
    });

    return updated;
  }

  async assignPlan(
    companyId: string,
    planId: string,
    startDate: string,
    endDate: string,
    isPaid: boolean,
    actorId: string,
  ) {
    this.assertObjectId(companyId, 'Invalid company id');
    this.assertObjectId(planId, 'Invalid plan id');
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const plan = await this.plansRepository.findById(planId);
    if (!plan || !plan.isActive) throw new NotFoundException('Active plan not found');

    const parsedStartDate = this.parseDate(startDate, 'Invalid subscription start date');
    const parsedEndDate = this.parseDate(endDate, 'Invalid subscription end date');
    if (parsedEndDate <= parsedStartDate) {
      throw new BadRequestException('Subscription end date must be after start date');
    }

    const updated = await this.companiesRepository.update(companyId, {
      planId: new Types.ObjectId(planId) as unknown as string,
      subscription: {
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: 'ACTIVE',
        isPaid,
      },
      status: 'ACTIVE',
    } as unknown as import('./dto/update-company.dto').UpdateCompanyDto);

    await this.auditLogService.log({
      actorId,
      actorRole: 'SUPER_ADMIN',
      action: 'ASSIGN_PLAN',
      module: 'companies',
      targetId: new Types.ObjectId(companyId),
      before: {
        planId: company.planId?.toString() ?? null,
        subscription: company.subscription,
      },
      after: { planId, startDate, endDate, isPaid },
    });

    return updated;
  }

  async updateSubscription(
    companyId: string,
    dto: UpdateSubscriptionDto,
    actorId: string,
  ) {
    this.assertObjectId(companyId, 'Invalid company id');
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');
    if (!company.planId) {
      throw new BadRequestException('Assign a plan before updating subscription');
    }

    const startDate = dto.startDate
      ? this.parseDate(dto.startDate, 'Invalid subscription start date')
      : company.subscription?.startDate;
    const endDate = dto.endDate
      ? this.parseDate(dto.endDate, 'Invalid subscription end date')
      : company.subscription?.endDate;
    if (startDate && endDate && endDate <= startDate) {
      throw new BadRequestException('Subscription end date must be after start date');
    }

    const subscriptionStatus =
      dto.status ?? company.subscription?.status ?? 'ACTIVE';
    const updated = await this.companiesRepository.update(companyId, {
      subscription: {
        startDate,
        endDate,
        status: subscriptionStatus,
        isPaid: dto.isPaid ?? company.subscription?.isPaid ?? false,
      },
      status: this.mapSubscriptionToCompanyStatus(subscriptionStatus),
    } as unknown as UpdateCompanyDto);

    await this.auditLogService.log({
      actorId,
      actorRole: 'SUPER_ADMIN',
      action: 'UPDATE_SUBSCRIPTION',
      module: 'companies',
      targetId: new Types.ObjectId(companyId),
      before: { subscription: company.subscription },
      after: dto as Record<string, unknown>,
    });

    return updated;
  }

  async extendSubscription(
    companyId: string,
    dto: ExtendSubscriptionDto,
    actorId: string,
  ) {
    this.assertObjectId(companyId, 'Invalid company id');
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');
    const endDate = this.parseDate(dto.endDate, 'Invalid subscription end date');
    const currentEndDate = company.subscription?.endDate;
    if (currentEndDate && endDate <= currentEndDate) {
      throw new BadRequestException('New end date must be after current end date');
    }

    return this.updateSubscription(
      companyId,
      {
        endDate: dto.endDate,
        status: 'ACTIVE',
        isPaid: dto.isPaid ?? company.subscription?.isPaid ?? false,
      },
      actorId,
    );
  }

  async getUsage(companyId: string) {
    this.assertObjectId(companyId, 'Invalid company id');
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');
    const companyObjectId = new Types.ObjectId(companyId);
    const [employees, branches, plan] = await Promise.all([
      this.companiesRepository.countActiveEmployees(companyObjectId),
      this.companiesRepository.countActiveBranches(companyObjectId),
      company.planId
        ? this.plansRepository.findById(company.planId.toString())
        : Promise.resolve(null),
    ]);
    return {
      companyId,
      employees,
      branches,
      storageUsedGB: 0,
      limits: plan
        ? {
            maxEmployees: plan.maxEmployees,
            maxBranches: plan.maxBranches,
            maxStorageGB: plan.maxStorageGB,
          }
        : null,
    };
  }

  async getSuperDashboard() {
    const { companies, total } = await this.companiesRepository.findPaginated(1, 1000, '-createdAt');
    const activeCount = companies.filter((c) => c.status === 'ACTIVE').length;
    const trialCount = companies.filter((c) => c.status === 'TRIAL').length;
    const suspendedCount = companies.filter((c) => c.status === 'SUSPENDED').length;
    return { total, active: activeCount, trial: trialCount, suspended: suspendedCount };
  }

  async createOwner(companyId: string, dto: CreateOwnerDto, actorId: string, actorRole: string) {
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const companyObjectId = company._id as Types.ObjectId;
    const alreadyExists = await this.usersRepository.existsByPhoneAndCompany(
      dto.phone,
      companyObjectId,
    );
    if (alreadyExists) throw new ConflictException('Phone already registered in this company');

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const owner = await this.usersRepository.create({
      phone: dto.phone,
      name: dto.name,
      password: hashedPassword,
      role: 'COMPANY_OWNER',
      companyId: companyObjectId,
      branchId: null,
      isActive: true,
    });

    await this.auditLogService.log({
      tenantId: companyObjectId,
      actorId,
      actorRole,
      action: 'CREATE_USER',
      module: 'companies',
      targetId: owner._id as Types.ObjectId,
      after: { phone: dto.phone, role: 'COMPANY_OWNER', companyId },
    });

    return owner;
  }

  private deriveCompanyCode(companyName: string): string {
    return companyName
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
      .slice(0, 3) || 'COM';
  }

  private assertObjectId(value: string, message: string) {
    if (!Types.ObjectId.isValid(value)) throw new BadRequestException(message);
  }

  private parseDate(value: string, message: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new BadRequestException(message);
    return date;
  }

  private mapSubscriptionToCompanyStatus(
    status: SubscriptionStatus,
  ): CompanyStatus {
    if (status === 'TRIAL') return 'TRIAL';
    if (status === 'EXPIRED' || status === 'CANCELLED') return 'EXPIRED';
    if (status === 'SUSPENDED') return 'SUSPENDED';
    return 'ACTIVE';
  }
}
