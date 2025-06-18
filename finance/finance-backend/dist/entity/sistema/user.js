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
exports.User = void 0;
var typeorm_1 = require("typeorm");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 50 }),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        (0, typeorm_1.Index)({ unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 25 }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isActive", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], User.prototype, "tentativasLogin", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "termsAccepted", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'termsAcceptedAt', type: 'timestamp' }),
        __metadata("design:type", Date)
    ], User.prototype, "termsAcceptedAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "resetToken", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
        __metadata("design:type", Date)
    ], User.prototype, "resetTokenExpires", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        __metadata("design:type", String)
    ], User.prototype, "profilePicture", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], User.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], User.prototype, "updateAt", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)({ name: 'users' })
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map