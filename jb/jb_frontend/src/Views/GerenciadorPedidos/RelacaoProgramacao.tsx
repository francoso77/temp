import React, { useContext, useEffect } from 'react';
import { Button, Typography, Box, Grid } from '@mui/material';
import ClsApi from "../../Utils/ClsApi";
import ClsFormatacao from "../../Utils/ClsFormatacao";
import { PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importa corretamente o autoTable
import './printStyles.css';

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

export default function RelacaoProgramcao() {
  const clsApi = new ClsApi();
  const clsFormatacao = new ClsFormatacao();

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [tecidos, setTecidos] = React.useState<DadosFilter[]>([]);
  const [forros, setForros] = React.useState<Dados[]>([]);
  const [espumas, setEspumas] = React.useState<Dados[]>([]);

  const BuscarDados = () => {
    const campo = 'nome';
    const itemPesquisa = '2024-09-25';

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosEspumasEForrosProgramadas',
      method: 'post',
      itemPesquisa,
      campo,
      tipo: 'Forro',
      mensagem: 'Pesquisando forros ...',
      setMensagemState,
    }).then((rs: any) => {
      setForros(rs);
    });

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosEspumasEForrosProgramadas',
      method: 'post',
      itemPesquisa,
      campo,
      tipo: 'Espuma',
      mensagem: 'Pesquisando espumas ...',
      setMensagemState,
    }).then((rs: any) => {
      setEspumas(rs);
    });

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosTecidosProgramadas',
      method: 'post',
      itemPesquisa,
      campo,
      mensagem: 'Pesquisando tecidos ...',
      setMensagemState,
    }).then((rs: any) => {
      setTecidos(rs);
    });
  };

  useEffect(() => {
    BuscarDados();
  }, []);

  const renderDetalhes = (row: Dados): Array<{ metros: string; produto: string; cor: string, pedido: number, cliente: string }> => {
    const detalhesFiltrados = tecidos.filter(tecido => tecido.idProduto === row.idProduto && tecido.cor === row.cor);
    const itensFiltrados = tecidos.filter(item =>
      detalhesFiltrados.some(detalhe => detalhe.idPedido === item.idPedido) && item.tipoProduto === 10
    );

    if (itensFiltrados.length === 0) {
      return []; // Retorna array vazio se não houver itens
    }

    return itensFiltrados.map(item => ({
      metros: clsFormatacao.currency(item.metros),
      produto: item.produto,
      cor: item.cor,
      pedido: item.idPedido,
      cliente: item.cliente
    }));
  };

  const gerarPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const title = 'Programação de Dublagem' + ' - Data: ' + clsFormatacao.dataISOtoUser(new Date().toISOString())

    doc.setFontSize(15);
    doc.text(title, 10, 10);

    let startY = 20; // Início da primeira linha do conteúdo

    espumas.forEach((espuma, _index) => {

      forros.forEach((forro, _index) => {
        if (forro.qtdTotal !== espuma.qtdTotal) {
          doc.setFontSize(13);
          doc.text(`${clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor}`, 20, startY);

        } else {
          doc.text(`${clsFormatacao.currency(espuma.qtdTotal)} metros - ${espuma.materiaPrima} - ${espuma.cor} com ${forro.materiaPrima} - ${forro.cor}`, 20, startY);

        }

        const detalhes = renderDetalhes(espuma);

        if (detalhes.length > 0) {
          autoTable(doc, {
            startY: startY + 10, // Ajusta para iniciar a tabela logo após o texto
            head: [['Metros', 'Produto', 'Cor', 'Pedido', 'Cliente']],
            body: detalhes.map(item => [item.metros, item.produto, item.cor, item.pedido, item.cliente]),
            headStyles: {
              fillColor: [220, 220, 220], // Cor de fundo (cinza claro)
              textColor: [0, 0, 0], // Cor do texto (branco)
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
              // fillColor: [255, 255, 255], // Cor de fundo das células do corpo (branco)
              // textColor: [0, 0, 0], // Cor do texto (preto)
              // lineColor: [255, 255, 255], // Cor das linhas (branco)
              fontSize: 9, // Tamanho da fonte do corpo da tabela
            },
            styles: {
              // lineColor: [255, 255, 255], // Cor das bordas das células (branco)
              // lineWidth: 0.5, // Espessura da linha
              lineColor: [0, 0, 0], // Cor das linhas (branco)
              fillColor: [255, 255, 255], // Cor de fundo das celulas (branco)
            },
          });

          // Atualiza o startY para a próxima iteração, considerando onde a tabela terminou
          startY = (doc as any).lastAutoTable.finalY + 10;
        } else {
          // Caso não tenha tabela, apenas aumenta o espaçamento entre os blocos
          startY += 30;
        }
      })
    });

    doc.save('programacao_dublagem - ' + clsFormatacao.dataISOtoUser(new Date().toISOString()) + '.pdf');
  };


  return (
    <div>
      {/* Elementos que não devem ser impressos */}
      <div className="no-print">
        <Button variant="contained" color="primary" onClick={gerarPDF}>
          Gerar PDF
        </Button>
      </div>
      {/* Elementos que devem ser impressos */}
      <div className="print-container">
        <h1>Programação de dublagem</h1>

        {espumas.map((espuma, espumaIndex) => (
          <React.Fragment key={espumaIndex}>
            <Grid container spacing={2} sx={{ mt: 1, ml: 2 }}>
              <Grid item sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {clsFormatacao.currency(espuma.qtdTotal)} metros
                </Typography>
              </Grid>
              <Grid item sx={{ textAlign: 'left' }} >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {espuma.materiaPrima} - {espuma.cor}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ p: 2, border: '1px solid #ccc' }}>
              {/* Renderização dos detalhes */}
              {renderDetalhes(espuma).map((detalhe, detalheIndex) => (
                <Typography key={detalheIndex} sx={{ mt: 2, ml: 5 }}>
                  {detalhe.metros} -- {detalhe.produto} {detalhe.cor} {detalhe.pedido} {detalhe.cliente}
                </Typography>
              ))}
            </Box>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
