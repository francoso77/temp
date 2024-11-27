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
var detalheProgramacaoDublagem_entity_1 = require("./detalheProgramacaoDublagem.entity");
var ProgramacaoDublagem = /** @class */ (function () {
    function ProgramacaoDublagem() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ProgramacaoDublagem.prototype, "idProgramacaoDublagem", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "datetime" }),
        (0, typeorm_1.Index)(),
        __metadata("design:type", String)
    ], ProgramacaoDublagem.prototype, "dataProgramacao", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], ProgramacaoDublagem.prototype, "qtdCola", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'float', precision: 4 }),
        __metadata("design:type", Number)
    ], ProgramacaoDublagem.prototype, "qtdFilme", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idProgramacaoDublagem' }),
        (0, typeorm_1.OneToMany)(function () { return detalheProgramacaoDublagem_entity_1.default; }, function (detalheProgramacaoDublagem) { return detalheProgramacaoDublagem.programacaoDublagem; }, { cascade: true }),
        __metadata("design:type", Array)
    ], ProgramacaoDublagem.prototype, "detalheProgramacaoDublagens", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProgramacaoDublagem.prototype, "createAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], ProgramacaoDublagem.prototype, "updateAt", void 0);
    ProgramacaoDublagem = __decorate([
        (0, typeorm_1.Entity)({ name: 'programacaodublagens' })
    ], ProgramacaoDublagem);
    return ProgramacaoDublagem;
}());
exports.default = ProgramacaoDublagem;
//# sourceMappingURL=programacaoDublagem.entity.js.map