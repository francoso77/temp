import { Dialog, Grid, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
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
  totalPedido: number
  totalQtd: number
}
export default function DetalheEntrada({ rsEntrada }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const SomatorioDados: rsSomatorioInterface = {
    totalPedido: 0,
    totalQtd: 0
  }
  const ResetDados: DetalheEntradaInterface = {
    idEntrada: rsEntrada.idEntrada as number,
    idProduto: 0,
    idCor: 0,
    qtdPecas: 0,
    vrUnitario: 0,
    qtd: 0,
    metro: 0,
    gm2: 0,
    idPessoa_revisador: 0,
    idTinturaria: 0,
    perdaMalharia: 0,
    perdaTinturaria: 0
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

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'nomeProduto'
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

  const pegaTipo = () => {
    let auxTipo: number | undefined = rsProduto.
      find(produto => produto.idProduto === detalheEntrada.idProduto)?.tipoProduto;
    setTipo(auxTipo)
  }
  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    // retorno = validaCampo.naoVazio('idProduto', detalheEntrada, erros, retorno, 'Escolha um produto')
    // retorno = validaCampo.naoVazio('vrUnitario', detalheEntrada, erros, retorno, 'Valor maior que 0')
    // retorno = validaCampo.naoVazio('qtdPedida', detalheEntrada, erros, retorno, 'Valor maior que 0')
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
    de.idProduto = ${detalheEntrada.idProduto};
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
              localState: localState.action,
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
        dp.idDetalhePedido, 
        dp.idPedido, 
        dp.qtdPedida AS qtd, 
        dp.vrUnitario AS vr, 
        dp.idProduto, 
        pr.nome AS nomeProduto,
        (dp.qtdPedida * dp.vrUnitario) AS vrTotal
        
    FROM 
        detalhepedidos dp
    INNER JOIN 
	      pedidos p ON p.idPedido = dp.idPedido
    INNER JOIN
	      produtos pr ON pr.idProduto = dp.idProduto
    WHERE 
        dp.idPedido = ${detalheEntrada.idEntrada};
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

    // SUM(dp.qtdPedida * dp.vrUnitario) AS total,
    // SUM(dp.qtdPedida) AS totalQtdPedida
    query = `
      SELECT 
      FORMAT(SUM(dp.qtdPedida * dp.vrUnitario),2,'de_DE') AS totalPedido,
      FORMAT(SUM(dp.qtdPedida),2,'de_DE') AS totalQtd
    FROM 
        detalhepedidos dp
    INNER JOIN 
        pedidos p ON p.idPedido = dp.idPedido
    WHERE 
        dp.idPedido = ${detalheEntrada.idEntrada};
    `;

    clsCrud
      .query({
        entidade: "DetalheEntrada",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<rsSomatorioInterface>) => {
        setRsSomatorio({
          totalPedido: rs[0].totalPedido,
          totalQtd: rs[0].totalQtd
        })
      })
  }

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

    query = `SELECT p.* FROM produtos p;`;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    query = `SELECT c.* FROM cores c;`;
    clsCrud
      .query({
        entidade: "Cor",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })

    query = `SELECT idTinturaria FROM tinturarias ORDER BY t.idTinturaria ASC;`;
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
            p.*
        FROM 
            pessoas p
        WHERE 
            p.tipoPessoa = 'R'
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
    irpara('/Pedido')
    setLocalState({ action: actionTypes.pesquisando })

    setLayoutState({
      titulo: 'Entradas',
      tituloAnterior: 'Itens da Entrada',
      pathTitulo: '/Entrada',
      pathTituloAnterior: '/DetalheEntrada'
    })
  }

  useEffect(() => {
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

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

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
                  label="Total Pedido"
                  dados={rsSomatorio}
                  field="totalPedido"
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
              <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
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
                />
              </Grid>
              <Condicional condicao={![1, 4, 9].includes(tipo as number)}>

                <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
                  <ComboBox
                    opcoes={rsCor}
                    campoDescricao="nome"
                    campoID="idCor"
                    dados={detalheEntrada}
                    mensagemPadraoCampoEmBranco="Escolha uma cor"
                    field="idCor"
                    label="Cores"
                    erros={erros}
                    setState={setDetalheEntrada}
                  />
                </Grid>
              </Condicional>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                />
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
              <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                <Typography>
                  Detalhes de Tinturaria
                </Typography>

              </Grid>
              <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
                <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    />
                  </Grid>
                  <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    />
                  </Grid>
                  <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    />
                  </Grid>
                  <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    />
                  </Grid>
                  <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
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
                    />
                  </Grid>
                </Grid>
              </Paper>
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
            {/* <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>

              <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={3} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
                  <InputText
                    label="Total Item"
                    dados={rsSomatorio}
                    field="totalPedido"
                    setState={setDetalheEntrada}
                    disabled={true}
                  />
                </Grid>
              </Grid>
            </Paper> */}

          </Paper >
        </Condicional>
      </CustomDialog>
    </>
  )
}