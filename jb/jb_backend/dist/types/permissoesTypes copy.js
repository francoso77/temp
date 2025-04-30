"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissoesTypes = void 0;
exports.PermissoesTypes = {
    PEDIDO: {
        MODULO: 'Pedidos',
        PERMISSOES: {
            INCLUSAO: "Inclusão de Pedido",
            EXCLUSAO: "Exclusão de Pedido",
            EDICAO: "Edição de Pedido",
            PESQUISAR: "Pesquisar Pedido"
        }
    },
    ENTRADA: {
        MODULO: 'Entradas de produtos',
        PERMISSOES: {
            INCLUSAO: "Inclusão de Entrada de produto",
            EXCLUSAO: "Exclusão de Entrada de produto",
            VISUALIZAR: "Visualizar Entrada de produto",
            PESQUISAR: "Pesquisar Entrada de produto"
        }
    },
    TINTURARIA: {
        MODULO: 'Tinturarias',
        PERMISSOES: {
            INCLUSAO: "Inclusão de Romaneio de Tinturaria",
            EXCLUSAO: "Exclusão de Romaneio de Tinturaria",
            EDICAO: "Edição de Romaneio de Tinturaria",
            GERAR_ROMANEIO: "Gerar Romaneio de Tinturaria",
            GERAR_PDF_ROMANEIO: "Gerar PDF Romaneio de Tinturaria",
            PESQUISAR: "Pesquisar Romaneio de Tinturaria"
        }
    },
    PRODUCAO_DUBLAGEM: {
        MODULO: 'Produção Dublagem',
        PERMISSOES: {
            INCLUSAO: "Inclusão de Produção Dublagem",
            EXCLUSAO: "Exclusão de Produção Dublagem",
            EDICAO: "Edição de Produção Dublagem",
            PESQUISAR: "Pesquisar Produção Dublagem"
        }
    },
    PRODUCAO_MALHARIA: {
        MODULO: 'Produção Malharia',
        PERMISSOES: {
            LANCAR: "Lançamento de Produção Malharia",
            PERDAS: "Perdas de Produção Malharia",
            GRAFICOS: "Gráficos de Produção Malharia"
        }
    },
    GESTAO_PEDIDO: {
        MODULO: 'Gestão de Pedidos',
        PERMISSOES: {
            INCLUSAO: "Inclusão de Pedido da Programação",
            EXCLUSAO: "Exclusão de Pedido da Programação",
            EDICAO: "Edição de Pedido da Programação",
            PESQUISAR: "Pesquisar Pedido da Programação",
            GERAR_PROGRAMACAO: "Gerar relatório da Programação",
            GERAR_ETIQUETAS: "Gerar Etiquetas da Programação"
        }
    },
    PRODUTO: {
        MODULO: 'Cadastro de Produtos',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Produtos'
        }
    },
    PESSOA: {
        MODULO: 'Cadastro de Pessoas',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Pessoas'
        }
    },
    MAQUINA: {
        MODULO: 'Cadastro de Maquinas',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Maquinas'
        }
    },
    ESTRUTURA: {
        MODULO: 'Cadastro de Estruturas de Produtos',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Estruturas de Produtos'
        }
    },
    UNIDADE_MEDIDA: {
        MODULO: 'Cadastro de Unidades de Medida',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Unidades de Medida'
        }
    },
    PRAZO: {
        MODULO: 'Cadastro de Prazos',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Prazos'
        }
    },
    COR: {
        MODULO: 'Cadastro de Cores',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Cadastro de Cores'
        }
    },
    GRUPOS: {
        MODULO: 'Cadastro de Grupos de Usuários',
        PERMISSOES: {
            MANUTENCAO: 'Manutenção de Grupos'
        }
    },
    USUARIOS: {
        MODULO: 'Cadastro de Usuário',
        PERMISSOES: {
            USUARIOS_GLOBAIS: 'Manutenção de Usuários Globais',
            CADASTRO_USUARIO_UNIDADE: 'Manutenção de Usuários da Unidade'
        }
    }
};
//# sourceMappingURL=permissoesTypes%20copy.js.map