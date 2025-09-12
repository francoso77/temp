import ClsApi from "./ClsApi";
import ClsFormatacao from "./ClsFormatacao";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ClsCrud from './ClsCrudApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Composicao = {
  fio: string;
  qtdFio: number;
};

type Peca = {
  peca: string;
  peso: number;
  tear: string;
  artigo: string;
  tecelao: string;
  revisador: string;
  composisao: Composicao[];
};

type PecaProgramacaoTinturaria = {
  produto: string;
  cor: string;
  peso: number;
  largura: number;
  gm2: number;
  qtdPecas: number;
};

type RelatorioProps = {
  dados: PecaProgramacaoTinturaria[];
  msg: string;
};
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
  pedido: number;
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

interface DadosTinturaria {
  dataTinturaria: string;
  romaneio: number;
  idCliente: number;
  cliente: string;
  idTinturaria: number;
  tinturaria: string;
  pecas: Array<Peca>;
}

interface DadosProgramacao {
  dataProgramacao: string;
  romaneio: number;
  idCliente: number;
  cliente: string;
  idTinturaria: number;
  tinturaria: string;
  pecas: Array<Peca>;
}


interface DadosProgramacaoTinturaria {
  idProgramacao: number;
  dataProgramacao: string;
  notafiscal: string;
  msg: string;
  romaneio: number;
  cliente: string;
  tinturaria: string;
  pecas: Array<PecaProgramacaoTinturaria>;
}


class ClsRelatorioProgramacao {
  public tecidos: DadosFilter[] = [];
  public forros: Dados[] = [];
  public espumas: Dados[] = [];
  public pedidos: DadosPedidos[] = [];
  public etiquetas: DadosEtiqueta[] = [];
  public tinturaria: DadosTinturaria[] = [];
  public programacaoTinturaria: DadosProgramacaoTinturaria[] = [];
  public programacao: DadosProgramacao[] = [];
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

