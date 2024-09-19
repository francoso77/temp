import { Container, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ComboBox from '../../Componentes/ComboBox';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/PedidoInterface';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import DataTableSelect from '../../Componentes/DataTable/tableSelect';
import { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { StatusPedidoItemType, StatusPedidoItemTypes } from '../../types/statusPedidoItemTypes';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import { StatusPedidoType, StatusPedidoTypes } from '../../types/statusPedidoTypes';


export default function GerenciadorPedido() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()
  const ResetDados: DetalhePedidoInterface = {
    idPedido: null,
    idProduto: 0,
    produto: {
      nome: '',
      idUnidade: 0,
      localizacao: '',
      largura: 0,
      gm2: 0,
      ativo: false,
      tipoProduto: TipoProdutoType.tecidoTinto
    },
    qtdPedida: 0,
    vrUnitario: 0,
    qtdAtendida: 0,
    statusItem: StatusPedidoItemType.aberto,
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [detalhePedido, setDetalhePedido] = useState<DetalhePedidoInterface>(ResetDados)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  const [open, setOpen] = useState<boolean>(false)


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataPedido',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'nomeCliente'
      // campo: 'idPessoa_cliente',
      // format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      campo: 'nomeVendedor'
      // campo: 'idPessoa_vendedor',
      // format: (_v, rs: any) => rs.vendedor.nome
    },
    {
      cabecalho: 'Status Pedido',
      alinhamento: 'center',
      campo: 'statusPedido',
      format: (_v, rs: any) => StatusPedidoTypes.find(v => v.idStatusPedido === rs.statusPedido)?.descricao
    },
  ]

  const cabecalhoDetalhe: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'Produto',
      // format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'right',
      campo: 'qtd',
      format: (_v, rs: any) => clsFormatacao.currency(rs.qtd)
      // campo: 'idPessoa_cliente',
      // format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Status Item',
      alinhamento: 'center',
      campo: 'status',
      format: (_v, rs: any) => StatusPedidoItemTypes.find(v => v.idStatusPedidoItem === rs.status)?.descricao
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

  const pesquisarID = async (id: string | number): Promise<DetalhePedidoInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        criterio: {
          idDetalhePedido: id,
        },
        select: ['idDetalhePedido', 'statusItem', 'idPedido']
      });
    return rs[0]
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalhePedido(rs)
      setOpen(true)
    })
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalhePedido(ResetDados)
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('statusItem', detalhePedido, erros, retorno, 'Defina o status')

    setErros(erros)
    return retorno
  }

  const verificaStatusPedido = (pedido: number) => {
    clsCrud.pesquisar({
      entidade: "Pedido",
      relations: ["detalhePedidos"],
      criterio: {
        idPedido: pedido
      }
    }).then((rs: Array<PedidoInterface>) => {
      const qtdItens = rs[0].detalhePedidos.length
      const emProducao = rs[0].detalhePedidos.filter((det: DetalhePedidoInterface) => det.statusItem === 3).length

      if (qtdItens === emProducao) {
        rs[0].statusPedido = StatusPedidoType.producao
      } else if (emProducao > 0 && emProducao < qtdItens) {
        rs[0].statusPedido = StatusPedidoType.parcial
      } else {
        rs[0].statusPedido = StatusPedidoType.aberto
      }
      clsCrud.incluir({
        entidade: "Pedido",
        criterio: rs[0],
      })
    })
  }

  const btConfirmar = () => {
    if (validarDados()) {
      clsCrud.incluir({
        entidade: "DetalhePedido",
        criterio: detalhePedido,
        cb: () => btPesquisar(),
        setMensagemState: setMensagemState
      })
        .then((rs) => {
          if (rs.ok) {
            verificaStatusPedido(detalhePedido.idPedido as number)
            btCancelar()
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

  const btPesquisar = () => {
    clsApi.execute<Array<PedidoInterface>>({
      url: 'gerenciadorPedidosEmAberto',
      method: 'post',
      mensagem: 'Pesquisando pedidos ...',
      setMensagemState: setMensagemState
    })
      .then((rs) => {
        setRsPesquisa(rs)
      })
  }

  const EmProducao = async (pedidos: Array<number>) => {
    await clsApi.execute<Array<PedidoInterface>>({
      url: 'produzirPedidos',
      method: 'post',
      pedidos,
      mensagem: 'Alterando status dos pedidos ...',
      setMensagemState: setMensagemState
    })
  }
  async function onStatus(selecao: any, setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>) {

    const tmpPedidoNaoAberto = selecao.filter((item: any) => rsPesquisa[item].statusPedido !== "A")

    let tmp: Array<number> = []
    selecao.forEach((sel: any) => {
      if (rsPesquisa[sel].statusPedido === "A") {
        tmp.push(rsPesquisa[sel].idPedido)
      }
    })
    if (tmpPedidoNaoAberto.length > 0) {
      setMensagemState({
        titulo: 'Atenção...',
        exibir: true,
        exibirBotao: true,
        mensagem: 'Foram selecionados pedidos que não estão EM ABERTO no status!',
        tipo: MensagemTipo.Error,
        cb: null
      })
    } else {

      await EmProducao(tmp)
      setSelected([])
      btPesquisar()
    }
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Gerenciador de Pedidos',
      pathTitulo: '/',
      pathTituloAnterior: '/GerenciadorPedido'
    })
    irPara('/')
  }

  useEffect(() => {
    setLayoutState({
      titulo: 'Gerenciador de Pedidos',
      tituloAnterior: '',
      pathTitulo: '/GerenciadorPedido',
      pathTituloAnterior: ''
    })
    btPesquisar()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (

    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 1, mr: -5, mb: 2 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <DataTableSelect
              cabecalho={cabecalhoForm}
              cabecalhoDetalhe={cabecalhoDetalhe}
              dados={rsPesquisa}
              acoesDetalhe={[
                {
                  icone: "swap_horiz",
                  onAcionador: (rs: any) =>
                    onEditar(rs.idDetalhePedido as number),
                  toolTip: "Editar Status",
                },
              ]}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onStatus={onStatus}
            />
          </Grid>
        </Grid>
      </Paper >

      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='xs'
        sx={{ height: '100%' }}
      >
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b',
          }}>
          <Typography sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Status do Item
          </Typography>
          <Tooltip title={'Fechar'}>
            <IconButton
              color="secondary"
              sx={{ color: 'white', ml: 'auto' }} // Adicionando margem esquerda para mover o ícone à direita
              onClick={() => btCancelar()}
            >
              <CancelRoundedIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        <Paper variant="outlined" sx={{ padding: 2, m: 1 }}>
          <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={StatusPedidoItemTypes}
                campoDescricao="descricao"
                campoID="idStatusPedidoItem"
                dados={detalhePedido}
                mensagemPadraoCampoEmBranco="Status do pedido"
                field="statusItem"
                label=""
                erros={erros}
                setState={setDetalhePedido}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
              <Tooltip title={'Confirmar'}>
                <IconButton
                  color="secondary"
                  onClick={() => btConfirmar()}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    </Container>
  )
}