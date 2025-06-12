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
var typeorm_1 = require("typeorm");
var user_1 = require("./sistema/user");
var Category = /** @class */ (function () {
    function Category() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], Category.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 80 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Category.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Category.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Category.prototype, "color", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Category.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Category.prototype, "updateAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Category.prototype, "userId", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'userId' }),
        (0, typeorm_1.ManyToOne)(function () { return user_1.User; }),
        __metadata("design:type", user_1.User)
    ], Category.prototype, "user", void 0);
    Category = __decorate([
        (0, typeorm_1.Entity)({ name: 'categorys' })
    ], Category);
    return Category;
}());
exports.default = Category;
//# sourceMappingURL=category.js.map