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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SomarController = void 0;
var common_1 = require("@nestjs/common");
var SomarController = /** @class */ (function () {
    function SomarController() {
        console.log('[SomarController] - Construtor');
    }
    SomarController.prototype.somar = function (numero01, numero02) {
        console.log("numero01: ", numero01);
        console.log("numero02: ", numero02);
        return Promise.resolve({ ok: true, mensagem: 'Soma OK', dados: numero01 + numero02 });
    };
    __decorate([
        (0, common_1.Post)("somar")
        //@Roles({ modulo: PermissoesTypes.COR.MODULO, permissao: PermissoesTypes.COR.PERMISSOES.MANUTENCAO })
        ,
        __param(0, (0, common_1.Body)("numero01")),
        __param(1, (0, common_1.Body)("numero02")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number]),
        __metadata("design:returntype", Promise)
    ], SomarController.prototype, "somar", null);
    SomarController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [])
    ], SomarController);
    return SomarController;
}());
exports.SomarController = SomarController;
//# sourceMappingURL=somar.controller.js.map