import React from 'react';
import ClsApi from "./ClsApi";
import ClsFormatacao from "./ClsFormatacao";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ClsCrud from './ClsCrudApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface DadosPedidos {
  pedido: number;
  idCliente?: number;
  cliente: string;
  dataProgramacao: string;
  idProduto: number;
  produto: string;
  metros: number;
  cor?: string;
  tipoProduto?: number;
}

interface Dados {
  idProduto: number;
  qtdTotal: number;
  materiaPrima: string;
  cor: string;
}

interface DadosFilter {
  idProduto: number;
  idPedido: number;
  produto: string;
  tipoProduto: number;
  cor: string;
  metros: number;
  cliente: string;
}

interface DadosEtiqueta {
  dataProducao: string;
  pedido: number;
  idCliente: number;
  cliente: string;
  idProduto: number;
  produto: string;
  metros: number;
}

interface PecasTinturaria {
  peca: string;
  idTecido: number;
  artigo: string;
  peso: number;
}
interface DadosTinturaria {
  dataTinturaria: string;
  romaneio: number;
  idCliente: number;
  cliente: string;
  idTinturaria: number;
  tinturaria: string;
  pecas: Array<PecasTinturaria>;
}
class ClsRelatorioProgramacao {
  public tecidos: DadosFilter[] = [];
  public forros: Dados[] = [];
  public espumas: Dados[] = [];
  public pedidos: DadosPedidos[] = [];
  public etiquetas: DadosEtiqueta[] = [];
  public tinturaria: DadosTinturaria[] = [];
  public clsFormatacao = new ClsFormatacao();
  public clsApi = new ClsApi();
  public clsCrud = new ClsCrud();

