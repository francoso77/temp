import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProducaoDublagemInterface, ProducaoDublagemInterface } from '../../Interfaces/producaoDublagemInterface';
import { SomatorioProducaoDublagemInterface } from './ProducaoDublagem';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import { ProdutoInterface } from '../../Interfaces/produtoInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { DetalhePedidoInterface } from '../../Interfaces/pedidoInterface';
import ComboBox from '../../Componentes/ComboBox';
import DetalhePeca from './DetalhePeca';



interface PropsInterface {
  rsMaster: ProducaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProducaoDublagemInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProducaoDublagemInterface>>,
}


export default function DetalheProducaoDubalgem({ rsMaster, setRsMaster, masterLocalState, setRsSomatorio }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsFormatacao = new ClsFormatacao()
  const clsCrud = new ClsCrud()

  const ResetDados: DetalheProducaoDublagemInterface = {
    idDublagem: 0,
    idProduto: 0,
    metrosTotal: 0,
    pecasTotal: 0,
    produto: {
      nome: '',
      idUnidade: 0,
      localizacao: '',
      largura: 0,
      gm2: 0,
      ativo: false,
      tipoProduto: TipoProdutoType.tecidoTinto
    },
    detalhePecas: []
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false)
  const [openMetros, setOpenMetros] = useState(false)
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({})
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  const [detalheProducaoDublagem, setDetalheProducaoDublagem] = useState<DetalheProducaoDublagemInterface>(ResetDados)

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rsProduto.find(x => x.idProduto === rs.idProduto)?.nome
    },
    {
      cabecalho: 'Metros',
      alinhamento: 'right',
      campo: 'metrosTotal',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Peças',
      alinhamento: 'right',
      campo: 'pecasTotal',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
  ]

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheProducaoDublagem, erros, retorno, 'Informe um produto')

    setErros(erros)
    return retorno
  }

  const onExcluir = async (rs: DetalheProducaoDublagemInterface) => {

    let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = []
    rsMaster.detalheProducaoDublagens.forEach(det => {

      if (det.idProduto !== rs.idProduto) {
        tmpDetalhe.push(det)
      }
    })

    setRsMaster({ ...rsMaster, detalheProducaoDublagens: tmpDetalhe })
    AtualizaSomatorio(tmpDetalhe)
    buscarDados()
  }

  const onCortar = (rs: DetalheProducaoDublagemInterface, indice: number) => {

    setIndiceEdicao(indice)
    setOpenMetros(true)
  }
  const btIncluir = () => {
    if (
      rsMaster.dataProducao !== "" &&
      rsMaster.idPedido !== 0
    ) {
      setOpen(true)
      setIndiceEdicao(-1)
      setDetalheProducaoDublagem(ResetDados)
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe todos os dados da Produção - (data, pedido e colagem).',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setOpenMetros(false)
  }

  const podeIncluirDetalhe = (): boolean => {
    const indice = rsMaster.detalheProducaoDublagens.findIndex(
      (v, i) => v.idProduto === detalheProducaoDublagem.idProduto && i !== indiceEdicao
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Produto já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return indice < 0;
  }

  const btConfirmaInclusao = async () => {

    if (validarDados() && podeIncluirDetalhe()) {

      let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = [...rsMaster.detalheProducaoDublagens]
      tmpDetalhe.push({
        idDublagem: rsMaster.idDublagem as number,
        idProduto: detalheProducaoDublagem.idProduto,
        metrosTotal: detalheProducaoDublagem.metrosTotal,
        pecasTotal: detalheProducaoDublagem.pecasTotal,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalheProducaoDublagem.idProduto)] },
        detalhePecas: detalheProducaoDublagem.detalhePecas,
      })

      setRsMaster({
        ...rsMaster,
        detalheProducaoDublagens: tmpDetalhe,
      })

      AtualizaSomatorio(tmpDetalhe)
    }
    setOpen(false)
    setOpenMetros(false)
  }

  const btConfirmaAlteracao = () => {

    let pecasTotal = rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.length
    let metrosTotal = rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.reduce((a, b) => a + b.metros, 0)
    let produto = { ...rsProduto[rsProduto.findIndex(v => v.idProduto === rsMaster.detalheProducaoDublagens[indiceEdicao].idProduto)] }
    let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = [...rsMaster.detalheProducaoDublagens]

    tmpDetalhe[indiceEdicao] = {
      ...detalheProducaoDublagem,
      detalhePecas: rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas,
      idProduto: rsMaster.detalheProducaoDublagens[indiceEdicao].idProduto,
      pecasTotal: pecasTotal,
      metrosTotal: metrosTotal,
      produto: produto,
    }

    setRsMaster({
      ...rsMaster,
      detalheProducaoDublagens: [...tmpDetalhe]
    })
    setOpen(false)
    setOpenMetros(false)
    AtualizaSomatorio(tmpDetalhe)

  }

  // const pesquisarPedidoItem = async (pedido: number): Promise<Array<DetalhePedidoInterface> | []> => {
  //   return await clsCrud
  //     .pesquisar({
  //       entidade: "DetalhePedido",
  //       criterio: {
  //         idPedido: pedido,
  //       },
  //     })
  //     .then((rs: Array<DetalhePedidoInterface>) => {

  //       if (rs.length > 0) {
  //         return rs
  //       } else {
  //         return []
  //       }
  //     })
  // }

  const AtualizaSomatorio = (rs: Array<DetalheProducaoDublagemInterface>) => {

    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {

        detalhe.detalhePecas.forEach((peca) => {

          total = total + peca.metros
        })
      })
      setRsSomatorio({ total: total.toString() })
    }
  }

  const buscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        criterio: {
          idPedido: rsMaster.idPedido,
        },
        camposLike: ['idPedido'],
      })
      .then((rs: Array<DetalhePedidoInterface>) => {

        let produtos = rs
          // .filter((d: any) => d.statusItem === 3)
          .map((d: any) => d.idProduto)

        clsCrud.pesquisar({
          entidade: 'Produto',
          comparador: 'I',
          criterio: {
            idProduto: produtos,
          },
          camposLike: ['idProduto'],
          campoOrder: ['nome'],
        }).then((rsProdutos: Array<ProdutoInterface>) => {
          setRsProduto(rsProdutos)
        })
      })
  }

  useEffect(() => {
    buscarDados()
  }, [open])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='sm'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>
              Produto do Pedido
            </Typography>
          </Grid>
        </Paper>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsProduto}
                campoDescricao="nome"
                campoID="idProduto"
                dados={detalheProducaoDublagem}
                mensagemPadraoCampoEmBranco="Escolha um produto"
                field="idProduto"
                label=""
                labelAlign='center'
                textAlign='center'
                erros={erros}
                setState={setDetalheProducaoDublagem}
              />
            </Grid>
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
              <Tooltip title={'Confirmar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btConfirmaInclusao()}
                >
                  <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper >
      </Dialog >
      <Dialog
        open={openMetros}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='sm'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>
              Peças Cortadas
            </Typography>
          </Grid>
          {/* <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon sx={{ color: 'white', fontSize: 30 }} />
            </IconButton>
          </Grid> */}
        </Paper>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
              <DetalhePeca
                indiceEdicao={indiceEdicao}
                rsMaster={rsMaster}
                setRsMaster={setRsMaster}
                masterLocalState={masterLocalState}
                setRsSomatorio={setRsSomatorio}
                setOpenMetros={setOpenMetros}
              />
            </Grid>
          </Grid>
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
            <Tooltip title={'Confirmar'}>
              <IconButton
                color="secondary"
                sx={{ mt: 3, ml: 2 }}
                onClick={() => btConfirmaAlteracao()}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Paper >
      </Dialog >
      <Paper sx={{ m: 0, p: 1 }}>
        <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
            <Tooltip title={'Incluir'}>
              <IconButton
                color="secondary"
                sx={{ mt: -1, ml: { xs: 1, md: 0.5 } }}
                onClick={() => btIncluir()}
              >
                <AddCircleIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Condicional>
        </Grid>
        <Grid item xs={12}>
          <DataTable
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheProducaoDublagens}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheProducaoDublagemInterface) =>
                    onExcluir(rs),
                  toolTip: "Excluir",
                },
                {
                  icone: "content_cut_two_tone_icon",
                  onAcionador: (rs: DetalheProducaoDublagemInterface, indice: number) =>
                    onCortar(rs, indice),
                  toolTip: "Cortar",
                },
              ]}
          />
        </Grid>
      </Paper>
    </>
  )
}