import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CompaniesRepository } from '../../modules/companies/companies.repository';
import { PlansRepository } from '../../modules/plans/plans.repository';
export declare class SubscriptionGuard implements CanActivate {
    private readonly reflector;
    private readonly companiesRepository;
    private readonly plansRepository;
    constructor(reflector: Reflector, companiesRepository: CompaniesRepository, plansRepository: PlansRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
