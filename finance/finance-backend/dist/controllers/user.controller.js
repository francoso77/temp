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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.UserController = void 0;
// user.controller.ts
var common_1 = require("@nestjs/common");
var user_service_1 = require("../auth/services/user.service");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var path_2 = require("path");
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    UserController.prototype.forgotPassword = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.requestPasswordReset(email)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                ok: true,
                                mensagem: 'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.',
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw new common_1.BadRequestException('Não foi possível processar a solicitação.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (token, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.resetPassword(token, newPassword)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                ok: true,
                                mensagem: 'Senha redefinida com sucesso!',
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Erro ao redefinir senha:', error_2);
                        throw new common_1.InternalServerErrorException('Erro ao redefinir senha.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.sendEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.notifyUser(email)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { message: 'E-mail enviado com sucesso!' }];
                }
            });
        });
    };
    UserController.prototype.uploadProfilePicture = function (file, body) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userService.createUser(__assign(__assign({}, body), { profilePicture: (_a = file === null || file === void 0 ? void 0 : file.filename) !== null && _a !== void 0 ? _a : null }))];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, {
                                ok: true,
                                message: 'Usuário cadastrado com sucesso!',
                                user: user,
                            }];
                }
            });
        });
    };
    UserController.prototype.updateUser = function (id, file, body) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedData;
            var _a, _b;
            return __generator(this, function (_c) {
                updatedData = __assign(__assign({}, body), { profilePicture: (_b = (_a = file === null || file === void 0 ? void 0 : file.filename) !== null && _a !== void 0 ? _a : body.profilePicture) !== null && _b !== void 0 ? _b : null });
                return [2 /*return*/, this.userService.updateUser(id, updatedData)];
            });
        });
    };
    __decorate([
        (0, common_1.Post)('forgot-password'),
        __param(0, (0, common_1.Body)('email')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "forgotPassword", null);
    __decorate([
        (0, common_1.Post)('reset-password'),
        __param(0, (0, common_1.Body)('token')),
        __param(1, (0, common_1.Body)('newPassword')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "resetPassword", null);
    __decorate([
        (0, common_1.Post)('send-email'),
        __param(0, (0, common_1.Body)('email')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "sendEmail", null);
    __decorate([
        (0, common_1.Post)('upload-profile'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
            storage: (0, multer_1.diskStorage)({
                // Caminho de destino corrigido:
                destination: (0, path_2.join)(__dirname, '..', '..', 'uploads', 'users'),
                filename: function (req, file, cb) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, "".concat(uniqueSuffix).concat((0, path_1.extname)(file.originalname)));
                },
            }),
        })),
        __param(0, (0, common_1.UploadedFile)()),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "uploadProfilePicture", null);
    __decorate([
        (0, common_1.Patch)(':id'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
            storage: (0, multer_1.diskStorage)({
                destination: (0, path_2.join)(__dirname, '..', '..', 'uploads', 'users'), // Caminho corrigido
                filename: function (req, file, cb) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
                },
            }),
        })),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.UploadedFile)()),
        __param(2, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "updateUser", null);
    UserController = __decorate([
        (0, common_1.Controller)('auth'),
        __metadata("design:paramtypes", [user_service_1.UserService])
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map