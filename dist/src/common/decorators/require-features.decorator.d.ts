import type { PlanFeature } from '../../modules/plans/schemas/plan.schema';
export declare const REQUIRED_FEATURES_KEY = "requiredPlanFeatures";
export declare const RequireFeatures: (...features: PlanFeature[]) => import("@nestjs/common").CustomDecorator<string>;
