import { PermissoesTypes } from "../../types/permissoesTypes"

export interface MenuOpcoesInterface {
  id: string
  parentId: string | null
  descricao: string
  path: string
  icon: string
  filhos: Array<MenuOpcoesInterface>
  modulo: string
  permissao: string
}


const MENU: Array<MenuOpcoesInterface> = [
  {
    id: '1',
    parentId: null,
    descricao: 'Cadastros',
    path: '',
    icon: 'app_registration_outlined',
    modulo: '',
    permissao: '',
    filhos: []
  },
  {
    id: '2',
    parentId: '1',
    descricao: 'Cores',
    path: '/Cor',
    icon: 'color_lens',
    filhos: [],
    modulo: PermissoesTypes.COR.MODULO,
    permissao: PermissoesTypes.COR.PERMISSOES.MANUTENCAO
  },
  {
    id: '3',
    parentId: '1',
    descricao: 'Estrutura de Produtos', 
    path: '/Estrutura',
    icon: 'auto_awesome_motion_outlined',
    filhos: [],
    modulo: PermissoesTypes.ESTRUTURA.MODULO,
    permissao: PermissoesTypes.ESTRUTURA.PERMISSOES.MANUTENCAO
  },
  {
    id: '4',
    parentId: '1',
    descricao: 'Máquinas Teares',
    path: '/Maquina',
    icon: 'miscellaneous_services',
    filhos: [],
    modulo: PermissoesTypes.MAQUINA.MODULO,
    permissao: PermissoesTypes.MAQUINA.PERMISSOES.MANUTENCAO
  },
  {
    id: '5',
    parentId: '1',
    descricao: 'Pessoas',
    path: '/Pessoa',
    icon: 'groups_rounded',
    filhos: [],
    modulo: PermissoesTypes.PESSOA.MODULO,
    permissao: PermissoesTypes.PESSOA.PERMISSOES.MANUTENCAO
  },
  {
    id: '6',
    parentId: '1',
    descricao: 'Prazo de Entrega',
    path: '/PrazoEntrega',
    icon: 'calendar_month_rounded',
    filhos: [],
    modulo: PermissoesTypes.PRAZO.MODULO,
    permissao: PermissoesTypes.PRAZO.PERMISSOES.MANUTENCAO
  },
  {
    id: '7',
    parentId: '1',
    descricao: 'Produtos',
    path: '/Produto',
    icon: 'category_rounded',
    filhos: [],
    modulo: PermissoesTypes.PRODUTO.MODULO,
    permissao: PermissoesTypes.PRODUTO.PERMISSOES.MANUTENCAO
  },
  {
    id: '8',
    parentId: '1',
    descricao: 'Unidades de Medidas',
    path: '/UnidadeMedida',
    icon: 'square_foot',
    filhos: [],
    modulo: PermissoesTypes.UNIDADE_MEDIDA.MODULO,
    permissao: PermissoesTypes.UNIDADE_MEDIDA.PERMISSOES.MANUTENCAO
  },
  {
    id: '9',
    parentId: null,
    descricao: 'Sistema',
    path: '',
    icon: 'settings_outlined',
    modulo: '',
    permissao: '',
    filhos: []
  },
  {
    id: '10',
    parentId: '9',
    descricao: 'Grupos de Usuários',
    path: '/GruposUsuarios',
    icon: 'people_alt_outlined',
    filhos: [],
    modulo: PermissoesTypes.GRUPOS.MODULO,
    permissao: PermissoesTypes.GRUPOS.PERMISSOES.MANUTENCAO
  },
  {
    id: '11',
    parentId: '9',
    descricao: 'Usuários',
    path: '/Usuarios',
    icon: 'person_outline_outlined',
    filhos: [],
    modulo: PermissoesTypes.USUARIOS.MODULO,
    permissao: PermissoesTypes.USUARIOS.PERMISSOES.CADASTRO_USUARIO_UNIDADE
  }
]

export default class MenuCls {
  private retornoMenu: Array<MenuOpcoesInterface> = []

  public constructor(private Opcoes: Array<MenuOpcoesInterface> = MENU) {
    this.retornoMenu = this.ReorganizarEstrutura(null)
  }

  private ReorganizarEstrutura(filtrarID: string | null): Array<MenuOpcoesInterface> {
    const retorno: Array<MenuOpcoesInterface> = []

    this.Opcoes.forEach((opcao) => {
      if (opcao.parentId === filtrarID) {
        retorno.push({
          ...opcao,
          filhos: this.ReorganizarEstrutura(opcao.id)
        })
      }
    })

    return retorno
  }


  public get Menu(): Array<MenuOpcoesInterface> {
    return this.retornoMenu
  }
}
