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
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Pessoa.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 25 }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Pessoa.prototype, "apelido", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.Index)(),
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
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Pessoa.prototype, "whatsapp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 255 }),
        (0, typeorm_1.Index)(),
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
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_cliente' }),
        (0, typeorm_1.OneToMany)(function () { return programacao_entity_1.default; }, function (programacao) {
            return programacao.cliente;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], Pessoa.prototype, "clienteProgramacoes", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Pessoa.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Pessoa.prototype, "updateAt", void 0);
    Pessoa = __decorate([
        (0, typeorm_1.Entity)({ name: 'pessoas' })
    ], Pessoa);
    return Pessoa;
}());
exports.default = Pessoa;
//# sourceMappingURL=pessoa.entity.js.map