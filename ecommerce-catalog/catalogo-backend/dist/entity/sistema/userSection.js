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
exports.UserSection = void 0;
var typeorm_1 = require("typeorm");
var user_1 = require("./user");
var UserSection = /** @class */ (function () {
    function UserSection() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], UserSection.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'userId' }),
        (0, typeorm_1.ManyToOne)(function () { return user_1.User; }),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], UserSection.prototype, "userId", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], UserSection.prototype, "token", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], UserSection.prototype, "isActive", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UserSection.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UserSection.prototype, "updateAt", void 0);
    UserSection = __decorate([
        (0, typeorm_1.Entity)({ name: 'usersectons' })
    ], UserSection);
    return UserSection;
}());
exports.UserSection = UserSection;
//# sourceMappingURL=userSection.js.map