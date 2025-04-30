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

type PecaProgramacaoTnturaria = {
  produto: string;
  cor: string;
  peso: number;
  largura: number;
  gm2: number;
  qtdPecas: number;
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
  notaFiscal: string;
  msg: string;
  romaneio: number;
  cliente: string;
  tinturaria: string;
  pecas: Array<PecaProgramacaoTnturaria>;
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

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const marginTop = 15;
    let cursorY = marginTop;
    let pesoTotalGeral = 0;
    let qtdTotalGeral = 0;
    let pageNumber = 1;

    this.tinturaria.forEach((item: DadosTinturaria, i: number) => {


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


      // Agrupamento por Artigo
      const artigosAgrupados = item.pecas.reduce((acc, peca) => {
        if (!acc[peca.artigo]) acc[peca.artigo] = [];
        acc[peca.artigo].push(peca);
        return acc;
      }, {} as Record<string, Peca[]>);

      Object.entries(artigosAgrupados).forEach(([artigo, pecas], index) => {
        const pesoTotalArtigo = pecas.reduce((acc, peca) => acc + peca.peso, 0);
        const qtdTotalArtigo = pecas.length;
        pesoTotalGeral += pesoTotalArtigo;
        qtdTotalGeral += qtdTotalArtigo;

        // Cálculo de espaço necessário para o artigo atual
        const artigoHeight = 30 + pecas.length * 10 + pecas[0].composisao.length * 10;
        if (cursorY + artigoHeight > pageHeight - 20) addNewPage(); // Se não houver espaço, cria nova página

        // Cabeçalho do Artigo e Composição com multiplicação de `qtdFio` pelo `pesoTotalArtigo`
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

        // Composição do Artigo (multiplicando `qtdFio` pelo peso total do artigo)
        const composicaoArtigo = pecas[0].composisao.map((fio) => [
          fio.fio,
          (fio.qtdFio).toFixed(2) + '%',
          (fio.qtdFio * pesoTotalArtigo).toFixed(2), // Multiplicação do `qtdFio` pelo `pesoTotalArtigo`
        ]);
        autoTable(doc, {
          head: [['Fio', 'Qtd%', 'Qtd Total (Fio x Peso do Artigo)']],
          body: composicaoArtigo,
          startY: cursorY,
          bodyStyles: {
            fontSize: 5, // Tamanho da fonte do corpo da tabela
            fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0]
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

        // Agrupamento por Tear
        const tearesAgrupados = pecas.reduce((acc, peca) => {
          if (!acc[peca.tear]) acc[peca.tear] = [];
          acc[peca.tear].push(peca);
          return acc;
        }, {} as Record<string, Peca[]>);

        Object.entries(tearesAgrupados).forEach(([tear, itensTear]) => {
          // const pesoTotalTear = itensTear.reduce((acc, peca) => acc + peca.peso, 0);
          // const qtdTotalTear = itensTear.length;

          // Cabeçalho do Tear
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
            //headStyles: { fillColor: [52, 152, 219], textColor: [255, 255, 255] },
          });

          cursorY = (doc as any).lastAutoTable.finalY + 0.5;

          // Detalhes das Peças
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

        //if (cursorY + artigoHeight > pageHeight - 20) addNewPage(); // Avança para nova página caso necessário

      });

      // Totalização Geral
      if (cursorY + 10 <= pageHeight - 20) { // Verifica se há espaço na página atual

        autoTable(doc, {
          head: [['Peso Total Geral', 'Quantidade Total Geral']],
          body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
          startY: cursorY + 5,
          bodyStyles: { fontSize: 8, halign: 'right' },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', fontStyle: 'italic' },
        });
      } else {
        addNewPage(); // Adiciona nova página se não houver espaço
        autoTable(doc, {
          head: [['Peso Total Geral', 'Quantidade Total Geral']],
          body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
          startY: cursorY + 5,
          bodyStyles: { fontSize: 8, halign: 'right' },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', fontStyle: 'italic' },
        });
      }

      if (this.tinturaria.length - 1 === 0) {

        doc.save('Romaneio_Malharia-Romaneio-' + item.romaneio + '.pdf');

      } else {
        addNewPage();
        if (this.tinturaria.length - 1 === i) {
          doc.save('Romaneio_Malharia-Geral.pdf');

        }
      }
    })
  }

  private gerarProgramacaoTintuaria = async () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const marginTop = 15;
    let cursorY = marginTop;
    let pageNumber = 1;

    // Carrega imagem do logotipo
    const response = await fetch('/img/logomarca.png');
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
      const logoBase64 = reader.result as string;

      this.programacaoTinturaria.forEach((item: DadosProgramacaoTinturaria, i: number) => {
        let pesoTotalGeral = 0;
        let qtdTotalGeral = 0;

        const calcularTotais = () => {
          item.pecas.forEach(peca => {
            pesoTotalGeral += Number(peca.peso) || 0;
            qtdTotalGeral += Number(peca.qtdPecas) || 0;
          });
        };

        calcularTotais();

        const addHeader = () => {
          // Logomarca no canto superior esquerdo
          doc.addImage(logoBase64, 'PNG', 10, cursorY, 25, 25);

          // Título ao lado da imagem, centralizado
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(20);
          doc.text("Programação de Tingimento", pageWidth / 2 + 10, cursorY + 15, { align: 'center' });

          // Informações adicionais abaixo do título
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.text('Cliente: ' + item.cliente, 10, cursorY + 32);
          doc.text('Tinturaria: ' + item.tinturaria, 10, cursorY + 38);
          doc.text('Romaneio: ' + this.clsFormatacao.notaFiscal(item.romaneio.toString()), 150, cursorY + 38);
          doc.text('Emissão: ' + this.clsFormatacao.dataISOtoUser(item.dataProgramacao), 10, cursorY + 44);
          doc.text('Nota Fiscal: ' + item.notaFiscal, 150, cursorY + 44);
          doc.setDrawColor(0); // Cor preta
          doc.setLineWidth(0.3);
          doc.line(10, cursorY, pageWidth - 10, cursorY);
          doc.setFontSize(13);
          doc.setFont('helvetica', 'italic');
          doc.text(`Observações: ${item.msg}`, 10, cursorY + 56);

          cursorY += 65;
        };

        const addFooter = () => {
          const dataAtual = new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          doc.setFontSize(8);
          doc.text(dataAtual, 10, pageHeight - 10);
          doc.text(`Página ${pageNumber}`, pageWidth - 30, pageHeight - 10);
        };

        const addNewPage = () => {
          doc.addPage();
          pageNumber += 1;
          cursorY = marginTop;
          addHeader();
          addFooter();
        };

        addHeader();

        autoTable(doc, {
          head: [['Peça', 'Peso', 'Cor', 'GM2', 'Largura', 'Qtd Peças']],
          body: item.pecas.map(peca => [
            peca.produto || '',
            this.clsFormatacao.currency(peca.peso) || '',
            peca.cor || '',
            (peca.gm2 * 100).toFixed(0) || '',
            peca.largura || '',
            peca.qtdPecas || ''
          ]),
          startY: cursorY,
          theme: 'plain',
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9,
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          styles: {
            lineWidth: 0,
          },
          didDrawCell: (data) => {
            if (data.section === 'head') {
              const { cell, doc } = data;
              doc.setDrawColor(0);
              doc.setLineWidth(0.3);
              doc.rect(cell.x, cell.y, cell.width, cell.height);
            }
          }
        });

        const autoTableY = (doc as any).lastAutoTable?.finalY || cursorY;
        cursorY = autoTableY + 5;

        addFooter();

        if (cursorY + 10 <= pageHeight - 20) {
          autoTable(doc, {
            head: [['Peso Total', 'Total Peças']],
            body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
            startY: cursorY,
            bodyStyles: { fontSize: 8, halign: 'right' },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', fontStyle: 'italic' },
          });
        } else {
          addNewPage();
          autoTable(doc, {
            head: [['Peso Total Geral', 'Quantidade Total Geral']],
            body: [[`${pesoTotalGeral.toFixed(2)} kg`, `${qtdTotalGeral}`]],
            startY: cursorY,
            bodyStyles: { fontSize: 8, halign: 'right' },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', fontStyle: 'italic' },
          });

          cursorY += 12;
        }

        if (this.programacaoTinturaria.length - 1 === i) {
          doc.save('Programacao-Tinturaria.pdf');
        } else {
          addNewPage();
        }
      });
    };

    reader.readAsDataURL(blob); // inicia leitura da imagem
  };

  public renderProgramacaoTinturaria = async (id: number) => {
    await this.clsApi.execute<Array<DadosProgramacaoTinturaria>>({
      url: 'programacaoTinturaria',
      method: 'post',
      id: id,
    }).then((res: Array<DadosProgramacaoTinturaria>) => {
      this.programacaoTinturaria = res
    })
    this.gerarProgramacaoTintuaria()
  }

  public renderTintuaria = async (ids: Array<number>) => {
    await this.clsApi.execute<Array<DadosTinturaria>>({
      url: 'romaneiosTinturaria',
      method: 'post',
      pedidos: ids,
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
