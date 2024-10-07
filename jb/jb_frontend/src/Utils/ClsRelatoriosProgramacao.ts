import React from 'react';
import ClsApi from "./ClsApi";
import ClsFormatacao from "./ClsFormatacao";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ClsCrud from './ClsCrudApi';

interface DadosPedidos {
  pedido: number;
  cliente: string;
  dataProgramacao: string;
  produto: string;
  metros: number;
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

class ClsRelatorioProgramacao {
  public tecidos: DadosFilter[] = [];
  public forros: Dados[] = [];
  public espumas: Dados[] = [];
  public pedidos: DadosPedidos[] = [];
  public clsFormatacao = new ClsFormatacao();
  public clsApi = new ClsApi();
  public clsCrud = new ClsCrud();

 private async BuscarDados(dt: string): Promise<void> {
    try {
      const [pedidos, forros, espumas, tecidos] = await Promise.all([
        this.clsApi.execute<Array<DadosPedidos>>({ url: 'fichasCortesPedidos', method: 'post', itemPesquisa: dt }),
        this.clsApi.execute<Array<Dados>>({
          url: 'pedidosEspumasEForrosProgramadas',
          method: 'post',
          itemPesquisa: dt,
          campo: 'nome',
          tipo: 'Forro',
        }),
        this.clsApi.execute<Array<Dados>>({
          url: 'pedidosEspumasEForrosProgramadas',
          method: 'post',
          itemPesquisa: dt,
          campo: 'nome',
          tipo: 'Espuma',
        }),
        this.clsApi.execute<Array<DadosFilter>>({
          url: 'pedidosTecidosProgramadas',
          method: 'post',
          itemPesquisa: dt,
          campo: 'nome',
        }),
      ]);

      this.pedidos = pedidos;
      this.forros = forros;
      this.espumas = espumas;
      this.tecidos = tecidos;

      console.log('Dados buscados:', { pedidos, tecidos, forros, espumas });
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
    const title = 'Programação de Dublagem' + ' - Data: ' + this.clsFormatacao.dataISOtoUser(dt);

    doc.setFontSize(15);
    doc.text(title, 10, 10);

    let startY = 20; // Início da primeira linha do conteúdo

    this.espumas.forEach((espuma, _index) => {
      this.forros.forEach((forro, _index) => {
        if (forro.qtdTotal !== espuma.qtdTotal) {
          doc.setFontSize(13);
          doc.text(`${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor}`, 20, startY);
        } else {
          doc.text(`${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor} com ${forro.materiaPrima} - ${forro.cor}`, 20, startY);
        }

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

          // Atualiza o startY para a próxima iteração, considerando onde a tabela terminou
          startY = (doc as any).lastAutoTable.finalY + 10;
        } else {
          // Caso não tenha tabela, apenas aumenta o espaçamento entre os blocos
          startY += 30;
        }
      })
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

        // Atualiza o startY para a próxima iteração, considerando onde a tabela terminou
        startY = (doc as any).lastAutoTable.finalY + 10;
      } else {
        // Caso não tenha tabela, apenas aumenta o espaçamento entre os blocos
        startY += 30;
      }
    })

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
      if (contaEtiquetas == 1) {
        colunaTitulo = 130
        ml = 110
      } else if (contaEtiquetas == 2) {
        colunaTitulo = 20
        ml = 1
        startY = 150
      } else if (contaEtiquetas == 3) {
        colunaTitulo = 130
        ml = 110
        startY = 150
      } else if (contaEtiquetas == 4) {
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
        ['QtdPedida', item.qtdPedida],
      ];


      doc.text('Produção Dublados', colunaTitulo, startY - 1);


      // Tabela de pedido
      autoTable(doc, {
        body: dadosPedidos,
        startY: startY,
        margin: { left: ml },
        theme: 'plain',
        styles: { halign: 'left', fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
        tableWidth: 70,
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 65 },
        },
      });

      // Dados da tabela principal (60 linhas, 4 colunas numeradas)
      const numeros = Array.from({ length: 10 }, (_, i) => [
        (i + 1).toString(), '', (i + 11).toString(), '', (i + 21).toString(), ''
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
    
    let startY = 1
    let ml = 1
    let contaEtiquetas = 0
    const doc = new jsPDF({
      orientation: 'portrait',   // 'portrait' ou 'landscape'
      unit: 'mm',                // Unidade: 'mm', 'cm', 'in', etc.
      format: [105, 149]
      // format: 'a4'         // Dimensões personalizadas: Largura e Altura (em milímetros para A4)
    });
    doc.setFontSize(12);

    let dadosPedidos = [];
    this.pedidos.forEach((item: any, index: number) => {
      if (contaEtiquetas == 1) {
        ml = 110
      } else if (contaEtiquetas == 2) {
        ml = 1
        startY = 150
      } else if (contaEtiquetas == 3) {
        ml = 110
        startY = 150
      } else if (contaEtiquetas == 4) {
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
        ['QtdPedida', item.qtdPedida],
      ];


      doc.text('Produção Dublados', 10, startY );


      // Tabela de pedido
      autoTable(doc, {
        body: dadosPedidos,
        startY: startY,
        margin: { left: ml },
        theme: 'plain',
        styles: { halign: 'left', fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] },
        tableWidth: 70,
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 65 },
        },
      });

    })

    doc.save('Etiqueta_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');

  }

  public renderRelacao = async (dt: string) => {
    console.log('data recebida para pesquisa', dt);
    await this.BuscarDados(dt); // Aguarda a busca dos dados antes de gerar o PDF
    this.gerarPdf(dt);
  }

  public renderFicha = async (dt: string) => {
    await this.BuscarDados(dt); // Aguarda a busca dos dados antes de gerar o PDF
    this.gerarFicha();
  }

  public renderEtiqueta = async (dt: string) => {
    await this.BuscarDados(dt); // Aguarda a busca dos dados antes de gerar o PDF
    this.gerarEtiqueta();
  }

}

export default ClsRelatorioProgramacao;
