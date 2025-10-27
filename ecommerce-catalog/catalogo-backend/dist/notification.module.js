"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacaoModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var notification_1 = require("./entity/notification");
var notification_controller_1 = require("./controllers/notification.controller");
var notification_service_1 = require("./auth/services/notification.service");
var NotificacaoModule = /** @class */ (function () {
    function NotificacaoModule() {
    }
    NotificacaoModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([notification_1.Notificacao])],
            controllers: [notification_controller_1.NotificacaoController],
            providers: [notification_service_1.NotificacaoService],
            exports: [notification_service_1.NotificacaoService], // importante caso outro módulo use o service
        })
    ], NotificacaoModule);
    return NotificacaoModule;
}());
exports.NotificacaoModule = NotificacaoModule;
//# sourceMappingURL=notification.module.js.map