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
exports.CrudController = void 0;
var common_1 = require("@nestjs/common");
var crud_controller_cls_1 = require("../services/crud.controller.cls");
var roles_decorator_1 = require("../auth/roles.decorator");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var path_2 = require("path");
var CrudController = /** @class */ (function () {
    function CrudController() {
    }
    CrudController.prototype.incluirComDetalhe = function (master, detalhes, entidadeMaster, entidadeDetalhe, id) {
        return new crud_controller_cls_1.default().incluirComDetalhe(master, entidadeMaster, detalhes, entidadeDetalhe, id);
    };
    CrudController.prototype.incluir = function (criterio, entidade) {
        return new crud_controller_cls_1.default().incluir(criterio, entidade);
    };
    CrudController.prototype.atualizar = function (criterio, entidade) {
        return new crud_controller_cls_1.default().incluir(criterio, entidade);
    };
    CrudController.prototype.query = function (entidade, sql) {
        return new crud_controller_cls_1.default().query({
            entidade: entidade ? entidade : '',
            sql: sql ? sql : ''
        });
    };
    CrudController.prototype.pesquisar = function (entidade, criterio, camposLike, select, relations, campoOrder, comparador, tipoOrder) {
        return new crud_controller_cls_1.default().pesquisar({
            entidade: entidade,
            criterio: criterio,
            camposLike: camposLike ? camposLike : [],
            select: select ? select : [],
            relations: relations ? relations : [],
            campoOrder: campoOrder ? campoOrder : [],
            comparador: comparador ? comparador : "L",
            tipoOrder: tipoOrder ? tipoOrder : "ASC"
        });
    };
    CrudController.prototype.excluir = function (entidade, criterio) {
        return new crud_controller_cls_1.default().excluir(criterio, entidade);
    };
    CrudController.prototype.consultar = function (entidade, joins, criterio, camposLike, select, campoOrder, comparador, tipoOrder, groupBy, having) {
        return new crud_controller_cls_1.default().consultar({
            entidade: entidade,
            joins: joins ? joins : [],
            criterio: criterio,
            camposLike: camposLike ? camposLike : [],
            select: select ? select : [],
            campoOrder: campoOrder ? campoOrder : [],
            comparador: comparador ? comparador : "L",
            tipoOrder: tipoOrder ? tipoOrder : "ASC",
            groupBy: groupBy ? groupBy : '',
            having: having ? having : '',
        });
    };
    CrudController.prototype.uploadProduto = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!file) {
                    throw new common_1.BadRequestException('Nenhum arquivo enviado.');
                }
                // ✅ Apenas retorna o nome do arquivo
                return [2 /*return*/, {
                        ok: true,
                        filename: file.filename,
                        caminho: "/uploads/produtos/".concat(file.filename),
                    }];
            });
        });
    };
    __decorate([
        (0, common_1.Post)("incluirComDetalhe"),
        __param(0, (0, common_1.Body)("master")),
        __param(1, (0, common_1.Body)("detalhes")),
        __param(2, (0, common_1.Body)("entidadeMaster")),
        __param(3, (0, common_1.Body)("entidadeDetalhe")),
        __param(4, (0, common_1.Body)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Array, String, String, String]),
        __metadata("design:returntype", void 0)
    ], CrudController.prototype, "incluirComDetalhe", null);
    __decorate([
        (0, common_1.Post)("incluir"),
        (0, roles_decorator_1.Roles)(),
        __param(0, (0, common_1.Body)("criterio")),
        __param(1, (0, common_1.Body)("entidade")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "incluir", null);
    __decorate([
        (0, common_1.Put)("atualizar"),
        __param(0, (0, common_1.Body)("criterio")),
        __param(1, (0, common_1.Body)("entidade:")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "atualizar", null);
    __decorate([
        (0, common_1.Post)("query"),
        __param(0, (0, common_1.Body)("entidade:")),
        __param(1, (0, common_1.Body)("sql")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "query", null);
    __decorate([
        (0, common_1.Post)("pesquisar"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("criterio")),
        __param(2, (0, common_1.Body)("camposLike")),
        __param(3, (0, common_1.Body)("select")),
        __param(4, (0, common_1.Body)("relations")),
        __param(5, (0, common_1.Body)("campoOrder")),
        __param(6, (0, common_1.Body)("comparador")),
        __param(7, (0, common_1.Body)("tipoOrder")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Array,
            Array,
            Array,
            Array, String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "pesquisar", null);
    __decorate([
        (0, common_1.Delete)("excluir"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("criterio")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "excluir", null);
    __decorate([
        (0, common_1.Post)("consultar"),
        __param(0, (0, common_1.Body)("entidade")),
        __param(1, (0, common_1.Body)("joins")),
        __param(2, (0, common_1.Body)("criterio")),
        __param(3, (0, common_1.Body)("camposLike")),
        __param(4, (0, common_1.Body)("select")),
        __param(5, (0, common_1.Body)("campoOrder")),
        __param(6, (0, common_1.Body)("comparador")),
        __param(7, (0, common_1.Body)("tipoOrder")),
        __param(8, (0, common_1.Body)("groupBy")),
        __param(9, (0, common_1.Body)("having")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array, Object, Array,
            Array,
            Array, String, String, String, String]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "consultar", null);
    __decorate([
        (0, common_1.Post)('upload-produto'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
            storage: (0, multer_1.diskStorage)({
                destination: (0, path_2.join)(__dirname, '..', '..', 'uploads', 'produtos'),
                filename: function (req, file, cb) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, "".concat(uniqueSuffix).concat((0, path_1.extname)(file.originalname)));
                },
            }),
        })),
        __param(0, (0, common_1.UploadedFile)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudController.prototype, "uploadProduto", null);
    CrudController = __decorate([
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [])
    ], CrudController);
    return CrudController;
}());
exports.CrudController = CrudController;
//# sourceMappingURL=crud.controller.js.map