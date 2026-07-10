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
var pedidoMalharia_entity_1 = require("./pedidoMalharia.entity");
var detalheTin_entity_1 = require("./detalheTin.entity");
var Tin = /** @class */ (function () {
    function Tin() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Tin.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Tin.prototype, "dataTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Tin.prototype, "idPedido_malharia", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido_malharia' }),
        (0, typeorm_1.ManyToOne)(function () { return pedidoMalharia_entity_1.default; }),
        __metadata("design:type", pedidoMalharia_entity_1.default)
    ], Tin.prototype, "pedidoMalharia", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false }),
        __metadata("design:type", Boolean)
    ], Tin.prototype, "programado", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false }),
        __metadata("design:type", Boolean)
    ], Tin.prototype, "finalizado", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheTin_entity_1.default; }, function (detalheTin) { return detalheTin.tinturaria; }),
        __metadata("design:type", Array)
    ], Tin.prototype, "detalheTins", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Tin.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Tin.prototype, "updateAt", void 0);
    Tin = __decorate([
        (0, typeorm_1.Entity)({ name: 'tins' })
    ], Tin);
    return Tin;
}());
exports.default = Tin;
//# sourceMappingURL=tin.entity.js.map