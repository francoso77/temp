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
var detalheProducaoDublagem_entity_1 = require("./detalheProducaoDublagem.entity");
var tipoColagemTypes_1 = require("../types/tipoColagemTypes");
var pedido_entity_1 = require("./pedido.entity");
var ProducaoDublagem = /** @class */ (function () {
    function ProducaoDublagem() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ProducaoDublagem.prototype, "idDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], ProducaoDublagem.prototype, "dataProducao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoDublagem.prototype, "tipoColagem", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoDublagem.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.ManyToOne)(function () { return pedido_entity_1.default; }),
        __metadata("design:type", pedido_entity_1.default)
    ], ProducaoDublagem.prototype, "pedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idDublagem' }),
        (0, typeorm_1.OneToMany)(function () { return detalheProducaoDublagem_entity_1.default; }, function (detalheProducaoDublagem) { return detalheProducaoDublagem.producaoDublagem; }, { cascade: true }),
        __metadata("design:type", Array)
    ], ProducaoDublagem.prototype, "detalheProducaoDublagens", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProducaoDublagem.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProducaoDublagem.prototype, "updateAt", void 0);
    ProducaoDublagem = __decorate([
        (0, typeorm_1.Entity)({ name: 'producaodublagens' })
    ], ProducaoDublagem);
    return ProducaoDublagem;
}());
exports.default = ProducaoDublagem;
//# sourceMappingURL=producaoDublagem.entity.js.map