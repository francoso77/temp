import { DateTime } from "luxon";
import { PedidoInterface } from '../Interfaces/pedidoInterface';
import { PeriodoType } from '../types/periodoTypes';

interface IntervaloDatas {
  inicio: Date;
  fim: Date;
}

export interface ProductionData {
  month: string;
  nylon: number;
  palmilha: number;
  tecidoCru: number;
}

export interface TopProduto {
  nomeProduto: string;
  qtdTotal: number;
  valorTotal: number;
}

export interface TopCliente {
  nomeCliente: string;
  qtdPedidos: number;
  valorTotal: number;
}

interface ResultadoPeriodo {
  periodoAtual: IntervaloDatas;
  periodoAnterior: IntervaloDatas | null;
  pedidosAtual: PedidoInterface[];
  pedidosAnterior: PedidoInterface[];
  productionData: ProductionData[];
  topProdutos: TopProduto[];
  topClientes: TopCliente[];
}

/**
 * Biblioteca de validação de dados para esquema CRUD React conforme padrões de projeto "Zanatta"
 */
export default class ClsValidacao {

  private validarUF(uf: string): boolean {
    const ufsValidas = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
    return ufsValidas.includes(uf.toUpperCase());
  }

  private validarCalculoCPF(cpf: string): boolean {

    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) return false; // Verifica se o CPF tem 11 dígitos

    // Verifica se todos os dígitos são iguais (CPF inválido)

