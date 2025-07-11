import { Container, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ComboBox from '../../Componentes/ComboBox';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import DataTableSelect from '../../Componentes/DataTable/tableSelectNivel';
import { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { StatusPedidoItemType, StatusPedidoItemTypes } from '../../types/statusPedidoItemTypes';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import { StatusPedidoType, StatusPedidoTypes } from '../../types/statusPedidoTypes';
import { DetalhePedidoInterface, PedidoInterface } from '../../Interfaces/pedidoInterface';
import { DetalheProgramacaoDublagemInterface } from '../../Interfaces/programacaoDublagemInterface';

interface PropsInterface {
  detalhe: Array<DetalheProgramacaoDublagemInterface>
  setOpenDetalhe: React.Dispatch<React.SetStateAction<boolean>>
}
export default function GerenciadorPedido({ detalhe, setOpenDetalhe }: PropsInterface) {

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
    idCor: null,
    cor: {
      nome: '',
      nivel: 0
    },
    qtdPedida: 0,
    vrUnitario: 0,
    qtdAtendida: 0,
    statusItem: StatusPedidoItemType.aberto,
  }

  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [detalhePedido, setDetalhePedido] = useState<DetalhePedidoInterface>(ResetDados)
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([])
  const [open, setOpen] = useState<boolean>(false)


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataPedido',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Pedido',
      alinhamento: 'left',
      campo: 'idPedido',
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'nomeCliente'
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      campo: 'nomeVendedor'
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
      const emProducao = rs[0].detalhePedidos.filter((det: DetalhePedidoInterface) => det.statusItem === StatusPedidoItemType.producao).length

      if (qtdItens === emProducao) {
        rs[0].statusPedido = StatusPedidoType.producao
      } else {
        rs[0].statusPedido = StatusPedidoType.aberto
      }
      clsCrud.incluir({
        entidade: "Pedido",
        criterio: rs[0],
        token: usuarioState.token
      })
    })
  }

  const btConfirmar = () => {

    if (validarDados()) {
      clsCrud.incluir({
        entidade: "DetalhePedido",
        criterio: detalhePedido,
        token: usuarioState.token,
        cb: () => BuscaDados(),
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

  const BuscaDados = () => {
    clsApi.execute<Array<PedidoInterface>>({
      url: 'gerenciadorPedidosEmAberto',
      method: 'post',
      mensagem: 'Pesquisando pedidos ...',
      setMensagemState: setMensagemState
    })
      .then((rs) => {
        setRsPesquisa(rs)
      })

    clsCrud.pesquisar({
      entidade: 'Pedido',
      relations: ['detalhePedidos'],
    }).then((rs: Array<PedidoInterface>) => {
      setRsPedido(rs)
    })
  }


  const podeIncluirDetalhe = (): boolean => {
    const indice = detalhe.findIndex(
      (v, i) => v.idPedido === detalhePedido.idPedido && i !== (-1)
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Pedido já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return indice < 0;
  }
  const AlterarStatusPedido = async (pedidos: Array<number>) => {
    await clsApi.execute<Array<PedidoInterface>>({
      url: 'produzirPedidos',
      method: 'post',
      pedidos,
      tipoProducao: 3,
      mensagem: 'Alterando status dos pedidos ...',
      setMensagemState: setMensagemState
    })
  }
  async function onStatus(selecao: any, setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>) {

    const tmpPedidoNaoAberto = selecao.filter((item: any) => rsPesquisa[item].statusPedido !== StatusPedidoType.aberto)

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
      let tmp: Array<number> = []
      selecao.forEach((sel: any) => {
        if (rsPesquisa[sel].statusPedido === StatusPedidoType.aberto) {
          tmp.push(rsPesquisa[sel].idPedido)
          if (podeIncluirDetalhe()) {
            detalhe.push({
              idProgramacaoDublagem: null,
              idPedido: rsPesquisa[sel].idPedido,
              pedido: { ...rsPedido[rsPedido.findIndex(v => v.idPedido === rsPesquisa[sel].idPedido)] },
            })
          }
        }
      })
      await AlterarStatusPedido(tmp)
      setSelected([])
      BuscaDados()
    }
  }

  const btFechar = () => {
    setOpenDetalhe(false)
  }

  useEffect(() => {
    BuscaDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (

    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 1, mr: -5 }}>
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
            p: 0,
            backgroundColor: '#3c486b',
          }}>
          <Typography sx={{ color: 'white', flexGrow: 1, textAlign: 'center', mt: 1 }}>
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

        <Paper variant="outlined" sx={{ padding: 1, m: 1 }}>
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
