import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

// Função para gerar o PDF
const generatePDF = () => {
  const doc = new jsPDF();

  // Configuração da tabela da coluna 1
  const options1: UserOptions = {
    startY: 10, // posição vertical
    margin: { left: 10 }, // margem esquerda para a primeira tabela (coluna 1)
    head: [['Pedido', 'Cliente']],
    body: [
      ['1001', 'Cliente A'],
      ['1002', 'Cliente B'],
    ],
    theme: 'grid',
  };

  autoTable(doc, options1);

  // Configuração da tabela da coluna 2
  const options2: UserOptions = {
    startY: 10, // mesma altura da tabela anterior
    margin: { left: 110 }, // margem esquerda para posicionar a segunda tabela (coluna 2)
    head: [['Data', 'Total']],
    body: [
      ['01/10/2024', 'R$ 100'],
      ['02/10/2024', 'R$ 150'],
    ],
    theme: 'grid'
  };

  autoTable(doc, options2);

  doc.save('tabelas-lado-a-lado.pdf');
};

generatePDF();
