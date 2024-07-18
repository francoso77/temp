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
  public dataTimeZoneZtoLocalInput(data: string): string {
    return DateTime.fromISO(data).toFormat("yyyy-MM-dd'T'HH:mm")
  }

  //Retorna formatação para número de nota fiscal no modelo 000.000.000
  public notaFiscal(nota: string): string {
    const notaComZeros = nota.padStart(9, '0');
    return notaComZeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}