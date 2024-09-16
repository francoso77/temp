import React from 'react';
import { Button } from '@mui/material';
import { jsPDF } from 'jspdf';

const GeneratePDF: React.FC = () => {
  const createPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório Simples', 10, 10);
    doc.save('relatorio.pdf');
  };

  return (
    <Button variant="contained" onClick={createPDF}>
      Gerar PDF
    </Button>
  );
};

export default GeneratePDF;


