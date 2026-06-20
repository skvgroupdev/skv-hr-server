"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("../modules/users/schemas/user.schema");
const configuration_1 = __importDefault(require("../config/configuration"));
const TARGET_PHONE = '+8562055552222';
const NEW_PASSWORD = '12345678';
const BCRYPT_ROUNDS = 12;
let FixPasswordService = class FixPasswordService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async run() {
        const users = await this.userModel.find({ phone: TARGET_PHONE }).lean();
        if (users.length === 0) {
            console.error(`No user found with phone ${TARGET_PHONE}`);
            return;
        }
        console.log(`Found ${users.length} user(s) with phone ${TARGET_PHONE}`);
        const hashed = await bcrypt.hash(NEW_PASSWORD, BCRYPT_ROUNDS);
        for (const user of users) {
            await this.userModel.updateOne({ _id: user._id }, { $set: { password: hashed } });
            console.log(`Updated password for user _id=${user._id} role=${user.role} companyId=${user.companyId ?? 'null'}`);
        }
        console.log('Done. Password has been re-hashed with bcrypt rounds=12.');
    }
};
FixPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FixPasswordService);
let FixPasswordAppModule = class FixPasswordAppModule {
};
FixPasswordAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ load: [configuration_1.default], isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skv_hr'),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        providers: [FixPasswordService],
    })
], FixPasswordAppModule);
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(FixPasswordAppModule, {
        logger: ['log', 'error', 'warn'],
    });
    const service = app.get(FixPasswordService);
    await service.run();
    await app.close();
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=fix-password-runner.js.map