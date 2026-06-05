import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CompaniesRepository } from './companies.repository';
import { UsersRepository } from '../users/users.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { CompanyQueryDto } from './dto/company-query.dto';

const BCRYPT_ROUNDS = 12;
const MAX_LIMIT = 100;

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createCompany(dto: CreateCompanyDto, actorId: string, actorRole: string) {
    const company = await this.companiesRepository.create(dto);
    const companyId = (company._id as Types.ObjectId).toString();

    await this.auditLogService.log({
      actorId,
      actorRole,
      action: 'CREATE_COMPANY',
      module: 'companies',
      targetId: company._id as Types.ObjectId,
      after: { name: company.name, status: company.status },
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
    const company = await this.companiesRepository.findById(id);
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
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const updated = await this.companiesRepository.update(companyId, {
      planId: new Types.ObjectId(planId) as unknown as string,
      subscription: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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
      after: { planId, startDate, endDate, isPaid },
    });

    return updated;
  }

  async getUsage(companyId: string) {
    const company = await this.companiesRepository.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');
    // Basic usage stats — full implementation needs branch + storage counts
    return { companyId, employees: 0, branches: 0, storageUsed: 0 };
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
}