  private async BuscarDados(dt: string | Array<number>): Promise<void> {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Padrão de data no formato YYYY-MM-DD
    try {

      const defaultDate = "0001-01-01";
      const formattedDate = typeof dt === 'string' && datePattern.test(dt) ? dt : defaultDate;

      const [pedidos, forros, espumas, tecidos, etiquetas] = await Promise.all([
        this.clsApi.execute<Array<DadosPedidos>>({
          url: 'fichasCortesPedidos',
          method: 'post',
          itemPesquisa: formattedDate,
        }),
        this.clsApi.execute<Array<Dados>>({
          url: 'pedidosEspumasEForrosProgramadas',
          method: 'post',
          itemPesquisa: formattedDate,
          campo: 'nome',
          tipo: 'Forro',
        }),
        this.clsApi.execute<Array<Dados>>({
          url: 'pedidosEspumasEForrosProgramadas',
          method: 'post',
          itemPesquisa: formattedDate,
          campo: 'nome',
          tipo: 'Espuma',
        }),
        this.clsApi.execute<Array<DadosFilter>>({
          url: 'pedidosTecidosProgramadas',
          method: 'post',
          itemPesquisa: formattedDate,
          campo: 'nome',
        }),
        this.clsApi.execute<Array<DadosEtiqueta>>({
          url: 'etiquetasPedidos',
          method: 'post',
          pedidos: typeof dt === 'object' ? dt : [0],
        })
      ]);

      this.pedidos = pedidos;
      this.forros = forros;
      this.espumas = espumas;
      this.tecidos = tecidos;
      this.etiquetas = etiquetas;

      // console.log('tecidos', this.tecidos);
      // console.log('pedidos', this.pedidos);
      // console.log('forros', this.forros);
      // console.log('espumas', this.espumas);
      // console.log('etiquetas', this.etiquetas);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  private renderDetalhes = (row: Dados): Array<{ metros: string; produto: string; cor: string; pedido: number; cliente: string }> => {
    const detalhesFiltrados = this.tecidos.filter(tecido => tecido.idProduto === row.idProduto && tecido.cor === row.cor);
    const itensFiltrados = this.tecidos.filter(item =>
      detalhesFiltrados.some(detalhe => detalhe.idPedido === item.idPedido) && item.tipoProduto === 10
    );

    if (itensFiltrados.length === 0) {
      return [];
    }

    return itensFiltrados.map(item => ({
      metros: this.clsFormatacao.currency(item.metros),
      produto: item.produto,
      cor: item.cor,
      pedido: item.idPedido,
      cliente: item.cliente,
    }));
  };

  private gerarPdf = (dt: string) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const title = 'Programação de Dublagem - Data: ' + this.clsFormatacao.dataISOtoUser(dt);

    doc.setFontSize(15);
    doc.text(title, 10, 10);

    let startY = 20; // Início da primeira linha do conteúdo

    this.espumas.forEach((espuma) => {
      this.forros.forEach((forro) => {
        // Verifica e gera o texto com ou sem forro
        const texto = (forro.qtdTotal !== espuma.qtdTotal)
          ? `${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor}`
          : `${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor} com ${forro.materiaPrima} - ${forro.cor}`;

        doc.setFontSize(13);
        doc.text(texto, 20, startY);

        // Renderiza os detalhes da espuma
        const detalhes = this.renderDetalhes(espuma);

        if (detalhes.length > 0) {
          autoTable(doc, {
            startY: startY + 10, // Ajusta para iniciar a tabela logo após o texto
            head: [['Metros', 'Produto', 'Cor', 'Pedido', 'Cliente']],
            body: detalhes.map(item => [item.metros, item.produto, item.cor, item.pedido, item.cliente]),
            headStyles: {
              fillColor: [220, 220, 220], // Cor de fundo (cinza claro)
              textColor: [0, 0, 0], // Cor do texto (preto)
              fontSize: 11, // Tamanho da fonte dos cabeçalhos
            },
            columnStyles: {
              0: { halign: 'right', cellWidth: 20 },
              1: { halign: 'left', cellWidth: 30 },
              2: { halign: 'left', cellWidth: 20 },
              3: { halign: 'right', cellWidth: 20 },
              4: { halign: 'left', cellWidth: 60 },
            },
            bodyStyles: {
              fontSize: 9, // Tamanho da fonte do corpo da tabela
            },
            styles: {
              lineColor: [0, 0, 0], // Cor das linhas (preto)
              fillColor: [255, 255, 255], // Cor de fundo das células (branco)
            },
          });

          // Atualiza o startY para a próxima iteração
          startY = (doc as any).lastAutoTable.finalY + 10;
        } else {
          // Caso não tenha tabela, apenas aumenta o espaçamento entre os blocos
          startY += 30;
        }
      });
    });

    doc.save('programacao_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
  };

  private gerarFicha = () => {

    let startY = 6
    let colunaTitulo = 20
    let ml = 1
    let contaEtiquetas = 0
    const doc = new jsPDF({
      orientation: 'portrait',   // 'portrait' ou 'landscape'
      unit: 'mm',                // Unidade: 'mm', 'cm', 'in', etc.
      // format: [105, 149]
      format: 'a4'         // Dimensões personalizadas: Largura e Altura (em milímetros para A4)
    });
    doc.setFontSize(12);

    let dadosPedidos = [];
    this.pedidos.forEach((item: any, index: number) => {
      if (contaEtiquetas === 1) {
        colunaTitulo = 130
        ml = 110
      } else if (contaEtiquetas === 2) {
        colunaTitulo = 20
        ml = 1
        startY = 150
      } else if (contaEtiquetas === 3) {
        colunaTitulo = 130
        ml = 110
        startY = 150
      } else if (contaEtiquetas === 4) {
        colunaTitulo = 20
        ml = 1
        startY = 6
        contaEtiquetas = 0
        doc.addPage()
      }
      contaEtiquetas = contaEtiquetas + 1

      dadosPedidos = [
        ['Pedido', 'Cliente'],
        [item.pedido, item.cliente],
        ['Produto', item.produto],
        ['QtdPedida', this.clsFormatacao.currency(item.metros)],
      ];


      doc.text('Produção Dublados', colunaTitulo, startY - 1);


      // Tabela de pedido
      autoTable(doc, {
        body: dadosPedidos,
        startY: startY,
        margin: { left: ml },
        theme: 'plain',
        styles: { halign: 'left', fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
        // tableWidth: 70,
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 65 },
        },
      });

      // Dados da tabela principal (60 linhas, 4 colunas numeradas)
      const numeros = Array.from({ length: 12 }, (_, i) => [
        (i + 1).toString(), '', (i + 13).toString(), '', (i + 23).toString(), ''
      ]);

      // Tabela de números e MTS
      autoTable(doc, {
        head: [['Nº', 'MTS', 'Nº', 'MTS', 'Nº', 'MTS']],
        body: numeros,
        startY: (doc as any).lastAutoTable.finalY + 1,  // Inicia após a tabela anterior
        margin: { left: ml },
        theme: 'grid',
        styles: { halign: 'center', valign: 'middle', fontSize: 8, lineWidth: 0.1, lineColor: [0, 0, 0] },
        columnStyles: {
          0: { cellWidth: 10, minCellHeight: 1 },
          1: { cellWidth: 20, minCellHeight: 1 },
          2: { cellWidth: 10, minCellHeight: 1 },
          3: { cellWidth: 20, minCellHeight: 1 },
          4: { cellWidth: 10, minCellHeight: 1 },
          5: { cellWidth: 20, minCellHeight: 1 },
        },
      });
    })

    doc.save('ficha_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');

  }

