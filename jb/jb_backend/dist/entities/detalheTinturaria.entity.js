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
var producaoMalharia_entity_1 = require("./producaoMalharia.entity");
var DetalheTinturaria = /** @class */ (function () {
    function DetalheTinturaria() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheTinturaria.prototype, "idDetalheTinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheTinturaria.prototype, "idTinturaria", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idTinturaria' }),
        (0, typeorm_1.ManyToOne)(function () { return tinturaria_entity_1.default; }, function (tinturaria) { return tinturaria.detalheTinturarias; }),
        __metadata("design:type", tinturaria_entity_1.default)
    ], DetalheTinturaria.prototype, "tinturaria", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheTinturaria.prototype, "idMalharia", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idMalharia' }),
        (0, typeorm_1.ManyToOne)(function () { return producaoMalharia_entity_1.default; }),
        __metadata("design:type", producaoMalharia_entity_1.default)
    ], DetalheTinturaria.prototype, "malharia", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheTinturaria.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheTinturaria.prototype, "updateAt", void 0);
    DetalheTinturaria = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalhetinturarias' })
    ], DetalheTinturaria);
    return DetalheTinturaria;
}());
exports.default = DetalheTinturaria;
//# sourceMappingURL=detalheTinturaria.entity.js.map