"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_source_1 = require("../data-source");
var usuarioSessao_entity_1 = require("../entities/sistema/usuarioSessao.entity");
var ClsAutenticacaoMiddleware = /** @class */ (function () {
    function ClsAutenticacaoMiddleware() {
    }
    ClsAutenticacaoMiddleware.prototype.pesquisarToken = function (authorization) {
        var token = authorization ? authorization : '';
        if (token.length > 0) {
            token = token.replace('Bearer ', '');
            return data_source_1.AppDataSource.getRepository(usuarioSessao_entity_1.UsuarioSessao)
                .findOne({ where: { token: token, ativo: true } })
                .then(function (rsUsuarioSessao) {
                if (rsUsuarioSessao) {
                    return rsUsuarioSessao.idUsuario;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            return Promise.resolve(0);
        }
    };
    return ClsAutenticacaoMiddleware;
}());
exports.default = ClsAutenticacaoMiddleware;
//# sourceMappingURL=autenticacao.middleware.cls.js.map