  private gerarEtiqueta = () => {

    const doc = new jsPDF({
      orientation: 'landscape',   // 'portrait' ou 'landscape'
      unit: 'mm',
      format: [100, 50]
    })

    const startX = 3; // Margem esquerda
    let startY = 10;   // Margem superior
    const lineHeight = 10; // Altura de cada linha

    this.etiquetas.forEach((item: DadosEtiqueta, i: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(item.produto, startX, startY);
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(13);
      doc.text(item.cliente, startX, startY + lineHeight);
      doc.text(this.clsFormatacao.notaFiscal(item.pedido.toString()), startX, startY + lineHeight * 2);
      doc.text(this.clsFormatacao.dataISOtoUser(item.dataProducao), startX + 30, startY + lineHeight * 2);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(55);
      doc.text(item.metros.toString(), startX + 70, 40);
      if (i < this.etiquetas.length - 1) {
        doc.addPage();
      }
    })

    doc.save('Etiqueta_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');

  }

  private gerarRomaneio = () => {
    const worksheet = XLSX.utils.json_to_sheet(this.etiquetas)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Romaneio')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Romaneio_Dublados - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.xlsx');
  }

  private gerarTintuaria = () => {

    const doc = new jsPDF({
      orientation: 'portrait',   // 'portrait' ou 'landscape'
      unit: 'mm',                // Unidade: 'mm', 'cm', 'in', etc.
      format: 'a4'
    })

    const startX = 3; // Margem esquerda
    let startY = 7;   // Margem superior
    const lineHeight = 7; // Altura de cada linha

    this.tinturaria.forEach((tinturaria: DadosTinturaria) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ROMANEIO: ' + this.clsFormatacao.notaFiscal(tinturaria.romaneio.toString()), startX, startY);
      doc.text('CLIENTE: ' + tinturaria.cliente, startX, startY * 2);
      doc.text('TINTURARIA: ' + tinturaria.tinturaria, startX, startY * 3);
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12);
      doc.text('PEÇA          PRODUTO         PESO', startX, startY * 5);
      doc.text('__________________________________________________________', startX, startY * 5);
      doc.setFontSize(10);

      tinturaria.pecas.forEach((item: PecasTinturaria) => {
        doc.text(item.peca, startX, startY + lineHeight * 5);
        doc.text(item.artigo, startX + 25, startY + lineHeight * 5);
        doc.text(item.peso.toString(), startX + 55, startY + lineHeight * 5);
        startY += lineHeight;
      })

    })

    doc.save('Romaneio_Malharia - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');

  }

  public renderTintuaria = async (romaneio: number) => {
    await this.clsApi.execute<Array<DadosTinturaria>>({
      url: 'romaneiosTinturaria',
      method: 'post',
      id: romaneio,
    }).then((res: Array<DadosTinturaria>) => {
      this.tinturaria = res
    })

    this.gerarTintuaria()
  }

  public renderRelacao = async (dt: string) => {
    await this.BuscarDados(dt)
    this.gerarPdf(dt)
  }

  public renderFicha = async (dt: string) => {
    await this.BuscarDados(dt)
    this.gerarFicha()
  }

  public renderEtiqueta = async (ids: Array<number>) => {
    await this.BuscarDados(ids)
    this.gerarEtiqueta()
  }

  public renderRomaneio = async (ids: Array<number>) => {
    await this.BuscarDados(ids)
    this.gerarRomaneio()
  }
}

export default ClsRelatorioProgramacao
