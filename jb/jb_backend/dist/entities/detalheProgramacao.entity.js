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
var programacao_entity_1 = require("./programacao.entity");
var produto_entity_1 = require("./produto.entity");
var cor_entity_1 = require("./cor.entity");
var DetalheProgramacao = /** @class */ (function () {
    function DetalheProgramacao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "idDetalheProgramacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "idProgramacao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProgramacao' }),
        (0, typeorm_1.ManyToOne)(function () { return programacao_entity_1.default; }, function (programacao) { return programacao.detalheProgramacoes; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", programacao_entity_1.default)
    ], DetalheProgramacao.prototype, "programacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], DetalheProgramacao.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "idCor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idCor' }),
        (0, typeorm_1.ManyToOne)(function () { return cor_entity_1.default; }),
        __metadata("design:type", cor_entity_1.default)
    ], DetalheProgramacao.prototype, "cor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "peso", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "gm2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "largura", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' }),
        __metadata("design:type", Number)
    ], DetalheProgramacao.prototype, "qtdPeca", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProgramacao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProgramacao.prototype, "updateAt", void 0);
    DetalheProgramacao = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheprogramacoes' })
    ], DetalheProgramacao);
    return DetalheProgramacao;
}());
exports.default = DetalheProgramacao;
//# sourceMappingURL=detalheProgramacao.entity.js.map