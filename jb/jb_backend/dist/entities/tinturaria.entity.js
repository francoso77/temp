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
var Tinturaria = /** @class */ (function () {
    function Tinturaria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], Tinturaria.prototype, "dataTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idPessoa_cliente", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_cliente' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Tinturaria.prototype, "cliente", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Tinturaria.prototype, "idPessoa_fornecedor", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idPessoa_fornecedor' }),
        (0, typeorm_1.ManyToOne)(function () { return pessoa_entity_1.default; }),
        __metadata("design:type", pessoa_entity_1.default)
    ], Tinturaria.prototype, "fornecedor", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false }),
        __metadata("design:type", Boolean)
    ], Tinturaria.prototype, "programado", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false }),
        __metadata("design:type", Boolean)
    ], Tinturaria.prototype, "finalizado", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return detalheTinturaria_entity_1.default; }, function (detalheTinturaria) { return detalheTinturaria.tinturaria; }),
        __metadata("design:type", Array)
    ], Tinturaria.prototype, "detalheTinturarias", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Tinturaria.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Tinturaria.prototype, "updateAt", void 0);
    Tinturaria = __decorate([
        (0, typeorm_1.Entity)({ name: 'tinturarias' }),
        (0, typeorm_1.Index)(["idPessoa_cliente"]),
        (0, typeorm_1.Index)(["idPessoa_fornecedor"])
    ], Tinturaria);
    return Tinturaria;
}());
exports.default = Tinturaria;
//# sourceMappingURL=tinturaria.entity.js.map