"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUsuarioMiddleware = void 0;
var common_1 = require("@nestjs/common");
var AuthUsuarioMiddleware = /** @class */ (function () {
    function AuthUsuarioMiddleware() {
    }
    AuthUsuarioMiddleware.prototype.use = function (req, res, next) {
        console.log("Request Usuário...");
        console.log("req.headers.authorization: ", req.headers.authorization);
    };
    AuthUsuarioMiddleware = __decorate([
        (0, common_1.Injectable)()
    ], AuthUsuarioMiddleware);
    return AuthUsuarioMiddleware;
}());
exports.AuthUsuarioMiddleware = AuthUsuarioMiddleware;
//# sourceMappingURL=authUsuario.middleware.js.map