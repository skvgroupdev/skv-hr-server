"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seed.service");
const user_schema_1 = require("../modules/users/schemas/user.schema");
const configuration_1 = __importDefault(require("../config/configuration"));
let SeedAppModule = class SeedAppModule {
};
SeedAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ load: [configuration_1.default], isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        providers: [seed_service_1.SeedService],
    })
], SeedAppModule);
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(SeedAppModule, {
        logger: ['log', 'error', 'warn'],
    });
    await app.close();
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-runner.js.map