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
var pedido_entity_1 = require("./pedido.entity");
var PrazoEntrega = /** @class */ (function () {
    function PrazoEntrega() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], PrazoEntrega.prototype, "idPrazoEntrega", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], PrazoEntrega.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], PrazoEntrega.prototype, "dias", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPrazoEntrega' }),
        (0, typeorm_1.OneToMany)(function () { return pedido_entity_1.default; }, function (pedido) {
            return pedido.prazoEntrega;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], PrazoEntrega.prototype, "pedidos", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], PrazoEntrega.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], PrazoEntrega.prototype, "updateAt", void 0);
    PrazoEntrega = __decorate([
        (0, typeorm_1.Entity)({ name: 'prazoentregas' })
    ], PrazoEntrega);
    return PrazoEntrega;
}());
exports.default = PrazoEntrega;
//# sourceMappingURL=prazoEntrega.entity.js.map