  private renderDetalhes = (dados: any): Array<{ metros: string; produto: string; cor: string; pedido: number; cliente: string }> => {


    const detalhesFiltrados = this.tecidos.filter(tecido => tecido.idPedido === dados.idPedido);

    console.log('detalhesFiltrados', detalhesFiltrados);
    console.log('pedido', dados);

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

    this.espumas.forEach((espuma: any) => {
      this.forros.forEach((forro) => {
        // Verifica e gera o texto com ou sem forro
        const texto = (forro.qtdTotal !== espuma.qtdTotal)
          ? `${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor}`
          : `${this.clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor} com ${forro.materiaPrima} - ${forro.cor}`;

        doc.setFontSize(13);
        doc.text(texto, 20, startY);
      });

      // Renderiza os detalhes da espuma


      const detalhes = this.renderDetalhes(espuma);

      // console.log('detalhes', detalhes);
      // console.log('espuma', espuma);

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

    //doc.save('programacao_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);
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

    //doc.save('ficha_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

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
      doc.text(item.metros.toString(), startX + 60, 40);
      if (i < this.etiquetas.length - 1) {
        doc.addPage();
      }
    })

    //doc.save('Etiqueta_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);

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
    this.tinturaria.forEach((item: DadosTinturaria) => {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const marginTop = 15;
      let cursorY = marginTop;
      let pesoTotalGeral = 0;
      let qtdTotalGeral = 0;
      let pageNumber = 1;

      // Cabeçalho do Relatório
      const addHeader = () => {
        doc.setFontSize(16);
        doc.text("Romaneio de peças", 40, cursorY, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Cliente: ' + item.cliente, 80, cursorY - 5);
        doc.text('Tinturaria: ' + item.tinturaria, 80, cursorY + 5);
        doc.text('Romaneio: ' + this.clsFormatacao.notaFiscal(item.romaneio.toString()), 160, cursorY + 5);
        cursorY += 10;
      };

      // Rodapé do Relatório
      const addFooter = () => {
        const dataAtual = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(8);
        doc.text(dataAtual, 10, pageHeight - 10);
        doc.text(`Página ${pageNumber}`, pageWidth - 20, pageHeight - 10);
      };

      // Função para iniciar nova página
      const addNewPage = () => {
        doc.addPage();
        pageNumber += 1;
        cursorY = marginTop;
        addFooter();
      };

      addHeader();
      addFooter();

      const artigosAgrupados = item.pecas.reduce((acc, peca) => {
        if (!acc[peca.artigo]) acc[peca.artigo] = [];
        acc[peca.artigo].push(peca);
        return acc;
      }, {} as Record<string, Peca[]>);

      Object.entries(artigosAgrupados).forEach(([artigo, pecas]) => {
        const pesoTotalArtigo = pecas.reduce((acc, peca) => acc + peca.peso, 0);
        const qtdTotalArtigo = pecas.length;
        pesoTotalGeral += pesoTotalArtigo;
        qtdTotalGeral += qtdTotalArtigo;

        const artigoHeight = 30 + pecas.length * 10 + pecas[0].composisao.length * 10;
        if (cursorY + artigoHeight > pageHeight - 20) addNewPage();

        autoTable(doc, {
          head: [[`Artigo: ${artigo}`, `Peso Total: ${pesoTotalArtigo.toFixed(2)} kg`, `Quantidade: ${qtdTotalArtigo}`]],
          startY: cursorY,
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            fontStyle: 'italic',
            fontSize: 9,
          },
        });

        cursorY = (doc as any).lastAutoTable.finalY + 1;

        const composicaoArtigo = pecas[0].composisao.map((fio) => [
          fio.fio,
          (fio.qtdFio).toFixed(2) + '%',
          (fio.qtdFio * pesoTotalArtigo).toFixed(2),
        ]);

        autoTable(doc, {
          head: [['Fio', 'Qtd%', 'Qtd Total (Fio x Peso do Artigo)']],
          body: composicaoArtigo,
          startY: cursorY,
          bodyStyles: {
            fontSize: 5,
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            fontStyle: 'normal',
            fontSize: 9,
          },
        });

        cursorY = (doc as any).lastAutoTable.finalY + 1;

        const tearesAgrupados = pecas.reduce((acc, peca) => {
          if (!acc[peca.tear]) acc[peca.tear] = [];
          acc[peca.tear].push(peca);
          return acc;
        }, {} as Record<string, Peca[]>);

        Object.entries(tearesAgrupados).forEach(([tear, itensTear]) => {
          autoTable(doc, {
            head: [[`Tear: ${tear}`]],
            startY: cursorY,
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineWidth: 0.1,
              lineColor: [0, 0, 0],
              fontStyle: 'normal',
              fontSize: 9,
            },
          });

          cursorY = (doc as any).lastAutoTable.finalY + 0.5;

          const itemData = itensTear.map((peca) => [
            peca.peca,
            peca.peso.toFixed(2) + ' kg',
            peca.tecelao,
            peca.revisador,
          ]);

          autoTable(doc, {
            head: [['Peça', 'Peso', 'Tecelão', 'Revisor']],
            body: itemData,
            startY: cursorY,
            bodyStyles: { fontSize: 7 },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              lineWidth: 0.1,
              lineColor: [0, 0, 0],
              fontStyle: 'normal',
              fontSize: 9,
            },
          });

          cursorY = (doc as any).lastAutoTable.finalY + 1;
        });
      });

      // Totalização
      if (cursorY + 10 > pageHeight - 20) addNewPage();

      autoTable(doc, {
        head: [['Peso Total Geral', 'Quantidade Total Geral']],
        body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
        startY: cursorY + 5,
        bodyStyles: { fontSize: 8, halign: 'right' },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', fontStyle: 'italic' },
      });

      // Salva PDF individual por romaneio
      //doc.save(`Romaneio_Malharia-Romaneio-${item.romaneio}.pdf`);
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 10000);
    });
  };


  private gerarProgramacaoTinturaria = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const marginTop = 15;
    let cursorY = marginTop;
    let pesoTotalGeral = 0;
    let qtdTotalGeral = 0;
    let pageNumber = 1;

    // Carregar logomarca
    const logo = "/img/logomarca.png";

    const addFooter = () => {
      const dataAtual = new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.setFontSize(8);
      doc.text(dataAtual, 10, pageHeight - 10);
      doc.text(`Página ${pageNumber}`, pageWidth - 20, pageHeight - 10);
    };

    const addNewPage = () => {
      doc.addPage();
      pageNumber += 1;
      cursorY = marginTop;
      addFooter();
    };

    this.programacaoTinturaria.forEach((item: any, i: number) => {
      // Cabeçalho

      doc.addImage(logo, "PNG", 12, 8, 25, 25);
      doc.setFontSize(16);
      doc.text("Programação de Tingimento", pageWidth / 2, cursorY, {
        align: "center",
      });
      doc.setFontSize(10);
      doc.text(`Cliente: ${item.cliente}`, 40, cursorY + 10);
      doc.text(`Tinturaria: ${item.tinturaria}`, 40, cursorY + 15);

      doc.text(
        `Programado em: ${this.clsFormatacao.dataISOtoUser(
          item.dataProgramacao
        )}`,
        40,
        cursorY + 20
      );
      doc.text(
        `Nota Fiscal: ${this.clsFormatacao.notaFiscal(
          item.notaFiscal?.toString() || ""
        )}`,
        150,
        cursorY + 10
      );
      doc.text(
        `Romaneio: ${this.clsFormatacao.notaFiscal(
          item.romaneio?.toString() || ""
        )}`,
        150,
        cursorY + 15
      );

      cursorY += 25;

      // 🔹 Exibir msg se existir
      if (item.msg && item.msg.trim() !== "") {
        doc.setFontSize(9);
        doc.setTextColor(200, 0, 0); // vermelho para destaque
        doc.text(`Observação: ${item.msg}`, 40, cursorY);
        doc.setTextColor(0, 0, 0); // volta para preto
        cursorY += 10;
      }

      // 🔹 Agrupar artigos usando a tipagem correta
      const artigosAgrupados: Record<string, PecaProgramacaoTinturaria[]> =
        item.pecas.reduce(
          (
            acc: Record<string, PecaProgramacaoTinturaria[]>,
            peca: PecaProgramacaoTinturaria
          ) => {
            if (!acc[peca.produto]) acc[peca.produto] = [];
            acc[peca.produto].push(peca);
            return acc;
          },
          {}
        );

      Object.entries(artigosAgrupados).forEach(
        ([artigo, pecas]: [string, PecaProgramacaoTinturaria[]]) => {
          const pesoTotalArtigo = pecas.reduce((acc, p) => acc + p.peso, 0);
          const qtdTotalArtigo = pecas.length;
          pesoTotalGeral += pesoTotalArtigo;
          qtdTotalGeral += qtdTotalArtigo;

          // Quebra de página se necessário
          if (cursorY + 40 > pageHeight - 20) addNewPage();

          // Cabeçalho do artigo
          autoTable(doc, {
            head: [
              [
                `Artigo: ${artigo}`,
                `Peso Total: ${pesoTotalArtigo.toFixed(2)} kg`,
                `Qtd: ${qtdTotalArtigo}`,
              ],
            ],
            startY: cursorY,
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: [0, 0, 0],
              fontSize: 9,
            },
          });
          cursorY = (doc as any).lastAutoTable.finalY + 2;

          // Detalhes das peças
          const itemData = pecas.map((p) => [
            p.cor,
            p.peso.toFixed(2) + " kg",
            p.largura.toFixed(2),
            p.gm2.toFixed(2),
            p.qtdPecas,
          ]);

          autoTable(doc, {
            head: [["Cor", "Peso", "Largura", "Gramatura", "Qtd"]],
            body: itemData,
            startY: cursorY,
            bodyStyles: { fontSize: 7 },
          });
          cursorY = (doc as any).lastAutoTable.finalY + 5;
        }
      );

      // Totalização (só no final do relatório)
      if (i === this.tinturaria.length - 1) {
        if (cursorY + 20 > pageHeight - 20) addNewPage();
        autoTable(doc, {
          head: [["Peso Total Geral", "Quantidade Total Geral"]],
          body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
          startY: cursorY + 5,
          bodyStyles: { fontSize: 9, halign: "right" },
          headStyles: {
            fontSize: 9,
            halign: "right",
            fillColor: [255, 255, 255],
          },
        });
      }
    });

    // 🔹 Abrir PDF no navegador
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };

  public renderProgramacaoTinturaria = async (id: number) => {
    await this.clsApi.execute<Array<DadosProgramacaoTinturaria>>({
      url: 'programacaoTinturaria',
      method: 'post',
      id: id,
    }).then((res: Array<DadosProgramacaoTinturaria>) => {

      this.programacaoTinturaria = res
    })

    this.gerarProgramacaoTinturaria()
  }

  public renderTintuaria = async (ids: Array<number>, onSemDados?: () => void) => {

    try {
      const res = await this.clsApi.execute<Array<DadosTinturaria>>({
        url: 'romaneiosTinturaria',
        method: 'post',
        pedidos: ids,
      })

      if (!res || res.length === 0) {

        this.tinturaria = []
        if (onSemDados) onSemDados()
        return

      }

      this.tinturaria = res
      this.gerarTintuaria()

    } catch (error) {
      this.tinturaria = []
    }
  }

  public renderRelacao = async (dt: string, onSemDados?: () => void) => {
    await this.BuscarDados(dt)
    if (this.espumas.length === 0) {
      if (onSemDados) onSemDados()
      return
    }
    this.gerarPdf(dt)
  }

  public renderFicha = async (dt: string, onSemDados?: () => void) => {
    await this.BuscarDados(dt)
    if (this.pedidos.length === 0) {
      if (onSemDados) onSemDados()
      return
    }
    this.gerarFicha()
  }

  public renderEtiqueta = async (ids: Array<number>, onSemDados?: () => void) => {
    await this.BuscarDados(ids)
    if (this.etiquetas.length === 0) {
      if (onSemDados) onSemDados()
      return
    }
    this.gerarEtiqueta()
  }

  public renderRomaneio = async (ids: Array<number>, onSemDados?: () => void) => {
    await this.BuscarDados(ids)
    if (this.etiquetas.length === 0) {
      if (onSemDados) onSemDados()
      return
    }
    this.gerarRomaneio()
  }
}

export default ClsRelatorioProgramacao
