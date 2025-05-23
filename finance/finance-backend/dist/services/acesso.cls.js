"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQL_PERMISSAO = "\n    SELECT grpe.idModuloPermissao FROM gruposusuarios AS grus\n    INNER JOIN grupospermissoes AS grpe\n    ON grus.idGrupo = grpe.idGrupo\n    WHERE grus.idUsuario = ? AND grpe.idModuloPermissao = ?\n    UNION ALL\n    SELECT uspe.idModuloPermissao FROM usuariospermissoes AS uspe\n    WHERE uspe.idUsuario = ? AND uspe.idModuloPermissao = ?;\n";
var ClsAcesso = /** @class */ (function () {
    function ClsAcesso() {
    }
    return ClsAcesso;
}());
exports.default = ClsAcesso;
//# sourceMappingURL=acesso.cls.js.map