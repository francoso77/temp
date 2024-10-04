import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Função para gerar o PDF com 4 tabelas por página
export const gerarPDFComTabelasMultiples = () => {
  const doc = new jsPDF();

  // Função para gerar uma única tabela com base na posição Y
  const gerarTabela = (startY: number) => {
    // Cabeçalho geral (Pedido, Cliente, Produto)
    doc.setFontSize(12);
    doc.text('Produção Dublados', 14, startY - 5);

    // Informações do pedido e produto
    const pedidoInfo = [
      ['Pedido', 'Cliente', '', ''],
      ['1', 'Nova Serrana Couros', '', ''],
      ['Produto', 'Nylon Rodeio Pto D40/3', '', ''],
      ['QtdPedida', '1000', '', '']
    ];

    // Tabela de pedido
    autoTable(doc, {
      body: pedidoInfo,
      startY: startY,
      theme: 'plain',
      styles: { halign: 'left', fontSize: 10 },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 25 },
        3: { cellWidth: 50 }
      },
    });

    // Dados da tabela principal (60 linhas, 4 colunas numeradas)
    const numeros = Array.from({ length: 20 }, (_, i) => [
      (i + 1).toString(), '', (i + 21).toString(), '', (i + 41).toString(), ''
    ]);

    // Tabela de números e MTS
    autoTable(doc, {
      head: [['Nº', 'MTS', 'Nº', 'MTS', 'Nº', 'MTS']],
      body: numeros,
      startY: (doc as any).lastAutoTable.finalY + 5,  // Inicia após a tabela anterior
      theme: 'grid',
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 15 },
        2: { cellWidth: 10 },
        3: { cellWidth: 15 },
        4: { cellWidth: 10 },
        5: { cellWidth: 15 }
      },
    });
  };

  const tabelaAltura = 50; // Altura estimada de cada bloco de tabela
  gerarTabela(20);  // Primeira tabela começa a partir de Y=20

  // Salva o PDF gerado
  doc.save('tabelas_por_pagina.pdf');
};

// Chamada da função para gerar o PDF
gerarPDFComTabelasMultiples();
