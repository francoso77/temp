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
import { DetalheEstruturaInterface, EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/PedidoInterface';
import { StatusPedidoItemType } from '../../types/statusPedidoItemTypes';



interface PropsInterface {
  rsPedido: PedidoInterface
}

export default function DetalhePedido({ rsPedido }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

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
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalheEstruturaInterface>>([])
  const [nomeCliente, setNomeCliente] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [detalhePedido, setDetalhePedido] = useState<DetalhePedidoInterface>(ResetDados)
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
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
      alinhamento: 'left',
      campo: 'qtd'
    },
    {
      cabecalho: 'Vr Unitário',
      alinhamento: 'left',
      campo: 'vr'
    },
    {
      cabecalho: 'Total Item',
      alinhamento: 'left',
      campo: 'vrTotal'
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
    const query = `
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
	      produtos pr ON pr.idProduto = dp.idProduto;
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
      INNER JOIN 
          tipoprodutos t ON t.idTipoProduto = p.idTipoProduto
      WHERE 
          t.estrutura = true and p.idProduto <> ${rsPedido.idPedido};
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
      titulo: 'Pedidos',
      tituloAnterior: 'Itens do Pedido',
      pathTitulo: '/Pedido',
      pathTituloAnterior: '/DetalhePedido'
    })
  }

  useEffect(() => {
    btPesquisar()
    BuscarDados()
    setLayoutState({
      titulo: 'Itens Pedido',
      tituloAnterior: 'Pedidos',
      pathTitulo: '/DetalhePedido',
      pathTituloAnterior: '/Pedido'
    })
  }, [])

  return (
    <>
      <Dialog open={open}>
        <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>

          <Grid item xs={4}>
            <ShowText
              titulo="Cliente"
              descricao={nomeCliente.nome} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <ShowText
              titulo="Data"
              descricao={rsPedido.dataPedido} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action === 'pesquisando'}>
          <Paper sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>
            <Grid item xs={11}>
              <DataTable
                colunaSoma='qtd'
                temTotal={true}
                qtdColunas={2}
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
        </Condicional>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
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
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  tipo='currency'
                  scale={2}
                  label="Qtd Pedida"
                  dados={detalhePedido}
                  field="qtdPedida"
                  setState={setDetalhePedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  tipo='currency'
                  scale={2}
                  label="Vr Unitário"
                  dados={detalhePedido}
                  field="vrUnitario"
                  setState={setDetalhePedido}
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
      </Dialog>
    </>
  )
}