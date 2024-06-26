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
var pessoaTypes_1 = require("../types/pessoaTypes");
var class_validator_1 = require("class-validator");
var pedido_entity_1 = require("./pedido.entity");
var entrada_entity_1 = require("./entrada.entity");
var detalheEntrada_entity_1 = require("./detalheEntrada.entity");
var producaoMalharia_entity_1 = require("./producaoMalharia.entity");
var tinturaria_entity_1 = require("./tinturaria.entity");
var estoque_entity_1 = require("./estoque.entity");
var programacao_entity_1 = require("./programacao.entity");
var Pessoa = /** @class */ (function () {
    function Pessoa() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Pessoa.prototype, "idPessoa", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 50 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 25 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "apelido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(14, 18, { message: 'O campo doc deve ter entre 14 e 18 caracteres.' }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "cpf_cnpj", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 100 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "endereco", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Pessoa.prototype, "numero", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "bairro", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 60 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "cidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 2 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "uf", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 10 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "cep", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 15 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "telefone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 15 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "whatsapp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Pessoa.prototype, "comissao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 1 }),
        __metadata("design:type", String)
    ], Pessoa.prototype, "tipoPessoa", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], Pessoa.prototype, "ativo", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheEntrada_entity_1.default; }, function (detalheEntrada) { return detalheEntrada.revisador; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "revisadorDetalheEntradas", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return producaoMalharia_entity_1.default; }, function (producaoMalharia) { return producaoMalharia.revisador; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "revisadorProducaoMalharias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return producaoMalharia_entity_1.default; }, function (producaoMalharia) { return producaoMalharia.tecelao; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "tecelaoProducaoMalharias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return pedido_entity_1.default; }, function (pedido) { return pedido.cliente; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "clientePedidos", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return pedido_entity_1.default; }, function (pedido) { return pedido.vendedor; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "vendedorPedidos", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return entrada_entity_1.default; }, function (entrada) { return entrada.fornecedor; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "fornecedorEntradas", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return tinturaria_entity_1.default; }, function (tinturaria) { return tinturaria.cliente; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "clienteTinturarias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return programacao_entity_1.default; }, function (programacao) { return programacao.cliente; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "clienteProgramacoes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return tinturaria_entity_1.default; }, function (tinturaria) { return tinturaria.fornecedor; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "fornecedorTinturarias", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return estoque_entity_1.default; }, function (estoque) { return estoque.fornecedor; }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "fornecedorEstoques", void 0);
    Pessoa = __decorate([
        (0, typeorm_1.Entity)({ name: 'pessoas' })
    ], Pessoa);
    return Pessoa;
}());
exports.default = Pessoa;
//# sourceMappingURL=pessoa.entity.js.map