"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCrudMiddleware = void 0;
var common_1 = require("@nestjs/common");
var AuthCrudMiddleware = /** @class */ (function () {
    function AuthCrudMiddleware() {
    }
    AuthCrudMiddleware.prototype.use = function (req, res, next) {
        console.log("Request Crud...");
        console.log("req.headers.authorization: ", req.headers.authorization);
    };
    AuthCrudMiddleware = __decorate([
        (0, common_1.Injectable)()
    ], AuthCrudMiddleware);
    return AuthCrudMiddleware;
}());
exports.AuthCrudMiddleware = AuthCrudMiddleware;
//# sourceMappingURL=authCrud.middleware.js.map