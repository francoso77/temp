import { Box, Dialog, Grid, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ShowText from '../../Componentes/ShowText';
import ComboBox from '../../Componentes/ComboBox';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { DetalheEntradaInterface, EntradaInterface } from '../../../../jb_backend/src/interfaces/entradaInterface';
import styled from 'styled-components';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';
import InputCalc from '../../Componentes/InputCalc';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { EstoqueInterface } from '../../../../jb_backend/src/interfaces/estoqueInterface';
import Entrada from './Entrada';


const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '95%', // Ajuste esta porcentagem conforme necessário
    height: '80vh', // Ajuste esta altura conforme necessário
    maxWidth: 'none',
    maxHeight: 'none',
  },
}));

interface PropsInterface {
  rsEntrada: EntradaInterface
}

interface rsSomatorioInterface {
  totalEntrada: number
  totalQtd: number
}
export default function DetalheEntrada({ rsEntrada }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const SomatorioDados: rsSomatorioInterface = {
    totalEntrada: 0,
    totalQtd: 0
  }
  const ResetDados: DetalheEntradaInterface = {
    idEntrada: rsEntrada.idEntrada as number,
    idProduto: 0,
    qtd: 0,
    vrUnitario: 0,
    idCor: null,
    qtdPecas: 0,
    metro: 0,
    gm2: 0,
    idPessoa_revisador: null,
    idTinturaria: null,
    perdaMalharia: 0,
    perdaTinturaria: 0
  }

  const MovimentaEstoque: EstoqueInterface = {
    idProduto: 0,
    idPessoa_fornecedor: 0,
    idCor: null,
    qtd: 0
  }
  interface PesquisaInterface {
    nome: string
  }

  const [open, setOpen] = useState(true);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalheEntradaInterface>>([])
  const [nomeFornecedor, setNomeFornecedor] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [tipo, setTipo] = useState<TipoProdutoType>()
  const [detalheEntrada, setDetalheEntrada] = useState<DetalheEntradaInterface>(ResetDados)
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const [rsRevisador, setRsRevisador] = useState<Array<PessoaInterface>>([])
  const [rsTinturaria, setRsTinturaria] = useState<Array<any>>([])
  const [rsSomatorio, setRsSomatorio] = useState<rsSomatorioInterface>(SomatorioDados)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'nomeProduto'
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'nomeCor'
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'right',
      campo: 'qtd',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Vr Unitário',
      alinhamento: 'right',
      campo: 'vr',
      format: (vr) => clsFormatacao.currency(vr)
    },
    {
      cabecalho: 'Total Item',
      alinhamento: 'right',
      campo: 'vrTotal',
      format: (vrTotal) => clsFormatacao.currency(vrTotal)
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const pesquisarID = (id: string | number): Promise<DetalheEntradaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "DetalheEntrada",
        criterio: {
          idDetalheEntrada: id,
        },
      })
      .then((rs: Array<DetalheEntradaInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      console.log('entrou aqui')
      const query = `
      UPDATE estoques  
      SET qtd = (qtd - ${detalheEntrada.qtd})
      WHERE 
        idProduto = ${detalheEntrada.idProduto} AND 
        idCor = ${detalheEntrada.idCor};
      `;

      clsCrud
        .query({
          entidade: "Estoque",
          sql: query,
        })
        .then((rs: Array<any>) => {
          if (rs.length > 0) {
            setMensagemState({
              titulo: 'Erro...',
              exibir: true,
              mensagem: 'Deu Certo!',
              tipo: MensagemTipo.Error,
              exibirBotao: true,
              cb: null
            })
          }
        })

      setDetalheEntrada(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalheEntrada(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setDetalheEntrada(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setDetalheEntrada(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }

  const pegaTipo = () => {
    let auxTipo: number | undefined = rsProduto.
      find(produto => produto.idProduto === detalheEntrada.idProduto)?.tipoProduto;
    setTipo(auxTipo)
  }
  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheEntrada, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('qtd', detalheEntrada, erros, retorno, 'Quantudade maior que 0')
    retorno = validaCampo.naoVazio('vrUnitario', detalheEntrada, erros, retorno, 'Valor maior que 0')
    if (tipo === 10) {
      retorno = validaCampo.naoVazio('idCor', detalheEntrada, erros, retorno, 'Defina uma cor')
      retorno = validaCampo.naoVazio('qtdPecas', detalheEntrada, erros, retorno, 'Informe a quantidade peças')
      retorno = validaCampo.naoVazio('metro', detalheEntrada, erros, retorno, 'Qual a metragem')
      retorno = validaCampo.naoVazio('gm2', detalheEntrada, erros, retorno, 'Qual a gramatura')
      retorno = validaCampo.naoVazio('idPessoa_revisador', detalheEntrada, erros, retorno, 'Defina um revisador')
      retorno = validaCampo.naoVazio('idTinturaria', detalheEntrada, erros, retorno, 'Defina uma tinturaria')
      retorno = validaCampo.naoVazio('perdaMalharia', detalheEntrada, erros, retorno, 'Qtd perdida em malharia')
      retorno = validaCampo.naoVazio('perdaTinturaria', detalheEntrada, erros, retorno, 'Qtd perdida em tinturaria')

    }
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    const query = `
    SELECT 
    de.*
    FROM 
    detalheentradas de
    WHERE 
    de.idProduto = ${detalheEntrada.idProduto} AND 
    de.idCor = ${detalheEntrada.idCor};
    `;

    clsCrud
      .query({
        entidade: "DetalheEntrada",
        sql: query,
        setMensagemState: setMensagemState,
      })
      .then((rs: Array<any>) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Produto já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else if (validarDados()) {

          if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
            clsCrud.incluir({
              entidade: "DetalheEntrada",
              criterio: detalheEntrada,
              localState: localState,
              cb: () => btPesquisar(),
              setMensagemState: setMensagemState
            })
              .then((rs) => {
                if (rs.ok) {
                  MovimentaEstoque.idProduto = detalheEntrada.idProduto
                  MovimentaEstoque.idCor = detalheEntrada.idCor ? detalheEntrada.idCor : null
                  MovimentaEstoque.idPessoa_fornecedor = rsEntrada.idPessoa_fornecedor
                  MovimentaEstoque.qtd = detalheEntrada.qtd
                  clsCrud.incluir({
                    entidade: "Estoque",
                    criterio: MovimentaEstoque,
                  })
                  setLocalState({ action: actionTypes.pesquisando })
                } else {
                  setMensagemState({
                    titulo: 'Erro...',
                    exibir: true,
                    mensagem: 'Erro no cadastro - Consulte Suporte',
                    tipo: MensagemTipo.Error,
                    exibirBotao: true,
                    cb: null
                  })
                }
              })
          } else if (localState.action === actionTypes.excluindo) {
            clsCrud.excluir({
              entidade: "DetalheEntrada",
              criterio: {
                idDetalheEntrada: detalheEntrada.idDetalheEntrada
              },
              cb: () => btPesquisar(),
              setMensagemState: setMensagemState
            })
              .then((rs) => {
                if (rs.ok) {
                  setLocalState({ action: actionTypes.pesquisando })
                } else {
                  setMensagemState({
                    titulo: 'Erro...',
                    exibir: true,
                    mensagem: 'Erro no cadastro - Consulte Suporte',
                    tipo: MensagemTipo.Error,
                    exibirBotao: true,
                    cb: null
                  })
                }
              })
          }
        }
      })
  }

  const btPesquisar = () => {
    let query = `
    SELECT 
        de.idDetalheEntrada, 
        de.idEntrada, 
        de.qtd, 
        de.vrUnitario AS vr, 
        de.idProduto, 
        p.nome AS nomeProduto,
        c.nome AS nomeCor,
        FORMAT((de.qtd * de.vrUnitario),2) AS vrTotal
        
    FROM 
        detalheentradas de
    INNER JOIN 
	      entradas e ON e.idEntrada = de.idEntrada
    INNER JOIN
	      produtos p ON p.idProduto = de.idProduto
    LEFT JOIN
        cores c ON c.idCor = de.idCor
    WHERE 
        de.idEntrada = ${detalheEntrada.idEntrada}
    ORDER BY nomeProduto ASC;
    `;

    clsCrud
      .query({
        entidade: "Entrada",
        sql: query,
        msg: 'Pesquisando Entradas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })

    query = `
      SELECT 
      FORMAT(SUM(de.qtd * de.vrUnitario),2,'de_DE') AS totalEntrada,
      FORMAT(SUM(de.qtd),2,'de_DE') AS totalQtd
    FROM 
        detalheentradas de
    INNER JOIN 
        entradas e ON e.idEntrada = de.idEntrada
    WHERE 
        de.idEntrada = ${detalheEntrada.idEntrada};
    `;

    clsCrud
      .query({
        entidade: "DetalheEntrada",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<rsSomatorioInterface>) => {
        setRsSomatorio({
          totalEntrada: rs[0].totalEntrada ? rs[0].totalEntrada : 0,
          totalQtd: rs[0].totalQtd ? rs[0].totalQtd : 0
        })
      })
  }

  // const pesquisarProdutos = (nome: string) => {
  //   clsCrud
  //     .pesquisar({
  //       entidade: "Produto",
  //       criterio: {
  //         nome: "%".concat(nome, "%"),
  //       },
  //       camposLike: ["nome"],
  //       select: ["idProduto", "nome"],
  //       msg: "Pesquisando produtos",
  //       setMensagemState: setMensagemState,
  //     })
  //     .then((rsProdutos: Array<ProdutoInterface>) => {
  //       setRsProduto(rsProdutos)
  //     })
  // }
  const BuscarDados = () => {

    let query: string = `
    SELECT 
        e.*,
        pe.nome AS nomeFornecedor
    FROM 
        entradas e
    INNER JOIN 
        pessoas pe ON pe.idPessoa = e.idPessoa_fornecedor
    WHERE 
        e.idEntrada = ${rsEntrada.idEntrada};
    `;

    clsCrud
      .query({
        entidade: "Entrada",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setNomeFornecedor({ nome: rs[0].nomeFornecedor })
      })

    query = `
    SELECT p.idProduto, p.nome, p.tipoProduto 
    FROM produtos p
    ORDER BY p.nome ASC;
    `;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    query = `SELECT c.* FROM cores c ORDER BY c.nome ASC;`;
    clsCrud
      .query({
        entidade: "Cor",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })

    query = `SELECT idTinturaria FROM tinturarias ORDER BY idTinturaria ASC;`;
    clsCrud
      .query({
        entidade: "Tinturaria",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsTinturarias: Array<any>) => {
        setRsTinturaria(rsTinturarias)
      })

    query = `
        SELECT 
            p.idPessoa, p.nome, p.tipoPessoa
        FROM 
            pessoas p
        WHERE 
            p.tipoPessoa = 'R'
        ORDER BY p.nome ASC;
        `;
    clsCrud
      .query({
        entidade: "Pessoa",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsRevisadores: Array<PessoaInterface>) => {
        setRsRevisador(rsRevisadores)
      })
  }

  const irpara = useNavigate()
  const btFechar = () => {
    setOpen(false);
    irpara('/Entrada')
    setLocalState({ action: actionTypes.pesquisando })

    setLayoutState({
      titulo: 'Entradas',
      tituloAnterior: 'Itens da Entrada',
      pathTitulo: '/Entrada',
      pathTituloAnterior: '/DetalheEntrada'
    })
  }

  useEffect(() => {
    fieldRefs.current = fieldRefs.current.slice(0, 11)
    btPesquisar()
    BuscarDados()
    setLayoutState({
      titulo: 'Itens da Entrada',
      tituloAnterior: 'Entradas',
      pathTitulo: '/DetalheEntrada',
      pathTituloAnterior: '/Entrada'
    })
  }, [])

  return (
    <>
      <CustomDialog open={open} >
        <Paper variant="outlined" sx={{ display: 'flex', m: 1, padding: 1 }}>
          <Grid container >
            <Grid item xs={10}>
              <ShowText
                titulo="Fornecedor"
                descricao={nomeFornecedor.nome} />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} >
              <ShowText
                titulo="Nota Fiscal"
                descricao={rsEntrada.notaFiscal} />
            </Grid>
            <Grid item xs={6} >
              <ShowText
                titulo="Emissão"
                descricao={clsFormatacao.dataFormatada(rsEntrada.dataEmissao)} />
            </Grid>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action === 'pesquisando'}>
          <Paper sx={{ m: 1, padding: 1.5 }}>
            <Grid item xs={12} sx={{ mb: 2, textAlign: 'center' }}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 1, ml: { xs: 1, md: 0.5 } }}
                  onClick={() => btIncluir()}
                >
                  <AddCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <DataTable
                temTotal={false}
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: DetalheEntradaInterface) =>
                      onEditar(rs.idDetalheEntrada as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: DetalheEntradaInterface) =>
                      onExcluir(rs.idDetalheEntrada as number),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Paper>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} justifyContent='flex-end' sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Qtd Total"
                  dados={rsSomatorio}
                  field="totalQtd"
                  setState={setDetalheEntrada}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  label="Total Entrada"
                  dados={rsSomatorio}
                  field="totalEntrada"
                  setState={setDetalheEntrada}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </Paper>
        </Condicional>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={4} sx={{ mt: 2 }} >
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={detalheEntrada}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalheEntrada}
                    onSelect={pegaTipo}
                    // onClickPesquisa={(rs) => pesquisarProdutos(rs)}
                    onKeyDown={
                      tipo === 10 ? (event) => btPulaCampo(event, 1)
                        : (event) => btPulaCampo(event, 2)
                    }
                    autoFocus
                  />
                </Box>
              </Grid>
              <Condicional condicao={[2, 3, 6, 10, 11].includes(tipo as number)}>
                <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <ComboBox
                      opcoes={rsCor}
                      campoDescricao="nome"
                      campoID="idCor"
                      dados={detalheEntrada}
                      mensagemPadraoCampoEmBranco="Qual cor"
                      field="idCor"
                      label="Cores"
                      erros={erros}
                      setState={setDetalheEntrada}
                      onSelect={pegaTipo}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event) => btPulaCampo(event, 2)}
                    />
                  </Box>
                </Grid>
              </Condicional>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Qtd"
                    dados={detalheEntrada}
                    field="qtd"
                    setState={setDetalheEntrada}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 3)}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                  <InputText
                    tipo='currency'
                    scale={4}
                    label="Vr Unitário"
                    dados={detalheEntrada}
                    field="vrUnitario"
                    setState={setDetalheEntrada}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={
                      tipo === 10 ? (event: any) => btPulaCampo(event, 4)
                        : (event: any) => btPulaCampo(event, 0)
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>

                <InputCalc
                  label='Total Item'
                  tipo='currency'
                  scale={4}
                  disabled={false}
                  value={(detalheEntrada.qtd * detalheEntrada.vrUnitario).toString()}

                />
              </Grid>
              <Condicional condicao={tipo === 10}>
                <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                  <Typography>
                    Detalhes de Tinturaria
                  </Typography>

                </Grid>
                <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
                  <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                        <InputText
                          tipo='number'
                          scale={0}
                          label="Qtd Peças"
                          dados={detalheEntrada}
                          field="qtdPecas"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 5)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Metros"
                          dados={detalheEntrada}
                          field="metro"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 6)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Gm²"
                          dados={detalheEntrada}
                          field="gm2"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 7)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Perda Malharia"
                          dados={detalheEntrada}
                          field="perdaMalharia"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 8)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                      <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
                        <InputText
                          tipo='currency'
                          scale={4}
                          label="Perda Tinturaria"
                          dados={detalheEntrada}
                          field="perdaTinturaria"
                          setState={setDetalheEntrada}
                          disabled={localState.action === 'excluindo' ? true : false}
                          erros={erros}
                          onFocus={(e) => e.target.select()}
                          onKeyDown={(event: any) => btPulaCampo(event, 9)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[9] = el)}>
                        <ComboBox
                          opcoes={rsRevisador}
                          campoDescricao="nome"
                          campoID="idPessoa"
                          dados={detalheEntrada}
                          mensagemPadraoCampoEmBranco="Escolha um revisador"
                          field="idPessoa_revisador"
                          label="Revisadores"
                          erros={erros}
                          setState={setDetalheEntrada}
                          onKeyDown={(event: any) => btPulaCampo(event, 10)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                      <Box ref={(el: any) => (fieldRefs.current[10] = el)}>
                        <ComboBox
                          opcoes={rsTinturaria}
                          campoDescricao="idTinturaria"
                          campoID="idTinturaria"
                          dados={detalheEntrada}
                          mensagemPadraoCampoEmBranco="Escolha um romaneio"
                          field="idTinturaria"
                          label="Romaneio"
                          erros={erros}
                          setState={setDetalheEntrada}
                          onKeyDown={(event: any) => btPulaCampo(event, 0)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Condicional>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
                  <Tooltip title={'Cancelar'}>
                    <IconButton
                      color="secondary"
                      sx={{ mt: 3, ml: 2 }}
                      onClick={() => btCancelar()}
                    >
                      <CancelRoundedIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                  <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                    <Tooltip title={'Confirmar'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3, ml: 2 }}
                        onClick={() => btConfirmar()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>

                  <Condicional condicao={localState.action === 'excluindo'}>
                    <Tooltip title={'Excluir'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3, ml: 2 }}
                        onClick={() => btConfirmar()}
                      >
                        <DeleteIcon sx={{ fontSize: 60 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional>
      </CustomDialog>
    </>
  )
}