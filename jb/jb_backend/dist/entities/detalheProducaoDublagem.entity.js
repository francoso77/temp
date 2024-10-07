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
var producaoDublagem_entity_1 = require("./producaoDublagem.entity");
var DetalheProducaoDublagem = /** @class */ (function () {
    function DetalheProducaoDublagem() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "idDetalheProducaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "idDublagem", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idDublagem' }),
        (0, typeorm_1.ManyToOne)(function () { return producaoDublagem_entity_1.default; }, function (producaoDublagem) { return producaoDublagem.detalheProducaoDublagens; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            orphanedRowAction: 'delete'
        }),
        __metadata("design:type", producaoDublagem_entity_1.default)
    ], DetalheProducaoDublagem.prototype, "producaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], DetalheProducaoDublagem.prototype, "metros", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProducaoDublagem.prototype, "createAD", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], DetalheProducaoDublagem.prototype, "updateAD", void 0);
    DetalheProducaoDublagem = __decorate([
        (0, typeorm_1.Entity)({ name: 'detalheproducaodublagens' })
    ], DetalheProducaoDublagem);
    return DetalheProducaoDublagem;
}());
exports.default = DetalheProducaoDublagem;
//# sourceMappingURL=detalheProducaoDublagem.entity.js.map