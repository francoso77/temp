export default class ClsAcesso {
  public chkAcesso(permissoes: Array<any>, modulo: string, permissao: string): boolean {

    if (modulo && permissao) {
      const retorno: boolean = permissoes.some(x => x.modulo === modulo && x.permissao === permissao)
      return retorno
    } else {
      return true
    }
  }

  public chkAcessoModulo(permissoes: Array<any>, modulo: string): boolean {

    if (modulo) {
      const retorno: boolean = permissoes.some(x => x.modulo === modulo)
      return retorno
    } else {
      return true
    }
  }
}