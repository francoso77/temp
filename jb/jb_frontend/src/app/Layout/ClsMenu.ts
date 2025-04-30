export interface MenuOpcoesInterface {
  id: string;
  parentId: string | null;
  descricao: string;
  path: string;
  icon: string;
  filhos: Array<MenuOpcoesInterface>;
  permitido: boolean;
}


export default class MenuCls {

  private retornoMenu: Array<MenuOpcoesInterface> = [];

  public constructor(
    private Opcoes: Array<MenuOpcoesInterface>,
  ) {
    this.retornoMenu = this.ReorganizarEstrutura(null);
  }

  private ReorganizarEstrutura(filtrarID: string | null): Array<MenuOpcoesInterface> {
    const retorno: Array<MenuOpcoesInterface> = []

    this.Opcoes.forEach((opcao) => {
      if (opcao.parentId === filtrarID && opcao.permitido) {
        retorno.push({
          ...opcao,
          filhos: this.ReorganizarEstrutura(opcao.id)
        })
      }
    })

    return retorno
  }

  public get Menu(): Array<MenuOpcoesInterface> {
    return this.retornoMenu;
  }
}
