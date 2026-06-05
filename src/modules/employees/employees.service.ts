import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { EmployeesRepository } from './employees.repository';
import type { EmployeeDocument, EmployeeStatus } from './schemas/employee.schema';
import { UsersRepository } from '../users/users.repository';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { DocumentsService } from '../documents/documents.service';
import type { DocumentType } from '../documents/schemas/document.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

const BCRYPT_ROUNDS = 12;

const ASSIGNABLE_ROLES: Record<string, string[]> = {
  COMPANY_OWNER: ['HR_ADMIN', 'BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'],
  HR_ADMIN: ['BRANCH_MANAGER', 'SUPERVISOR', 'STAFF'],
};

function assertCanAssignRole(actorRole: string, targetRole: string): void {
  const allowed = ASSIGNABLE_ROLES[actorRole] ?? [];
  if (!allowed.includes(targetRole)) {
    throw new ForbiddenException(`ບໍ່ສາມາດກຳນົດ role ${targetRole} ໄດ້`);
  }
}

// ---- populated-ref helpers ----
interface PopulatedRef {
  _id: Types.ObjectId;
  name: string;
}

function normalizeRef(
  field: Types.ObjectId | PopulatedRef | null | undefined,
): { id: string; name: string } | null {
  if (!field) return null;
  if (typeof field === 'object' && 'name' in field) {
    return { id: (field as PopulatedRef)._id.toString(), name: (field as PopulatedRef).name };
  }
  return null;
}

function toEmployeeResponse(doc: EmployeeDocument): Record<string, unknown> {
  const obj = doc.toJSON() as unknown as Record<string, unknown>;

  const rawBranch = doc.branchId as unknown as PopulatedRef | Types.ObjectId | null;
  const rawDept = doc.departmentId as unknown as PopulatedRef | Types.ObjectId | null;
  const rawPos = doc.positionId as unknown as PopulatedRef | Types.ObjectId | null;

  const branchNorm = normalizeRef(rawBranch);
  const deptNorm = normalizeRef(rawDept);
  const posNorm = normalizeRef(rawPos);

  return {
    ...obj,
    branchId: branchNorm?.id ?? null,
    departmentId: deptNorm?.id ?? null,
    positionId: posNorm?.id ?? null,
    branch: branchNorm,
    department: deptNorm,
    position: posNorm,
  };
}
// --------------------------------
const MAX_LIMIT = 100;

function buildYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}${month}`;
}

interface ListFilter {
  tenantId: Types.ObjectId;
  status?: EmployeeStatus;
  branchId?: Types.ObjectId;
  departmentId?: Types.ObjectId;
  $or?: Array<Record<string, unknown>>;
  $and?: Array<Record<string, unknown>>;
}

function buildListFilter(currentUser: JwtPayload, query: EmployeeQueryDto): ListFilter {
  const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
  const baseFilter: ListFilter = { tenantId: tenantObjectId };

  if (query.status) baseFilter.status = query.status;

  // BRANCH_MANAGER sees only their branch employees
  if (currentUser.role === 'BRANCH_MANAGER' && currentUser.branchId) {
    baseFilter.branchId = new Types.ObjectId(currentUser.branchId);
  } else if (query.branchId) {
    baseFilter.branchId = new Types.ObjectId(query.branchId);
  }

  if (query.departmentId) baseFilter.departmentId = new Types.ObjectId(query.departmentId);

  // SUPERVISOR sees only their direct reports
  if (currentUser.role === 'SUPERVISOR') {
    const actorObjectId = new Types.ObjectId(currentUser.sub);
    baseFilter.$or = [{ managerId: actorObjectId }, { supervisorId: actorObjectId }];
  }

  if (query.search) {
    const searchRegex = { $regex: query.search, $options: 'i' };
    const searchConditions = [{ firstName: searchRegex }, { lastName: searchRegex }];
    if (baseFilter.$or) {
      // combine: (managerId OR supervisorId) AND (firstName OR lastName)
      baseFilter.$and = [{ $or: baseFilter.$or }, { $or: searchConditions }];
      delete baseFilter.$or;
    } else {
      baseFilter.$or = searchConditions;
    }
  }

  return baseFilter;
}

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly auditLogService: AuditLogService,
    private readonly documentsService: DocumentsService,
  ) {}

  async create(currentUser: JwtPayload, dto: CreateEmployeeDto) {
    const tenantId = currentUser.companyId!;
    const tenantObjectId = new Types.ObjectId(tenantId);

    // TODO: Check subscription plan limit (plan.maxEmployees) before creating
    // const count = await this.employeesRepository.countByTenant(tenantObjectId);
    // if (count >= plan.maxEmployees) throw new ForbiddenException('ຮອດຂີດຈຳກັດພະນັກງານ');

    // Auto-generate employeeCode if not provided
    const employeeCode =
      dto.employeeCode ?? (await this.employeesRepository.generateNextCode(tenantObjectId, buildYearMonth()));

    // Check phone uniqueness via duplicate key catch (index enforces it)
    const employee = await this.employeesRepository
      .create(tenantObjectId, { ...dto, employeeCode })
      .catch((err: { code?: number }) => {
        if (err.code === 11000) {
          throw new ConflictException('Phone number already registered in this company');
        }
        throw err;
      });

    // Create linked user account
    const assignedRole = dto.role ?? 'STAFF';
    assertCanAssignRole(currentUser.role, assignedRole);

    const rawPassword = dto.initialPassword ?? Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, BCRYPT_ROUNDS);

    const alreadyHasUser = await this.usersRepository.existsByPhoneAndCompany(
      dto.phone,
      tenantObjectId,
    );

    if (!alreadyHasUser) {
      const user = await this.usersRepository.create({
        phone: dto.phone,
        name: `${dto.firstName} ${dto.lastName}`,
        password: hashedPassword,
        role: assignedRole,
        companyId: tenantObjectId,
        branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : null,
        isActive: true,
      });
      await this.employeesRepository.linkUser(
        (employee._id as Types.ObjectId).toString(),
        tenantObjectId,
        user._id as Types.ObjectId,
      );
    }

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId: currentUser.sub,
      actorRole: currentUser.role,
      action: 'CREATE_EMPLOYEE',
      module: 'employees',
      targetId: employee._id as Types.ObjectId,
      after: { employeeCode, phone: dto.phone, firstName: dto.firstName, lastName: dto.lastName },
    });

    return employee;
  }

  async list(currentUser: JwtPayload, query: EmployeeQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(MAX_LIMIT, parseInt(query.limit ?? '20', 10));
    const sort = query.sort ?? '-createdAt';
    const filter = buildListFilter(currentUser, query);

    const { employees, total } = await this.employeesRepository.findPaginated(
      filter as unknown as Parameters<EmployeesRepository['findPaginated']>[0],
      page,
      limit,
      sort,
    );

    return {
      data: employees.map(toEmployeeResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(currentUser: JwtPayload, id: string) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findById(id, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');

    // STAFF can only see their own record
    if (currentUser.role === 'STAFF') {
      const isOwnRecord = employee.userId?.toString() === currentUser.sub;
      if (!isOwnRecord) throw new ForbiddenException('Access denied');
    }

    return toEmployeeResponse(employee);
  }

  async update(currentUser: JwtPayload, id: string, dto: UpdateEmployeeDto) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const existing = await this.employeesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Employee not found');

    // phone uniqueness check — only if phone is being changed
    if (dto.phone && dto.phone !== existing.phone) {
      const phoneTaken = await this.usersRepository.existsByPhoneAndCompany(
        dto.phone,
        tenantObjectId,
      );
      if (phoneTaken) throw new ConflictException('Phone number already registered in this company');
    }

    const updated = await this.employeesRepository.update(id, tenantObjectId, dto);

    // sync linked user account
    if (existing.userId) {
      const userId = existing.userId.toString();
      if (dto.phone && dto.phone !== existing.phone) {
        await this.usersRepository.updatePhone(userId, dto.phone);
      }
      if (dto.newPassword) {
        const hashed = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.usersRepository.updatePassword(userId, hashed);
      }
    }

    // strip newPassword before audit log
    const { newPassword: _pw, ...auditAfter } = dto as UpdateEmployeeDto & { newPassword?: string };

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId: currentUser.sub,
      actorRole: currentUser.role,
      action: 'UPDATE_EMPLOYEE',
      module: 'employees',
      targetId: new Types.ObjectId(id),
      before: { firstName: existing.firstName, lastName: existing.lastName, phone: existing.phone },
      after: auditAfter as unknown as Record<string, unknown>,
    });

    return updated ? toEmployeeResponse(updated) : null;
  }

  async deactivate(currentUser: JwtPayload, id: string) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const existing = await this.employeesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Employee not found');

    const updated = await this.employeesRepository.setStatus(id, tenantObjectId, 'INACTIVE');

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId: currentUser.sub,
      actorRole: currentUser.role,
      action: 'DEACTIVATE_EMPLOYEE',
      module: 'employees',
      targetId: new Types.ObjectId(id),
      before: { status: existing.status },
      after: { status: 'INACTIVE' },
    });

    return updated;
  }

  async reactivate(currentUser: JwtPayload, id: string) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const existing = await this.employeesRepository.findById(id, tenantObjectId);
    if (!existing) throw new NotFoundException('Employee not found');

    const updated = await this.employeesRepository.setStatus(id, tenantObjectId, 'ACTIVE');

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId: currentUser.sub,
      actorRole: currentUser.role,
      action: 'REACTIVATE_EMPLOYEE',
      module: 'employees',
      targetId: new Types.ObjectId(id),
      before: { status: existing.status },
      after: { status: 'ACTIVE' },
    });

    return updated;
  }

  async uploadDocument(currentUser: JwtPayload, id: string, dto: UploadDocumentDto) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findById(id, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');

    return this.documentsService.addDocument({
      tenantId: tenantObjectId,
      employeeId: employee._id as Types.ObjectId,
      fileName: dto.fileName,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType,
      documentType: dto.documentType as DocumentType | undefined,
      description: dto.description,
      uploadedBy: new Types.ObjectId(currentUser.sub),
    });
  }

  async changeRole(currentUser: JwtPayload, employeeId: string, newRole: string) {
    assertCanAssignRole(currentUser.role, newRole);

    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findById(employeeId, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');
    if (!employee.userId) throw new ForbiddenException('Employee has no linked user account');

    const userId = employee.userId.toString();
    await this.usersRepository.updateRole(userId, newRole);

    await this.auditLogService.log({
      tenantId: tenantObjectId,
      actorId: currentUser.sub,
      actorRole: currentUser.role,
      action: 'CHANGE_ROLE',
      module: 'employees',
      targetId: new Types.ObjectId(employeeId),
      after: { role: newRole },
    });

    return { message: 'Role updated successfully', role: newRole };
  }

  async updateMyProfile(currentUser: JwtPayload, dto: UpdateMyProfileDto) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const userObjectId = new Types.ObjectId(currentUser.sub);

    const updated = await this.employeesRepository.updateByUserIdAndTenant(
      userObjectId,
      tenantObjectId,
      dto as unknown as Record<string, unknown>,
    );

    if (!updated) throw new NotFoundException('Employee profile not found');
    return toEmployeeResponse(updated);
  }

  async getDocuments(currentUser: JwtPayload, id: string) {
    const tenantObjectId = new Types.ObjectId(currentUser.companyId!);
    const employee = await this.employeesRepository.findById(id, tenantObjectId);
    if (!employee) throw new NotFoundException('Employee not found');

    // STAFF can only see their own documents
    if (currentUser.role === 'STAFF') {
      const isOwnRecord = employee.userId?.toString() === currentUser.sub;
      if (!isOwnRecord) throw new ForbiddenException('Access denied');
    }

    return this.documentsService.getEmployeeDocuments(
      employee._id as Types.ObjectId,
      tenantObjectId,
    );
  }
}
