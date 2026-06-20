"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireFeatures = exports.REQUIRED_FEATURES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRED_FEATURES_KEY = 'requiredPlanFeatures';
const RequireFeatures = (...features) => (0, common_1.SetMetadata)(exports.REQUIRED_FEATURES_KEY, features);
exports.RequireFeatures = RequireFeatures;
//# sourceMappingURL=require-features.decorator.js.map