"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenExceptionFilter = void 0;
// src/filters/forbidden-exception.filter.ts
var common_1 = require("@nestjs/common");
var ForbiddenExceptionFilter = /** @class */ (function () {
    function ForbiddenExceptionFilter() {
    }
    ForbiddenExceptionFilter.prototype.catch = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var status = exception.getStatus();
        if (status === common_1.HttpStatus.FORBIDDEN) {
            // Retorna uma resposta mais amigável em caso de erro 403 Forbidden
            return response.status(status).json({
                statusCode: status,
                message: 'Você não tem permissão para acessar este recurso.',
            });
        }
        // Para outros erros, mantém o comportamento padrão
        response.status(status).json(exception.getResponse());
    };
    ForbiddenExceptionFilter = __decorate([
        (0, common_1.Catch)(common_1.HttpException)
    ], ForbiddenExceptionFilter);
    return ForbiddenExceptionFilter;
}());
exports.ForbiddenExceptionFilter = ForbiddenExceptionFilter;
//# sourceMappingURL=forbidden-exception.filter.js.map