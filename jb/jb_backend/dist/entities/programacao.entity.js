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
var tinturaria_entity_1 = require("./tinturaria.entity");
var detalheProgramacao_entity_1 = require("./detalheProgramacao.entity");
var Programacao = /** @class */ (function () {
    function Programacao() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Programacao.prototype, "idProgramacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 11 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Programacao.prototype, "notaFiscal", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Programacao.prototype, "dataProgramacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Programacao.prototype, "msg", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Programacao.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idTinturaria' }),
        (0, typeorm_1.ManyToOne)(function () { return tinturaria_entity_1.default; }),
        __metadata("design:type", tinturaria_entity_1.default
        // @Column()
        // idPessoa_cliente: number
        // @JoinColumn({ name: 'idPessoa_cliente' })
        // @ManyToOne(() => Pessoa)
        // cliente: Pessoa
        )
    ], Programacao.prototype, "romaneio", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProgramacao' }),
        (0, typeorm_1.OneToMany)(function () { return detalheProgramacao_entity_1.default; }, function (detalheProgramacao) { return detalheProgramacao.programacao; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Programacao.prototype, "detalheProgramacoes", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Programacao.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Programacao.prototype, "updateAt", void 0);
    Programacao = __decorate([
        (0, typeorm_1.Entity)({ name: 'programacoes' })
    ], Programacao);
    return Programacao;
}());
exports.default = Programacao;
//# sourceMappingURL=programacao.entity.js.map