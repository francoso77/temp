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
var produto_entity_1 = require("./produto.entity");
var UnidadeMedida = /** @class */ (function () {
    function UnidadeMedida() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], UnidadeMedida.prototype, "idUnidade", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 2 }),
        (0, typeorm_1.Index)({ unique: true }),
        __metadata("design:type", String)
    ], UnidadeMedida.prototype, "sigla", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        (0, typeorm_1.Index)({ unique: true }),
        __metadata("design:type", String)
    ], UnidadeMedida.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idUnidade' }),
        (0, typeorm_1.OneToMany)(function () { return produto_entity_1.default; }, function (produto) {
            return produto.unidadeMedida;
        }, { cascade: true }),
        __metadata("design:type", Array)
    ], UnidadeMedida.prototype, "produtos", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UnidadeMedida.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], UnidadeMedida.prototype, "updateAt", void 0);
    UnidadeMedida = __decorate([
        (0, typeorm_1.Entity)({ name: 'unidademedidas' })
    ], UnidadeMedida);
    return UnidadeMedida;
}());
exports.default = UnidadeMedida;
//# sourceMappingURL=unidadeMedida.entity.js.map