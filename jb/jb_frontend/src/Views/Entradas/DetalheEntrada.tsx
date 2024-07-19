import { Dialog, Grid, IconButton, Paper, Tooltip } from '@mui/material';
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
  const clsFormatcao = new ClsFormatacao()

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
    peso: 0,
    metro: 0,
    gm2: 0,
    idPessoa_revisador: 0,
    romaneio: '',
    malharia: 0,
    tinturaria: 0
  }

  interface PesquisaInterface {
    nome: string
  }

  const [open, setOpen] = useState(true);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalheEntradaInterface>>([])
  const [nomeCliente, setNomeCliente] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [detalheEntrada, setDetalheEntrada] = useState<DetalheEntradaInterface>(ResetDados)
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
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
      format: (qtd) => clsFormatcao.currency(qtd)
    },
    {
      cabecalho: 'Vr Unitário',
      alinhamento: 'right',
      campo: 'vr',
      format: (vr) => clsFormatcao.currency(vr)
    },
    {
      cabecalho: 'Total Item',
      alinhamento: 'right',
      campo: 'vrTotal',
      format: (vrTotal) => clsFormatcao.currency(vrTotal)
    },
  ]

  function dataFormatada(dateString: string): string {
    if (dateString.length !== 8) {
      throw new Error("Data Inválida. Use o formato DDMMYYYY");
    }
    const day = dateString.substring(0, 2)
    const month = dateString.substring(2, 4)
    const year = dateString.substring(4, 8)
    return `${day}/${month}/${year}`
  }

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

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheEntrada, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('vrUnitario', detalheEntrada, erros, retorno, 'Valor maior que 0')
    retorno = validaCampo.naoVazio('qtdPedida', detalheEntrada, erros, retorno, 'Valor maior que 0')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    const query = `
    SELECT 
    dp.*
    FROM 
    detalhepedidos dp
    WHERE 
    dp.idProduto = ${detalheEntrada.idProduto};
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
        p.*,
        pe.nome AS nomeCliente
    FROM 
        pedidos p
    INNER JOIN 
        pessoas pe ON pe.idPessoa = p.idPessoa_cliente
    WHERE 
        p.idPedido = ${rsEntrada.idEntrada};
    `;

    clsCrud
      .query({
        entidade: "Entrada",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setNomeCliente({ nome: rs[0].nomeCliente })
      })

    query = `
      SELECT 
          p.*
      FROM 
          produtos p
      INNER JOIN 
          tipoprodutos t ON t.idTipoProduto = p.idTipoProduto
      WHERE 
          t.estrutura = true and p.idProduto <> ${rsEntrada.idEntrada};
      `;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        msg: '',
        setMensagemState: setMensagemState
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
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
        <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>

          <Grid item xs={4}>
            <ShowText
              titulo="Cliente"
              descricao={nomeCliente.nome} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <ShowText
              titulo="Data"
              descricao={dataFormatada(rsEntrada.dataEmissao)} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action === 'pesquisando'}>
          <Paper sx={{ display: 'flex', m: 1, padding: 1.5 }}>
            <Grid item xs={11}>
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
            <Grid item xs={1}>
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
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
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
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  tipo='currency'
                  scale={2}
                  label="Qtd Pedida"
                  dados={detalheEntrada}
                  field="qtdPedida"
                  setState={setDetalheEntrada}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  tipo='currency'
                  scale={2}
                  label="Vr Unitário"
                  dados={detalheEntrada}
                  field="vrUnitario"
                  setState={setDetalheEntrada}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
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