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
var pessoa_entity_1 = require("./pessoa.entity");
var detalheTinturaria_entity_1 = require("./detalheTinturaria.entity");
var producaoMalharia_entity_1 = require("./producaoMalharia.entity");
var programacao_entity_1 = require("./programacao.entity");
var detalheEntrada_entity_1 = require("./detalheEntrada.entity");
var Tinturaria = /** @class */ (function () {
    function Tinturaria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        __metadata("design:type", String)
    ], Tinturaria.prototype, "dataTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idPessoa_cliente", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoaCliente' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }, function (pessoa) { return pessoa.clienteTinturarias; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Tinturaria.prototype, "cliente", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idPessoa_fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoaFornecedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }, function (pessoa) { return pessoa.fornecedorTinturarias; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Tinturaria.prototype, "fornecedor", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheTinturaria_entity_1.default; }, function (detalheTinturaria) { return detalheTinturaria.tinturaria; }),
        __metadata("design:type", Array)
    ], Tinturaria.prototype, "detalheTinturarias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return producaoMalharia_entity_1.default; }, function (ProducaoMalharia) { return ProducaoMalharia.tinturaria; }),
        __metadata("design:type", Array)
    ], Tinturaria.prototype, "producaoMalharias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return programacao_entity_1.default; }, function (programacao) { return programacao.tinturaria; }),
        __metadata("design:type", Array)
    ], Tinturaria.prototype, "programacoes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheEntrada_entity_1.default; }, function (detalheEntrada) { return detalheEntrada.romaneio; }),
        __metadata("design:type", Array)
    ], Tinturaria.prototype, "romaneioDetalheEntradas", void 0);
    Tinturaria = __decorate([
        (0, typeorm_1.Entity)({ name: 'tinturarias' })
    ], Tinturaria);
    return Tinturaria;
}());
exports.default = Tinturaria;
//# sourceMappingURL=tinturaria.entity.js.map