import { DateTime } from "luxon";

export default class ClsFormatacao {
  public telefone(numero: string): null | string {

    let cleaned = ("" + numero).replace(/\D/g, "");

    let mascara: RegExp =
      cleaned.length === 11 ?
        /^(\d{0,2})?(\d{0,5})?(\d{0,4})?$/ :
        /^(\d{0,2})?(\d{0,4})?(\d{0,4})?$/

    let match = cleaned.match(mascara);

    if (match && [10, 11].includes(cleaned.length)) {

      return [
        match[1] ? "(" : "",
        match[1],
        match[1] ? ") " : "",
        match[2],
        match[3] ? "-" : "",
        match[3],
      ].join("");

    } else {

      return null

    }

  }

  //Retorna a data atual no formato dd/MM/yyyy
  public obterDataAtualSistema = (): string => {
    const dataAtual = DateTime.now()
    return this.dataISOtoDatetime(dataAtual.toFormat('dd/MM/yyyy'))
  }
  /** Converte yyyy-MM-dd para dd/MM/yyyy */
  public dataISOtoUser(data: string): string {
    return DateTime.fromISO(data).toFormat('dd/MM/yyyy')
  }

  /** Converte dd/MM/yyyy para yyyy-MM-dd */
  public dataISOtoDatetime(data: string): string {
    return DateTime.fromFormat(data, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
  }
  public dataEHora(data: string): string {
    const dd = new Date(data)
    return dd.toLocaleString()
  }

  public currency(numero: number): string {
    return numero.toLocaleString('pt-br', { minimumFractionDigits: 2 })
  }

  public numeroPadrao(numero: number): string {
    return numero.toLocaleString('pt-br', { minimumFractionDigits: 0 })
  }
  public dataAbreviadaParaDataCompleta(dataAbreviada: string): string {
    return dataAbreviada.concat('/').concat(DateTime.now().toFormat('yyyy'))
  }
  public somenteNumeros(oque: string) {
    // Usando uma expressão regular para encontrar apenas os números na string
    var numeros = oque.match(/\d+/g)

    // Verifica se foram encontrados números
    if (numeros) {
      // Retorna os números encontrados como uma string
      return numeros.join("")
    } else {
      return ""
    }
  }

  //Retorna a data e a hora no formato "yyyy-MM-dd'T'HH:mm"
  public dataNormalParaDateTime(dataStr: string): string {
    let dia: string
    let mes: string
    let ano: string

    if (dataStr.includes('/')) {
      [dia, mes, ano] = dataStr.split('/')
    } else if (dataStr.length === 8) {
      dia = dataStr.substring(0, 2)
      mes = dataStr.substring(2, 4)
      ano = dataStr.substring(4, 8)
    } else {
      throw new Error('Formato de data inválido')
    }

    const data: Date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
    return data.toISOString()
  }

  //Retorna formatação para número de nota fiscal no modelo 000.000.000
  public notaFiscal(nota: string): string {
    const notaLimpa = nota.replace(/\./g, '')
    const notaComZeros = notaLimpa.padStart(9, '0');
    return notaComZeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }


  //Retorno da data do banco formata como dd/mm/yyyy
  public dataFormatada(dateString: string): string {
    if (dateString.length !== 8) {
      throw new Error("Data Inválida. Use o formato DDMMYYYY");
    }
    const day = dateString.substring(0, 2)
    const month = dateString.substring(2, 4)
    const year = dateString.substring(4, 8)
    return `${day}/${month}/${year}`
  }
}