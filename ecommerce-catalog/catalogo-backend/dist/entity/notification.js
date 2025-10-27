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
exports.Notificacao = void 0;
// notificacao.entity.ts
var typeorm_1 = require("typeorm");
var status_1 = require("../interfaces/types/status");
var Notificacao = /** @class */ (function () {
    function Notificacao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Notificacao.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 255 }),
        __metadata("design:type", String)
    ], Notificacao.prototype, "message", void 0);
    __decorate([
        (0, typeorm_1.Column)({}),
        __metadata("design:type", Number)
    ], Notificacao.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Notificacao.prototype, "link", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Notificacao.prototype, "destinatarioId", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["vendedor", "cliente"],
        }),
        __metadata("design:type", String)
    ], Notificacao.prototype, "destinatarioTipo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Notificacao.prototype, "pedidoClienteId", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Notificacao.prototype, "pedidoVendedorId", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Notificacao.prototype, "vendedorWhatsapp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], Notificacao.prototype, "read", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
        __metadata("design:type", Date)
    ], Notificacao.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
        __metadata("design:type", Date)
    ], Notificacao.prototype, "updatedAt", void 0);
    Notificacao = __decorate([
        (0, typeorm_1.Entity)({ name: "notificacoes" })
    ], Notificacao);
    return Notificacao;
}());
exports.Notificacao = Notificacao;
//# sourceMappingURL=notification.js.map