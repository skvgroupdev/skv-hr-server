"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRecordSchema = exports.DocumentRecord = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DocumentRecord = class DocumentRecord {
    tenantId;
    employeeId;
    fileName;
    fileUrl;
    fileType;
    documentType;
    description;
    uploadedBy;
};
exports.DocumentRecord = DocumentRecord;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Company', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DocumentRecord.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DocumentRecord.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "fileType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['ID_CARD', 'PASSPORT', 'CONTRACT', 'CV', 'CERTIFICATE', 'MEDICAL', 'OTHER'],
        default: 'OTHER',
    }),
    __metadata("design:type", String)
], DocumentRecord.prototype, "documentType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DocumentRecord.prototype, "uploadedBy", void 0);
exports.DocumentRecord = DocumentRecord = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret._id;
            },
        },
    })
], DocumentRecord);
exports.DocumentRecordSchema = mongoose_1.SchemaFactory.createForClass(DocumentRecord);
exports.DocumentRecordSchema.index({ tenantId: 1, employeeId: 1 });
//# sourceMappingURL=document.schema.js.map