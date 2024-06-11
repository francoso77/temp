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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var data_source_1 = require("./data-source");
var typeorm_1 = require("typeorm");
var cao_entity_1 = require("./entities/cao.entity");
var AppController = /** @class */ (function () {
    function AppController() {
    }
    AppController.prototype.getCategoria = function (descricao) {
        return data_source_1.AppDataSource.getRepository(cao_entity_1.default).find({
            where: {
                nome: (0, typeorm_1.Like)("%".concat(descricao).concat("%")),
            },
        });
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Query)("descricao")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AppController.prototype, "getCategoria", null);
    AppController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [])
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map