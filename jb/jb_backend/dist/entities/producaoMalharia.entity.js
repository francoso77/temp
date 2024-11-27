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
var maquina_entity_1 = require("./maquina.entity");
var produto_entity_1 = require("./produto.entity");
var turnoTypes_1 = require("../types/turnoTypes");
var tinturaria_entity_1 = require("./tinturaria.entity");
var ProducaoMalharia = /** @class */ (function () {
    function ProducaoMalharia() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idMalharia", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], ProducaoMalharia.prototype, "peca", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idMaquina", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idMaquina' }),
        (0, typeorm_1.ManyToOne)(function () { return maquina_entity_1.default; }),
        __metadata("design:type", maquina_entity_1.default)
    ], ProducaoMalharia.prototype, "maquina", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idProduto", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProduto' }),
        (0, typeorm_1.ManyToOne)(function () { return produto_entity_1.default; }),
        __metadata("design:type", produto_entity_1.default)
    ], ProducaoMalharia.prototype, "produto", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], ProducaoMalharia.prototype, "dataProducao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "turno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "peso", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, length: 10 }),
        __metadata("design:type", String)
    ], ProducaoMalharia.prototype, "localizacao", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idPessoa_revisador", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_revisador' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], ProducaoMalharia.prototype, "revisador", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idPessoa_tecelao", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_tecelao' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], ProducaoMalharia.prototype, "tecelao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], ProducaoMalharia.prototype, "fechado", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], ProducaoMalharia.prototype, "dataFechado", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], ProducaoMalharia.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idTinturaria' }),
        (0, typeorm_1.ManyToOne)(function () { return tinturaria_entity_1.default; }),
        __metadata("design:type", tinturaria_entity_1.default)
    ], ProducaoMalharia.prototype, "tinturaria", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProducaoMalharia.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProducaoMalharia.prototype, "updateAt", void 0);
    ProducaoMalharia = __decorate([
        (0, typeorm_1.Entity)({ name: 'producaomalharias' })
    ], ProducaoMalharia);
    return ProducaoMalharia;
}());
exports.default = ProducaoMalharia;
//# sourceMappingURL=producaoMalharia.entity.js.map