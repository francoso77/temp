"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioTypes = exports.UsuarioType = void 0;
var UsuarioType;
(function (UsuarioType) {
    UsuarioType[UsuarioType["default"] = 0] = "default";
    UsuarioType[UsuarioType["admin"] = 1] = "admin";
    UsuarioType[UsuarioType["estoquistaMalharia"] = 2] = "estoquistaMalharia";
    UsuarioType[UsuarioType["estoquistaDublagem"] = 3] = "estoquistaDublagem";
    UsuarioType[UsuarioType["producaoDublagem"] = 4] = "producaoDublagem";
    UsuarioType[UsuarioType["vendedor"] = 5] = "vendedor";
})(UsuarioType || (exports.UsuarioType = UsuarioType = {}));
exports.UsuarioTypes = [
    {
        idUsuarioType: UsuarioType.default,
        descricao: 'Usuário Padrão'
    },
    {
        idUsuarioType: UsuarioType.admin,
        descricao: 'Usuário Administrador'
    },
    {
        idUsuarioType: UsuarioType.estoquistaMalharia,
        descricao: 'Usuário Estoque Malharia'
    },
    {
        idUsuarioType: UsuarioType.estoquistaDublagem,
        descricao: 'Usuário Estoque Dublagem'
    },
    {
        idUsuarioType: UsuarioType.producaoDublagem,
        descricao: 'Usuário Produção Dublagem'
    },
    {
        idUsuarioType: UsuarioType.vendedor,
        descricao: 'Usuário Vendedor'
    },
];
//# sourceMappingURL=usuarioTypes.js.map