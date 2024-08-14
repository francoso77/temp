import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Tooltip } from '@mui/material';
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
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/PedidoInterface';
import { StatusPedidoItemType } from '../../types/statusPedidoItemTypes';
import styled from 'styled-components';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import InputCalc from '../../Componentes/InputCalc';


const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '90%', // Ajuste esta porcentagem conforme necessário
    height: '90vh', // Ajuste esta altura conforme necessário
    maxWidth: 'none',
    maxHeight: 'none',
  },
}));

interface PropsInterface {
  rsPedido: PedidoInterface
  setPedidoState: React.Dispatch<React.SetStateAction<ActionInterface>>,
}

interface rsSomatorioInterface {
  total: number
  totalQtdPedida: number
}
export default function DetalhePedido({ rsPedido, setPedidoState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const SomatorioDados: rsSomatorioInterface = {
    total: 0,
    totalQtdPedida: 0
  }
  const ResetDados: DetalhePedidoInterface = {
    idPedido: rsPedido.idPedido as number,
    idProduto: 0,
    qtdPedida: 0,
    vrUnitario: 0,
    qtdAtendida: 0,
    statusItem: StatusPedidoItemType.aberto
  }

  interface PesquisaInterface {
    nome: string
  }

  const [open, setOpen] = useState(true);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalhePedidoInterface>>([])
  const [nomeCliente, setNomeCliente] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [detalhePedido, setDetalhePedido] = useState<DetalhePedidoInterface>(ResetDados)
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
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

  const pesquisarID = (id: string | number): Promise<DetalhePedidoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        criterio: {
          idDetalhePedido: id,
        },
      })
      .then((rs: Array<DetalhePedidoInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalhePedido(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalhePedido(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setDetalhePedido(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setDetalhePedido(ResetDados)
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

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalhePedido, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('vrUnitario', detalhePedido, erros, retorno, 'Valor maior que 0')
    retorno = validaCampo.naoVazio('qtdPedida', detalhePedido, erros, retorno, 'Valor maior que 0')
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
  dp.idProduto = ${detalhePedido.idProduto};
  `;

    clsCrud
      .query({
        entidade: "DetalhePedido",
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
              entidade: "DetalhePedido",
              criterio: detalhePedido,
              localState: localState,
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
              entidade: "DetalhePedido",
              criterio: {
                idDetalhePedido: detalhePedido.idDetalhePedido
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
      dp.idPedido = ${detalhePedido.idPedido};
    `;

    clsCrud
      .query({
        entidade: "Pedido",
        sql: query,
        msg: 'Pesquisando Pedidos ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })

    query = `
    SELECT 
      FORMAT(SUM(dp.qtdPedida * dp.vrUnitario),2,'de_DE') AS total,
      FORMAT(SUM(dp.qtdPedida),2,'de_DE') AS totalQtdPedida
    FROM 
      detalhepedidos dp
    INNER JOIN 
      pedidos p ON p.idPedido = dp.idPedido
    WHERE 
      dp.idPedido = ${detalhePedido.idPedido};
      `;

    clsCrud
      .query({
        entidade: "DetalhePedido",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rs: Array<rsSomatorioInterface>) => {
        setRsSomatorio({
          total: rs[0].total ? rs[0].total : 0,
          totalQtdPedida: rs[0].totalQtdPedida ? rs[0].totalQtdPedida : 0
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
      p.idPedido = ${rsPedido.idPedido};
    `;

    clsCrud
      .query({
        entidade: "Pedido",
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
      WHERE 
      p.idProduto <> ${rsPedido.idPedido};
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
    setPedidoState({ action: actionTypes.pesquisando })
    setLayoutState({
      titulo: 'Pedidos',
      tituloAnterior: 'Itens do Pedido',
      pathTitulo: '/Pedido',
      pathTituloAnterior: '/DetalhePedido'
    })
  }

  useEffect(() => {
    btPesquisar()
    BuscarDados()
  }, [])

  return (
    <>
      <CustomDialog open={open} >
        <DialogTitle sx={{ m: 0, p: 0 }}>
          <Paper variant="outlined" sx={{ display: 'flex', m: 1, p: 1 }}>
            <Grid container >
              <Grid item xs={10}>
                <ShowText
                  titulo="Cliente"
                  descricao={nomeCliente.nome} />
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} >
                <ShowText
                  titulo="Data"
                  descricao={clsFormatacao.dataFormatada(rsPedido.dataPedido)} />
              </Grid>
            </Grid>
          </Paper>
        </DialogTitle>
        <DialogContent sx={{ m: 0, p: 0 }}>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Paper sx={{ m: 1, p: 1 }}>
              <Grid container spacing={1.2} justifyContent='flex-end' sx={{ display: 'flex', alignItems: 'center' }}>

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
                        onAcionador: (rs: DetalhePedidoInterface) =>
                          onEditar(rs.idDetalhePedido as number),
                        toolTip: "Editar",
                      },
                      {
                        icone: "delete",
                        onAcionador: (rs: DetalhePedidoInterface) =>
                          onExcluir(rs.idDetalhePedido as number),
                        toolTip: "Excluir",
                      },
                    ]}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                </Grid>
                <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
                  <InputText
                    label="Qtd Total"
                    dados={rsSomatorio}
                    field="totalQtdPedida"
                    setState={setDetalhePedido}
                    disabled={true}
                    textAlign='center'
                  />
                </Grid>
                <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
                  <InputText
                    label="Total Pedido"
                    dados={rsSomatorio}
                    field="total"
                    setState={setDetalhePedido}
                    disabled={true}
                    textAlign='center'
                  />
                </Grid>
              </Grid>
            </Paper>
          </Condicional>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            <Paper variant="outlined" sx={{ padding: 1, m: 1 }}>
              <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                    <ComboBox
                      opcoes={rsProduto}
                      campoDescricao="nome"
                      campoID="idProduto"
                      dados={detalhePedido}
                      mensagemPadraoCampoEmBranco="Escolha um produto"
                      field="idProduto"
                      label="Produtos"
                      erros={erros}
                      setState={setDetalhePedido}
                      onKeyDown={(event) => btPulaCampo(event, 1)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <InputText
                      tipo='currency'
                      scale={4}
                      label="Qtd Pedida"
                      dados={detalhePedido}
                      field="qtdPedida"
                      setState={setDetalhePedido}
                      disabled={localState.action === 'excluindo' ? true : false}
                      erros={erros}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event: any) => btPulaCampo(event, 2)}
                      textAlign='right'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                  <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                    <InputText
                      tipo='currency'
                      scale={4}
                      label="Vr Unitário"
                      dados={detalhePedido}
                      field="vrUnitario"
                      setState={setDetalhePedido}
                      disabled={localState.action === 'excluindo' ? true : false}
                      erros={erros}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event: any) => btPulaCampo(event, 0)}
                      textAlign='right'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>

                  <InputCalc
                    label='Total Item'
                    tipo='currency'
                    scale={4}
                    disabled={true}
                    value={(detalhePedido.qtdPedida * detalhePedido.vrUnitario).toString()}
                    textAlign='right'

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
        </DialogContent>
      </CustomDialog>
    </>
  )
}