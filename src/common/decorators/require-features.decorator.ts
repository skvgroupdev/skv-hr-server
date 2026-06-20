import { SetMetadata } from '@nestjs/common';
import type { PlanFeature } from '../../modules/plans/schemas/plan.schema';

export const REQUIRED_FEATURES_KEY = 'requiredPlanFeatures';

export const RequireFeatures = (...features: PlanFeature[]) =>
  SetMetadata(REQUIRED_FEATURES_KEY, features);
