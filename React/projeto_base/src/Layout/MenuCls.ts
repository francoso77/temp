export interface MenuOpcoesInterface {
  id: string
  parentId: string
  descricao: string
  path: string
  icon: string
  filhos: Array<any>
}

export interface EstruturaMenuInterface extends MenuOpcoesInterface {
  filhos: Array<MenuOpcoesInterface>
}

const OPCAO_PRINCIPAL: string = 'Principal'

export default class MenuCls {

  private EstruturaMenu: Array<EstruturaMenuInterface> = []

  public constructor( private Opcoes: Array<MenuOpcoesInterface> ) {
    this.EstruturaMenu = this.ReorganizarEstrutura( OPCAO_PRINCIPAL )
  }

  private ReorganizarEstrutura ( filtrarID: string ): Array<EstruturaMenuInterface> {

    let retorno: Array<EstruturaMenuInterface> = []

    this.Opcoes.forEach( ( opcao ) => {
      if ( opcao.parentId === filtrarID ) {
        retorno.push( { ...opcao, filhos: this.ReorganizarEstrutura(opcao.id) } )
      }
    } )

    return retorno
  }

  public get Menu (): Array<EstruturaMenuInterface> {
    return this.EstruturaMenu
  }

}