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
var Cao_1 = require("./Cao");
var Raca = /** @class */ (function () {
    function Raca() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
        (0, typeorm_1.Generated)('uuid'),
        __metadata("design:type", String)
    ], Raca.prototype, "idRaca", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 35 }),
        __metadata("design:type", String)
    ], Raca.prototype, "nome", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Cao_1.default; }, function (cao) { return cao.raca; }),
        __metadata("design:type", Array)
    ], Raca.prototype, "caes", void 0);
    Raca = __decorate([
        (0, typeorm_1.Entity)({ name: 'racas' })
    ], Raca);
    return Raca;
}());
exports.default = Raca;
//# sourceMappingURL=Raca.js.map