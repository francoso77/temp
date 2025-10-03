"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManager = void 0;
var typeorm_1 = require("typeorm");
var notification_entity_1 = require("../entities/sistema/notification.entity");
var data_source_1 = require("../data-source");
var usuario_entity_1 = require("../entities/sistema/usuario.entity");
var NotificationManager = /** @class */ (function () {
    function NotificationManager() {
        this.notificationRepo = data_source_1.AppDataSource.getRepository(notification_entity_1.Notification);
        this.usuarioRepo = data_source_1.AppDataSource.getRepository(usuario_entity_1.Usuario);
    }
    NotificationManager.prototype.createNotification = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var targetTipoUsuarios, usuarios, notifications;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetTipoUsuarios = [];
                        // regra de distribuição
                        if (data.type === 'vendedor') {
                            targetTipoUsuarios = [3, 5];
                        }
                        else if (data.type === 'gerenciador') {
                            targetTipoUsuarios = [3];
                        }
                        else if (data.type === 'produtor') {
                            targetTipoUsuarios = [3, 5];
                        }
                        if (targetTipoUsuarios.length === 0) {
                            throw new Error("Tipo de notifica\u00E7\u00E3o inv\u00E1lido: ".concat(data.type));
                        }
                        return [4 /*yield*/, this.usuarioRepo.find({
                                where: { tipoUsuario: (0, typeorm_1.In)(targetTipoUsuarios) },
                            })];
                    case 1:
                        usuarios = _a.sent();
                        if (!usuarios.length) {
                            throw new Error('Nenhum usuário encontrado para esse tipo de notificação.');
                        }
                        notifications = usuarios.map(function (usuario) {
                            return _this.notificationRepo.create(__assign(__assign({}, data), { idUsuario: usuario.idUsuario, usuario: usuario, read: false }));
                        });
                        return [2 /*return*/, this.notificationRepo.save(notifications)];
                }
            });
        });
    };
    // async createNotification(data: Partial<Notification>) {
    //   const notification = this.notificationRepo.create(data);
    //   return this.notificationRepo.save(notification);
    // }
    NotificationManager.prototype.getUserNotifications = function (idUsuario) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notificationRepo.find({
                        where: { usuario: { idUsuario: idUsuario } },
                        order: { createdAt: 'DESC' },
                    })];
            });
        });
    };
    // async getUserNotifications(tipoUsuario: 'admin' | 'vendedor' | 'gerenciador', includeRead = false) {
    //   return this.notificationRepo.find({
    //     where: {
    //       tipoUsuario,
    //       ...(includeRead ? {} : { read: false }),
    //     },
    //     order: { createdAt: 'DESC' },
    //   });
    // }
    // async markAsRead(id: number) {
    //   await this.notificationRepo.update(id, { read: true });
    //   return this.notificationRepo.findOne({ where: { id } });
    // }
    NotificationManager.prototype.markAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationRepo.findOne({ where: { id: id } })];
                    case 1:
                        notification = _a.sent();
                        if (!notification) {
                            throw new Error("Notifica\u00E7\u00E3o com id ".concat(id, " n\u00E3o encontrada"));
                        }
                        notification.read = !notification.read; // ✅ inverte o valor atual
                        return [4 /*yield*/, this.notificationRepo.save(notification)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, notification];
                }
            });
        });
    };
    return NotificationManager;
}());
exports.NotificationManager = NotificationManager;
//# sourceMappingURL=notification.cls.js.map