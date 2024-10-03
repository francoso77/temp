import React from 'react';
import ClsApi from "./ClsApi";
import ClsFormatacao from "./ClsFormatacao";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ClsCrud from './ClsCrudApi';

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
  public pedidos: any[] = [];
  public clsFormatacao = new ClsFormatacao();
  public clsApi = new ClsApi();
  public clsCrud = new ClsCrud();

  private BuscarDados = async (dt: string) => {
    const campo = 'nome';
    const itemPesquisa = dt;

    try {

      const pedidos = await this.clsCrud.pesquisar({
        entidade: 'ProgramacaoDublagem',
        relations: [
          'detalheProgramacaoDublagens',
          'detalheProgramacaoDublagens.pedido',
          'detalheProgramacaoDublagens.pedido.detalhePedidos',
        ],
        criterio: {
          dataProgramacao: itemPesquisa,
        },
      });

      const forros = await this.clsApi.execute<Array<Dados>>({
        url: 'pedidosEspumasEForrosProgramadas',
        method: 'post',
        itemPesquisa,
        campo,
        tipo: 'Forro',
      });

      const espumas = await this.clsApi.execute<Array<Dados>>({
        url: 'pedidosEspumasEForrosProgramadas',
        method: 'post',
        itemPesquisa,
        campo,
        tipo: 'Espuma',
      });

      const tecidos = await this.clsApi.execute<Array<DadosFilter>>({
        url: 'pedidosTecidosProgramadas',
        method: 'post',
        itemPesquisa,
        campo,
      });

      this.forros = forros;
      this.espumas = espumas;
      this.tecidos = tecidos;
      this.pedidos = pedidos;
      console.log('Pedidos...: ', pedidos)
    } catch (error) {
      console.error(error);
    }
  };

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

  private gerarPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const title = 'Programação de Dublagem' + ' - Data: ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString());

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
      });
    });

    doc.save('programacao_dublagem - ' + this.clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
  };

  public render = async (dt: string) => {
    await this.BuscarDados(dt); // Aguarda a busca dos dados antes de gerar o PDF
    this.gerarPdf();
  };
}

export default ClsRelatorioProgramacao;
