"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerModule = void 0;
var common_1 = require("@nestjs/common");
var handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
var path_1 = require("path");
var MailerModule = /** @class */ (function () {
    function MailerModule() {
    }
    MailerModule = __decorate([
        (0, common_1.Module)({
            imports: [
                MailerModule.forRoot({
                    transport: {
                        host: 'smtp.gmail.com', // Provedor de email, ex.: Gmail
                        port: 587, // Porta para SMTP seguro
                        secure: false, // Use TLS
                        auth: {
                            user: 'ti@jbtextil.com', // Seu email
                            pass: 'textiljb4009', // Sua senha ou App Password
                        },
                    },
                    defaults: {
                        from: '"No Reply" <noreply@seusite.com>', // Email padrão do remetente
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, 'templates'), // Diretório dos templates de e-mail
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(), // Adaptador para usar templates Handlebars
                        options: {
                            strict: true,
                        },
                    },
                }),
            ],
            exports: [MailerModule],
        })
    ], MailerModule);
    return MailerModule;
}());
exports.MailerModule = MailerModule;
//# sourceMappingURL=mailer.module.js.map