import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CompaniesRepository } from '../../modules/companies/companies.repository';
import { PlansRepository } from '../../modules/plans/plans.repository';
import type { PlanFeature } from '../../modules/plans/schemas/plan.schema';
import { REQUIRED_FEATURES_KEY } from '../decorators/require-features.decorator';

interface JwtPayload {
  sub: string;
  role: string;
  companyId: string | null;
}

// Routes exempt from subscription check
const EXEMPT_ROLES = ['SUPER_ADMIN'];

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly companiesRepository: CompaniesRepository,
    private readonly plansRepository: PlansRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user) return true;
    if (EXEMPT_ROLES.includes(user.role)) return true;
    if (!user.companyId) return true;

    const company = await this.companiesRepository.findById(user.companyId);

    if (!company) throw new ForbiddenException('Company not found');

    const subStatus =
      (
        company as unknown as {
          subscription?: { status?: string; endDate?: Date | string };
          status: string;
        }
      ).subscription?.status ?? company.status;

    if (
      subStatus === 'SUSPENDED' ||
      subStatus === 'EXPIRED' ||
      subStatus === 'CANCELLED'
    ) {
      throw new ForbiddenException('ສັນຍາໝົດອາຍຸ ກະລຸນາຕິດຕໍ່ SKV Group');
    }

    const subscriptionEndDate = company.subscription?.endDate
      ? new Date(company.subscription.endDate)
      : null;
    if (
      subscriptionEndDate &&
      !Number.isNaN(subscriptionEndDate.getTime()) &&
      subscriptionEndDate < new Date()
    ) {
      throw new ForbiddenException('ສັນຍາໝົດອາຍຸ ກະລຸນາຕິດຕໍ່ SKV Group');
    }

    const requiredFeatures = this.reflector.getAllAndOverride<PlanFeature[]>(
      REQUIRED_FEATURES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredFeatures?.length) return true;

    if (!company.planId) {
      throw new ForbiddenException(
        'Feature is not available in the current plan',
      );
    }

    const plan = await this.plansRepository.findById(company.planId.toString());
    const missingFeature = requiredFeatures.find(
      (feature) => !plan?.features?.[feature],
    );
    if (missingFeature) {
      throw new ForbiddenException(
        `Feature ${missingFeature} is not available in the current plan`,
      );
    }

    return true;
  }
}
