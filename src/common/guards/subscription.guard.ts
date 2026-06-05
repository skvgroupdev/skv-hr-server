import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../modules/companies/schemas/company.schema';

interface JwtPayload {
  sub: string;
  role: string;
  companyId: string | null;
}

// Routes exempt from subscription check
const EXEMPT_ROLES = ['SUPER_ADMIN'];

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(@InjectModel(Company.name) private readonly companyModel: Model<Company>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user) return true;
    if (EXEMPT_ROLES.includes(user.role)) return true;
    if (!user.companyId) return true;

    const company = await this.companyModel
      .findById(user.companyId)
      .select('subscription status')
      .lean()
      .exec();

    if (!company) return true;

    const subStatus = (company as unknown as { subscription?: { status?: string }; status: string })
      .subscription?.status ?? company.status;

    if (subStatus === 'SUSPENDED' || subStatus === 'EXPIRED') {
      throw new ForbiddenException('ສັນຍາໝົດອາຍຸ ກະລຸນາຕິດຕໍ່ SKV Group');
    }

    return true;
  }
}
