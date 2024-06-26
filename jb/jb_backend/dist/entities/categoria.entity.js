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
var cao_entity_1 = require("./cao.entity");
var inscricao_entity_1 = require("./inscricao.entity");
var Categoria = /** @class */ (function () {
    function Categoria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Categoria.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], Categoria.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 255 }),
        __metadata("design:type", String)
    ], Categoria.prototype, "observacao", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return cao_entity_1.default; }, function (cao) { return cao.categoria; }),
        __metadata("design:type", Array)
    ], Categoria.prototype, "caes", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return inscricao_entity_1.default; }, function (inscricao) { return inscricao.categoria; }),
        __metadata("design:type", Array)
    ], Categoria.prototype, "inscricoes", void 0);
    Categoria = __decorate([
        (0, typeorm_1.Entity)({ name: 'categorias' })
    ], Categoria);
    return Categoria;
}());
exports.default = Categoria;
//# sourceMappingURL=categoria.entity.js.map