    for (let i = 0; i < 10; i++) {
      if (cpf.charAt(i) !== cpf.charAt(i + 1)) break;
      if (i === 9) return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = soma % 11;

    let digito1 = resto < 2 ? 0 : 11 - resto;

    // Verifica o primeiro dígito verificador

    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    // Calcula o segundo dígito verificador

    soma = 0;
    for (var i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = soma % 11;
    var digito2 = resto < 2 ? 0 : 11 - resto;

    // Verifica o segundo dígito verificador
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true; // CPF válido

  }

  private validarCalculoCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // remove caracteres não numéricos

    if (cnpj.length !== 14)
      return false;

    // Validar dígitos verificadores
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {

      soma += parseInt(numeros.charAt(tamanho - i)) * pos--

      if (pos < 2)
        pos = 9

    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado.toString() !== digitos.charAt(0))
      return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2)
        pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado.toString() !== digitos.charAt(1))
      return false

    return true
  }

  private validarComRegEx(validacao: RegExp, campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = '',
    mensagemErroVazio: string = ''
  ): boolean {

    if (!permiteVazio && (dados[campo] as string).length === 0) {

      erros[campo] = mensagemErroVazio
      return false

    } else if (permiteVazio && (dados[campo] as string).length === 0) {

      return retorno && true

    } else {

      if (!dados[campo].trim() === dados[campo] || !validacao.test(dados[campo])) {
        erros[campo] = mensagemErro
        return false
      }

      return retorno && true

    }

  }

  /**
   * Verifica se é um telefone válido - padrão BR | 11 ou 12 dígitos (com DDD)
   * @param campo Nome do campo a ser testado
   * @param dados Objeto de conjunto de dados
   * @param erros Objeto de conjunto de erros
   * @param retorno retorno atualmente "setado" - sempre retorna negativo se este campo vier negativo
   * @param permiteVazio retorna verdadeiro ( @param retorno ) caso campo seja vazio
   * @param mensagemErro conteúdo de erro caso seja inválido o telefone
   * @param mensagemErroVazio conteúdo de erro caso seja vazio e não permitido vazio
   * @returns 
   */
  public eTelefone(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'Número de Telefone Inválido',
    mensagemErroVazio: string = 'Forneça um Número Válido'
  ): boolean {

    //eslint-disable-next-line
    const regExpTel: RegExp = /\(\d{2,}\) \d{4}\-\d{4}|\(\d{2,}\) \d{5}\-\d{4}/g

    return this.validarComRegEx(regExpTel, campo, dados, erros, retorno, permiteVazio, mensagemErro, mensagemErroVazio)

  }

  //     /**
  //  * Verifica se é um número de nota fiscal válido - padrão 000.000.000
  //  * @param campo Nome do campo a ser testado
  //  * @param dados Objeto de conjunto de dados
  //  * @param erros Objeto de conjunto de erros
  //  * @param retorno retorno atualmente "setado" - sempre retorna negativo se este campo vier negativo
  //  * @param permiteVazio retorna verdadeiro ( @param retorno ) caso campo seja vazio
  //  * @param mensagemErro conteúdo de erro caso seja inválido o telefone
  //  * @param mensagemErroVazio conteúdo de erro caso seja vazio e não permitido vazio
  //  * @returns 
  //  */
  //     public eNF(campo: string,
  //       dados: { [key: string]: any },
  //       erros: { [key: string]: string },
  //       retorno: boolean,
  //       permiteVazio: boolean = false,
  //       mensagemErro: string = 'Email Inválido',
  //       mensagemErroVazio: string = 'Forneça um Email Válido'
  //     ): boolean {

  //       //eslint-disable-next-line
  //       const regExpNF: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  //       return this.validarComRegEx(regExpEmail, campo, dados, erros, retorno, permiteVazio, mensagemErro, mensagemErroVazio)

  //     }

  /**
 * Verifica se é uma conta de e-mail válido
 * @param campo Nome do campo a ser testado
 * @param dados Objeto de conjunto de dados
 * @param erros Objeto de conjunto de erros
 * @param retorno retorno atualmente "setado" - sempre retorna negativo se este campo vier negativo
 * @param permiteVazio retorna verdadeiro ( @param retorno ) caso campo seja vazio
 * @param mensagemErro conteúdo de erro caso seja inválido o telefone
 * @param mensagemErroVazio conteúdo de erro caso seja vazio e não permitido vazio
 * @returns 
 */
  public eEmail(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'Email Inválido',
    mensagemErroVazio: string = 'Forneça um Email Válido'
  ): boolean {

    //eslint-disable-next-line
    const regExpEmail: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    return this.validarComRegEx(regExpEmail, campo, dados, erros, retorno, permiteVazio, mensagemErro, mensagemErroVazio)

  }

  /**
   * Verifica se determinado campo é "vazio". String ou Número
   * @param campo Nome do campo a ser testado
   * @param dados Objeto de conjunto de dados
   * @param erros Objeto de conjunto de erros
   * @param retorno retorno atualmente "setado" - sempre retorna negativo se este campo vier negativo
   * @param mensagemErro Mensagem de erro a ser atribuida ao objeto "erro", caso vazio
   * @returns {true | false} Se "Não Vazio" ou "Vazio"
   */
  public naoVazio(
    campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    mensagemErro: string = 'Não Pode Ser Vazio'): boolean {

    if (dados === null || dados[campo] === null) {
      erros[campo] = mensagemErro
      return false

      // Testa String ou Número, senão sempre false
    } else if (['string', 'number'].includes(typeof dados[campo])) {

      if (
        (typeof dados[campo] == 'string' && (dados[campo] as string).length === 0)
        || (typeof dados[campo] == 'number' && (dados[campo] as number) === 0)
      ) {
        erros[campo] = mensagemErro
        return false

      } else {

        return retorno && true

      }

    } else {

      erros[campo] = 'Campo não é String ou Número...'
      return false

    }
  }

  /**
 * Verifica se é um telefone válido - padrão BR | 11 ou 12 dígitos (com DDD)
 * @param campo Nome do campo a ser testado
 * @param dados Objeto de conjunto de dados
 * @param erros Objeto de conjunto de erros
 * @param retorno retorno atualmente "setado" - sempre retorna negativo se este campo vier negativo
 * @param permiteVazio retorna verdadeiro ( @param retorno ) caso campo seja vazio
 * @param mensagemErro conteúdo de erro caso seja inválido o telefone
 * @param mensagemErroVazio conteúdo de erro caso seja vazio e não permitido vazio
 * @returns 
 */
  public tamanho(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    tamanhoMinimo: number = 0,
    tamanhoMaximo: number = 255,
    mensagemErro: string = 'Tamanho Inválido do Campo',
    mensagemErroVazio: string = 'Campo Não Pode Ser Vazio',
  ): boolean {

    if (typeof dados[campo] === 'string') {

      const conteudo: string = dados[campo]

      if (!permiteVazio && (conteudo as string).length === 0) {

        erros[campo] = mensagemErroVazio
        return false

      } else if (permiteVazio && (conteudo as string).length === 0) {

        return retorno && true

      } else {

        if (conteudo.length >= tamanhoMinimo && conteudo.length <= tamanhoMaximo) {

          return retorno && true

        } else {

          erros[campo] = mensagemErro
          return false

        }

      }

    } else {

      erros[campo] = 'Conteúdo Inválido!'
      return false

    }

  }


  public eUF(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'UF Inválida',
    mensagemErroVazio: string = 'Forneça uma UF Válido'
  ): boolean {

    if (!permiteVazio && (dados[campo] as string).length === 0) {

      erros[campo] = mensagemErroVazio
      return false

    } else if (permiteVazio && (dados[campo] as string).length === 0) {

      return retorno && true

    } else {

      if (!dados[campo].trim() === dados[campo] || !this.validarUF(dados[campo])) {
        erros[campo] = mensagemErro
        return false
      }

      return retorno && true

    }

  }

  public eCNPJ(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'CNPJ Inválido',
    mensagemErroVazio: string = 'Forneça um CNPJ Válido'
  ): boolean {

    if (!permiteVazio && (dados[campo] as string).length === 0) {

      erros[campo] = mensagemErroVazio
      return false

    } else if (permiteVazio && (dados[campo] as string).length === 0) {

      return retorno && true

    } else {

      if (!dados[campo].trim() === dados[campo] || !this.validarCalculoCNPJ(dados[campo])) {
        erros[campo] = mensagemErro
        return false
      }

      return retorno && true

    }

  }


  public eCPF(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'CPF Inválido',
    mensagemErroVazio: string = 'Forneça um CPF Válido'
  ): boolean {

    if (!permiteVazio && (dados[campo] as string).length === 0) {

      erros[campo] = mensagemErroVazio
      return false

    } else if (permiteVazio && (dados[campo] as string).length === 0) {

      return retorno && true

    } else {

      if (!dados[campo].trim() === dados[campo] || !this.validarCalculoCPF(dados[campo])) {
        erros[campo] = mensagemErro
        return false
      }
      return retorno && true
    }
  }

  public isValidDate = (value: any): boolean => {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }
  public eData(campo: string,
    dados: { [key: string]: any },
    erros: { [key: string]: string },
    retorno: boolean,
    permiteVazio: boolean = false,
    mensagemErro: string = 'Data Inválida',
    mensagemErroVazio: string = 'Forneça uma Data Válida'
  ): boolean {

    if (!permiteVazio && (dados[campo] as string).length === 0) {

      erros[campo] = mensagemErroVazio
      return false

    } else if (permiteVazio && (dados[campo] as string).length === 0) {

      return retorno && true

    } else {

      let data: string = dados[campo]

      if (data.length !== 10) {

        erros[campo] = mensagemErro
        return false

      } else {

        if (DateTime.fromFormat(data, 'yyyy-MM-dd').isValid) {
          return retorno && true
        } else {
          erros[campo] = mensagemErro
          return false
        }
      }
    }
  }


  // ==========================================================
  // Função auxiliar para ProductionData
  // ==========================================================
  private formatMonthYear(date: Date): string {
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${mes}/${ano}`;
  }

  private gerarProductionData(pedidos: PedidoInterface[]): ProductionData[] {
    const mapa = new Map<string, ProductionData>();

    pedidos.forEach((p) => {
      const data = new Date(p.dataPedido);
      const chaveMes = this.formatMonthYear(data);

      if (!mapa.has(chaveMes)) {
        mapa.set(chaveMes, {
          month: chaveMes,
          nylon: 0,
          palmilha: 0,
          tecidoCru: 0,
        });
      }

      const registro = mapa.get(chaveMes)!;

      (p.detalhePedidos || []).forEach((d) => {
        const qtd = Number(d.qtdPedida) || 0;
        const tipo = Number(d.produto?.tipoProduto);

        switch (tipo) {
          case 7:
            registro.nylon += qtd;
            break;
          case 8:
            registro.palmilha += qtd;
            break;
          case 9:
            registro.tecidoCru += qtd;
            break;
        }
      });
    });

    return Array.from(mapa.values());
  }
  public filtraPedidosPorPeriodo(
    pedidos: PedidoInterface[],
    idPeriodo: number,
    idTipoProduto: number,
    idCliente: number,
    idVendedor: number
  ): ResultadoPeriodo {

    console.log('Pedidos recebidos: ', pedidos)
    const hoje = new Date();

    let atual: IntervaloDatas | null = null;
    let anterior: IntervaloDatas | null = null;

    // ==========================================================
    // 1) Definir intervalo de datas se idPeriodo > 0
    // ==========================================================
    if (idPeriodo > 0) {
      switch (idPeriodo) {
        case PeriodoType.mes_atual: {
          const inicioAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          const fimAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

          const inicioAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
          const fimAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

          atual = { inicio: inicioAtual, fim: fimAtual };
          anterior = { inicio: inicioAnterior, fim: fimAnterior };
          break;
        }
        case PeriodoType.ultimo_mes: {
          const inicioAtual = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
          const fimAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

          const inicioAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
          const fimAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 0);

          atual = { inicio: inicioAtual, fim: fimAtual };
          anterior = { inicio: inicioAnterior, fim: fimAnterior };
          break;
        }
        case PeriodoType.ultimos_3_meses: {
          const inicioAtual = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
          const fimAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

          const inicioAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
          const fimAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 0);

          atual = { inicio: inicioAtual, fim: fimAtual };
          anterior = { inicio: inicioAnterior, fim: fimAnterior };
          break;
        }
        case PeriodoType.ultimos_6_meses: {
          const inicioAtual = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
          const fimAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

          const inicioAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1);
          const fimAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 0);

          atual = { inicio: inicioAtual, fim: fimAtual };
          anterior = { inicio: inicioAnterior, fim: fimAnterior };
          break;
        }
        case PeriodoType.ano_atual: {
          const inicioAtual = new Date(hoje.getFullYear(), 0, 1);
          const fimAtual = new Date(hoje.getFullYear(), 11, 31);

          const inicioAnterior = new Date(hoje.getFullYear() - 1, 0, 1);
          const fimAnterior = new Date(hoje.getFullYear() - 1, 11, 31);

          atual = { inicio: inicioAtual, fim: fimAtual };
          anterior = { inicio: inicioAnterior, fim: fimAnterior };
          break;
        }
        default:
          throw new Error("Período inválido");
      }
    }

    // ==========================================================
    // 2) Aplicar filtros (data, cliente, vendedor, produto)
    // ==========================================================
    const aplicarFiltros = (lista: PedidoInterface[], inicio?: Date, fim?: Date) => {
      return lista.filter((p) => {
        const dataPedido = new Date(p.dataPedido);

        // período
        if (inicio && fim) {
          if (dataPedido < inicio || dataPedido > fim) return false;
        }

        // cliente
        if (idCliente > 0 && p.idPessoa_cliente !== idCliente) return false;

        // vendedor
        if (idVendedor > 0 && p.idPessoa_vendedor !== idVendedor) return false;

        // tipo produto
        if (idTipoProduto > 0) {
          const temProduto = (p.detalhePedidos || []).some(
            (d) => Number(d.produto?.tipoProduto) === idTipoProduto
          );
          if (!temProduto) return false;
        }

        return true;
      });
    };

    const pedidosAtual =
      idPeriodo > 0 && atual
        ? aplicarFiltros(pedidos, atual.inicio, atual.fim)
        : aplicarFiltros(pedidos);

    const pedidosAnterior =
      idPeriodo > 0 && anterior
        ? aplicarFiltros(pedidos, anterior.inicio, anterior.fim)
        : [];

    // ==========================================================
    // 3) Montar ProductionData (agrupado por mês)
    // ==========================================================
    const productionData = this.gerarProductionData(pedidosAtual);

    // ==========================================================
    // 4) Montar TopProdutos (5 primeiros)
    // ==========================================================
    const produtoMap = new Map<string, { qtd: number; valor: number }>();

    pedidosAtual.forEach(pedido => {
      pedido.detalhePedidos.forEach((det: any) => {
        const nomeProduto = det.produto.nome
        const qtd = det.qtdPedida
        const valor = det.qtdPedida * det.vrUnitario

        if (!produtoMap.has(nomeProduto)) {
          produtoMap.set(nomeProduto, { qtd: 0, valor: 0 })
        }
        const prod = produtoMap.get(nomeProduto)!
        prod.qtd += qtd
        prod.valor += valor
      })
    })

    const topProdutos: TopProduto[] = Array.from(produtoMap.entries())
      .map(([nomeProduto, { qtd, valor }]) => ({
        nomeProduto,
        qtdTotal: qtd,
        valorTotal: valor,
      }))
      .sort((a, b) => b.qtdTotal - a.qtdTotal)
      .slice(0, 5);

    // ==========================================================
    // 5) Montar TopClientes (5 primeiros)
    // ==========================================================
    const clienteMap = new Map<string, { qtdPedidos: number; valor: number }>();

    pedidosAtual.forEach(pedido => {
      const nomeCliente = pedido.cliente.nome
      let valorPedido = 0

      pedido.detalhePedidos.forEach((det: any) => {
        valorPedido += det.qtdPedida * det.vrUnitario
      })

      if (!clienteMap.has(nomeCliente)) {
        clienteMap.set(nomeCliente, { qtdPedidos: 0, valor: 0 })
      }
      const cliente = clienteMap.get(nomeCliente)!
      cliente.qtdPedidos += 1
      cliente.valor += valorPedido
    })

    const topClientes: TopCliente[] = Array.from(clienteMap.entries())
      .map(([nomeCliente, { qtdPedidos, valor }]) => ({
        nomeCliente,
        qtdPedidos,
        valorTotal: valor,
      }))
      .sort((a, b) => b.qtdPedidos - a.qtdPedidos)
      .slice(0, 5);

    // ==========================================================
    // 6) Retorno final
    // ==========================================================
    return {
      periodoAtual: atual ?? { inicio: hoje, fim: hoje },
      periodoAnterior: anterior,
      pedidosAtual,
      pedidosAnterior,
      productionData,
      topProdutos,
      topClientes,
    };
  }

}
