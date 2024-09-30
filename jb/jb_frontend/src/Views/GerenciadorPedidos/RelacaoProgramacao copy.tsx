import React, { useContext, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box } from '@mui/material';
import ClsApi from "../../Utils/ClsApi";
import ClsFormatacao from "../../Utils/ClsFormatacao";
import { PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import './printStyles.css';

interface Dados {
  idProduto: number;
  qtdTotalEspuma: number;
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
}

interface PaginaDataTableCabecalhoInterface {
  campo: string;
  cabecalho: string;
  alinhamento?: 'left' | 'right' | 'center';
  largura?: number;
  format?: (arg: any, row: any) => string | number | undefined;
}

export default function RelacaoProgramcao() {
  const clsApi = new ClsApi();
  const clsFormatacao = new ClsFormatacao();

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [dadosFilter, setDadosFilter] = React.useState<DadosFilter[]>([]);
  const [itensFiltrados, setItensFiltrados] = React.useState<DadosFilter[]>([]);
  const [dados, setDados] = React.useState<Dados[]>([]);

  const cabecalhoTabela: PaginaDataTableCabecalhoInterface[] = [
    {
      cabecalho: 'Metros',
      alinhamento: 'left',
      campo: 'qtdTotalEspuma',
      format: (qtd) => clsFormatacao.currency(qtd),
      largura: 100,
    },
    {
      cabecalho: 'Espuma',
      alinhamento: 'left',
      campo: 'materiaPrima',
      largura: 100,
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'cor',
      largura: 100,
    },
  ];

  const cabecalhoTabelaDetalhes: PaginaDataTableCabecalhoInterface[] = [
    {
      cabecalho: 'Metros',
      alinhamento: 'right',
      campo: 'metros',
      format: (qtd) => clsFormatacao.currency(qtd),
    },
    {
      cabecalho: 'Tecido',
      alinhamento: 'center',
      campo: 'produto',
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'center',
      campo: 'cor',
    },
  ];

  const BuscarDados = () => {
    const campo = 'nome';
    const itemPesquisa = '2024-09-25';

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosEspumasProgramadas',
      method: 'post',
      itemPesquisa,
      campo,
      mensagem: 'Pesquisando espumas ...',
      setMensagemState,
    }).then((rs: any) => {
      // console.log('dados espuma', rs);
      setDados(rs);
    });

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosTecidosProgramadas',
      method: 'post',
      itemPesquisa,
      campo,
      mensagem: 'Pesquisando tecidos ...',
      setMensagemState,
    }).then((rs: any) => {
      setDadosFilter(rs);
      // console.log('dados tecidos', rs);
      // const detalhesFiltrados = dadosFilter.filter(filtro => filtro.idProduto === rs.idProduto && filtro.cor === rs.cor);
      // const itensFiltrados = dadosFilter.filter(item =>
      //   detalhesFiltrados.some(detalhe => detalhe.idPedido === item.idPedido) && item.tipoProduto === 10
      // );
      // setItensFiltrados(itensFiltrados);
    });
  };

  useEffect(() => {
    BuscarDados();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const renderTableRows = (rows: any[], cabecalho: PaginaDataTableCabecalhoInterface[], isDetalhe = false) => {
    return rows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <TableRow>
          {cabecalho.map((coluna, colIndex) => (
            <TableCell key={colIndex} align={coluna.alinhamento || 'left'}>
              {coluna.format ? coluna.format(row[coluna.campo], row) : row[coluna.campo]}
            </TableCell>
          ))}
        </TableRow>
        {isDetalhe && renderTableDetalhes(row)}
      </React.Fragment>
    ));
  };

  const renderTableDetalhes = (row: Dados) => {

    console.log('dadosFilter', dadosFilter);
    // Filtra os detalhes com base no idProduto
    const detalhesFiltrados = dadosFilter.filter(filtro => filtro.idProduto === row.idProduto && filtro.cor === row.cor);

    console.log('detalhesFiltrados', detalhesFiltrados);
    // Filtra itens que correspondem ao idPedido e ao idProduto
    const itensFiltrados = dadosFilter.filter(item =>
      detalhesFiltrados.some(detalhe => detalhe.idPedido === item.idPedido) && item.tipoProduto === 10
    );

    console.log('itensFiltrados', itensFiltrados);
    if (itensFiltrados.length === 0) {
      return null; // Não renderiza nada se não houver detalhes correspondentes
    }

    return (
      <>
        {itensFiltrados.map((item, index) => (
          <Box key={index}>
            <Typography sx={{ mt: 2 }}>
              {'________'} {clsFormatacao.currency(item.metros)} {item.produto} {item.cor}
            </Typography>
          </Box>
        ))}
      </>
      //   <TableContainer>
      //     <Table>
      //       <TableHead>
      //         <TableRow>
      //           {cabecalhoTabelaDetalhes.map((coluna, colIndex) => (
      //             <TableCell
      //               key={colIndex}
      //               align={coluna.alinhamento || 'left'}
      //               style={{ minWidth: coluna.largura }}
      //             >
      //               {coluna.cabecalho}
      //             </TableCell>
      //           ))}
      //         </TableRow>
      //       </TableHead>
      //       <TableBody>
      //         {renderTableRows(itensFiltrados, cabecalhoTabelaDetalhes)}
      //       </TableBody>
      //     </Table>
      //   </TableContainer>
    );
  };

  return (
    <div className="print-container">
      <h1>Programação de dublagem</h1>
      <Button variant="contained" color="primary" onClick={handlePrint}>
        Imprimir
      </Button>
      {/* <TableContainer component={Paper} className="print-table-container">
        <Table>
          <TableHead>
            <TableRow>
              {cabecalhoTabela.map((coluna, colIndex) => (
                <TableCell
                  key={colIndex}
                  align={coluna.alinhamento || 'left'}
                  style={{
                    minWidth: coluna.largura,
                    width: coluna.largura,
                    maxWidth: coluna.largura,
                  }}                >
                  {coluna.cabecalho}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows(dados, cabecalhoTabela, true)}</TableBody>
        </Table>
      </TableContainer> */}
      {dados.map((espuma, espumaIndex) => (
        <>
          <Paper key={espumaIndex} sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mb: 3, p: 2 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography>
                {clsFormatacao.currency(espuma.qtdTotalEspuma)} metros
              </Typography>
            </Box>
            <Box >
              <Typography > {espuma.materiaPrima} - {espuma.cor}</Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 2 }}>
            {renderTableDetalhes(espuma)}
          </Paper>
        </>
      ))}
    </div>
  );
}
