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
var programacaoDublagem_entity_1 = require("./programacaoDublagem.entity");
var DetalheProgramacaoDublagem = /** @class */ (function () {
    function DetalheProgramacaoDublagem() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheProgramacaoDublagem.prototype, "idDetalheProgramacaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProgramacaoDublagem.prototype, "idProgramacaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProgramacaoDublagem' }),
        (0, typeorm_1.ManyToOne)(function () { return programacaoDublagem_entity_1.default; }, function (programacaoDublagem) { return programacaoDublagem.detalheProgramacaoDublagens; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", programacaoDublagem_entity_1.default)
    ], DetalheProgramacaoDublagem.prototype, "programacaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProgramacaoDublagem.prototype, "idPedido", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPedido' }),
        (0, typeorm_1.ManyToOne)(function () { return pedido_entity_1.default; }),
        __metadata("design:type", pedido_entity_1.default)
    ], DetalheProgramacaoDublagem.prototype, "pedido", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProgramacaoDublagem.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProgramacaoDublagem.prototype, "updateAt", void 0);
    DetalheProgramacaoDublagem = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheprogramacaodublagens' })
    ], DetalheProgramacaoDublagem);
    return DetalheProgramacaoDublagem;
}());
exports.default = DetalheProgramacaoDublagem;
//# sourceMappingURL=detalheProgramacaoDublagem.entity.js.map