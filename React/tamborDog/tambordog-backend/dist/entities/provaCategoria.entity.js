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
var ProvaCategoria = /** @class */ (function () {
    function ProvaCategoria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        (0, typeorm_1.Generated)("uuid"),
        __metadata("design:type", String)
    ], ProvaCategoria.prototype, "idProvaCategoria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36, nullable: true }),
        __metadata("design:type", String)
    ], ProvaCategoria.prototype, "idProva", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 36, nullable: true }),
        __metadata("design:type", String)
    ], ProvaCategoria.prototype, "idCategoria", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: 1 }),
        __metadata("design:type", Number)
    ], ProvaCategoria.prototype, "qtdPistas", void 0);
    ProvaCategoria = __decorate([
        (0, typeorm_1.Entity)({ name: "provascategorias" })
    ], ProvaCategoria);
    return ProvaCategoria;
}());
exports.default = ProvaCategoria;
//# sourceMappingURL=provaCategoria.entity.js.map