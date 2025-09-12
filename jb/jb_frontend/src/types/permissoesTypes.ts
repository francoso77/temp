export interface PermissoesTypeInterface {

  PEDIDO: {
    MODULO: string
    PERMISSOES: {
      INCLUSAO: string,
      EXCLUSAO: string,
      EDICAO: string,
      PESQUISAR: string
    }
  },

  ENTRADA: {
    MODULO: string
    PERMISSOES: {
      INCLUSAO: string,
      EXCLUSAO: string,
      VISUALIZAR: string,
      PESQUISAR: string
    }
  },

  TINTURARIA: {
    MODULO: string
    PERMISSOES: {
      INCLUSAO: string,
      EXCLUSAO: string,
      EDICAO: string,
      GERAR_ROMANEIO: string,
      GERAR_PDF_ROMANEIO: string,
      PESQUISAR: string
    }
  },

  PRODUCAO_DUBLAGEM: {
    MODULO: string
    PERMISSOES: {
      INCLUSAO: string,
      EXCLUSAO: string,
      EDICAO: string,
      PESQUISAR: string
    }
  },

  PRODUCAO_MALHARIA: {
    MODULO: string
    PERMISSOES: {
      LANCAR: string,
      PERDAS: string,
      GRAFICOS: string
    }
  },

  GESTAO_PEDIDO: {
    MODULO: string
    PERMISSOES: {
      INCLUSAO: string,
      EXCLUSAO: string,
      EDICAO: string,
      PESQUISAR: string,
      GERAR_PROGRAMACAO: string,
      GERAR_ETIQUETAS: string
    }
  },

  PRODUTO: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  PESSOA: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  MAQUINA: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  ESTRUTURA: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  UNIDADE_MEDIDA: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  PRAZO: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  COR: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  GRUPOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  USUARIOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  },

  MODULOS: {
    MODULO: string
    PERMISSOES: {
      MANUTENCAO: string
    }
  }

}

export const PermissoesTypes: PermissoesTypeInterface = {

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
      MANUTENCAO: 'Manutenção de Cadastro de Grupos'
    }
  },

  USUARIOS: {
    MODULO: 'Cadastro de Usuários',
    PERMISSOES: {
      MANUTENCAO: 'Manutenção de Cadastro de Usuários'
    }
  },

  MODULOS: {
    MODULO: 'Cadastro de Módulos',
    PERMISSOES: {
      MANUTENCAO: 'Manutenção de Cadastro de Módulos'
    }
  }

}