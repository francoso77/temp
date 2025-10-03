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
exports.Notification = void 0;
// notification.entity.ts
var typeorm_1 = require("typeorm");
var usuario_entity_1 = require("./usuario.entity");
var Notification = /** @class */ (function () {
    function Notification() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Notification.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: ['warning', 'info', 'success'] }),
        __metadata("design:type", String)
    ], Notification.prototype, "color", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Notification.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Notification.prototype, "message", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: ['vendedor', 'gerenciador', 'produtor'] }),
        __metadata("design:type", String)
    ], Notification.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: false }),
        __metadata("design:type", Boolean)
    ], Notification.prototype, "read", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'json', nullable: true }),
        __metadata("design:type", Object)
    ], Notification.prototype, "details", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Notification.prototype, "idUsuario", void 0);
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'idUsuario' }),
        (0, typeorm_1.ManyToOne)(function () { return usuario_entity_1.Usuario; }),
        __metadata("design:type", usuario_entity_1.Usuario)
    ], Notification.prototype, "usuario", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: 'createdAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Notification.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: 'updatedAt', type: 'timestamp', nullable: false }),
        __metadata("design:type", Date)
    ], Notification.prototype, "updatedAt", void 0);
    Notification = __decorate([
        (0, typeorm_1.Entity)('notifications')
    ], Notification);
    return Notification;
}());
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map