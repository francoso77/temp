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
var category_1 = require("./category");
var account_1 = require("./account");
var company_1 = require("./company");
var Transaction = /** @class */ (function () {
    function Transaction() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ generated: 'uuid' }),
        __metadata("design:type", String)
    ], Transaction.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 100 }),
        __metadata("design:type", String)
    ], Transaction.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 3 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "setor", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "categoryId", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
        (0, typeorm_1.ManyToOne)(function () { return category_1.default; }),
        __metadata("design:type", category_1.default)
    ], Transaction.prototype, "categoria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "accountId", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'accountId' }),
        (0, typeorm_1.ManyToOne)(function () { return account_1.default; }),
        __metadata("design:type", account_1.default)
    ], Transaction.prototype, "account", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Transaction.prototype, "companyId", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
        (0, typeorm_1.ManyToOne)(function () { return company_1.default; }),
        __metadata("design:type", company_1.default)
    ], Transaction.prototype, "company", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        __metadata("design:type", String)
    ], Transaction.prototype, "date", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Transaction.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Transaction.prototype, "updateAt", void 0);
    Transaction = __decorate([
        (0, typeorm_1.Index)(['date', 'description']),
        (0, typeorm_1.Entity)({ name: 'transactions' })
    ], Transaction);
    return Transaction;
}());
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map