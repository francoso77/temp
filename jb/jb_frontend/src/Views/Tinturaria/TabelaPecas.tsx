import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { DataTableCabecalhoInterface, ItemSpeedDial } from '../../Componentes/DataTable';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import DataTableSelect from '../../Componentes/DataTable/tableSelectNivel';
import TableSelect from '../../Componentes/DataTable/tableSelect';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import { ProducaoMalhariaInterface } from '../../Interfaces/producaoMalhariaInterface';


interface PropsInterface {
  // indiceEdicao: number
  // rsMaster: ProducaoDublagemInterface
  // setRsMaster: React.Dispatch<React.SetStateAction<ProducaoDublagemInterface>>,
  // masterLocalState: ActionInterface,
  // setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProducaoDublagemInterface>>,
  rsPecas: any[],
  setRsPecas: React.Dispatch<React.SetStateAction<Array<any>>>,
  openPecas: boolean,
  setOpenPecas: React.Dispatch<React.SetStateAction<boolean>>,
  rsListaPecas: any[],
  setRsListaPecas: React.Dispatch<React.SetStateAction<Array<any>>>,
}


export default function DetalhePecaTinturaria({ openPecas, setOpenPecas, rsPecas, setRsPecas, rsListaPecas, setRsListaPecas }: PropsInterface) {
  //export default function TabelaPecas() {

  const clsFormatacao = new ClsFormatacao()
  const clsCrud = new ClsCrud()

  //const [open, setOpen] = useState(false)
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [detalhePeca, setDetalhePeca] = useState<any[]>([])
  const { setMensagemState, mensagemState } = useContext(GlobalContext) as GlobalContextInterface

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Pesos',
      alinhamento: 'center',
      campo: 'peso',
      largura: 1,
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Peças',
      alinhamento: 'left',
      largura: 1,
      campo: 'peca',
      //format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Artigo',
      alinhamento: 'left',
      largura: 2,
      campo: 'idProduto',
      format: (_v, rs: any) => rs.produto.nome
    },
  ]

  const actions: Array<ItemSpeedDial> = [
    { icon: <FactCheckTwoToneIcon />, name: 'Adicionar peças ao Romaneio', tipo: "romaneio" },
  ]

  async function onStatus(
    selecao: any,
    setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>,
    tipo: "etiqueta" | "romaneio"
  ) {

    const tmp: Array<string> = []
    selecao.forEach((sel: any) => {
      tmp.push(detalhePeca[sel].peca)

    })
    if (tipo === "romaneio") {
      onRomaneio(tmp)
    }
    setSelected([])
  }
  const onRomaneio = (pecas: Array<string>) => {
    // let tmpPecas: Array<string> = []

    // if (rsPecas.length > 0) {
    //   rsPecas.forEach(peca => {
    //     pecas.forEach(item => {
    //       if (peca !== item) {
    //         tmpPecas.push(item)
    //       }
    //     });
    //   })
    // } else {
    //   tmpPecas = pecas
    // }

    // console.log('peças enviadas', tmpPecas)

    setRsListaPecas(pecas)
    setOpenPecas(false)
  }

  const FiltrarPecas = async (rs: Array<ProducaoMalhariaInterface>) => {
    let tmpDetalhe = rs.filter((item) => !rsPecas.includes(item.peca));
    setDetalhePeca(tmpDetalhe);
  }


  const buscarDados = () => {
    clsCrud.pesquisar({
      entidade: "ProducaoMalharia",
      criterio: {
        fechado: 0
      },
      relations: ['produto'],
      camposLike: ['fechado'],
      select: [
        'idTinturaria',
        'idMalharia',
        'peca',
        'idProduto',
        'produto.nome',
        'peso',
        'dataFechado',
        'fechado',
      ],
    }).then((rs: Array<any>) => {
      if (rs.length > 0) {
        //setDetalhePeca(rs)
        FiltrarPecas(rs)
      } else {
        setMensagemState({
          titulo: 'Aviso',
          exibir: true,
          mensagem: 'Não há peças em aberto!',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        })
      }
    })
  }
  // const validarDados = (): boolean => {
  //   let retorno: boolean = true
  //   let erros: { [key: string]: string } = {}

  //   retorno = validaCampo.naoVazio('metros', detalhePeca, erros, retorno, 'Informe a metragem')

  //   setErros(erros)
  //   return retorno
  // }

  // const onEditar = (rs: DetalhePecaInterface, indice: number) => {

  //   setLocalState({ action: actionTypes.editando })
  //   setDetalhePeca(rs)
  //   setOpen(true)
  // }

  // const onExcluir = (rs: DetalhePecaInterface, indice: number) => {
  //   console.log(indice, rs, rsMaster.detalheProducaoDublagens[indiceEdicao], "delete")
  //   let tmpDetalhe: Array<DetalhePecaInterface> = []

  //   rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.forEach((det, i) => {
  //     if (i !== indice) {
  //       tmpDetalhe.push(det)
  //     }
  //   })
  //   setRsMaster({
  //     ...rsMaster,
  //     detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
  //       index === indiceEdicao
  //         ? { ...item, detalhePecas: tmpDetalhe }
  //         : item
  //     )
  //   })
  //   console.log(tmpDetalhe, "depois delete")
  // }

  const btIncluir = () => {
    //   setOpen(true)
    //   setDetalhePeca(ResetDados)
    //   setLocalState({ action: actionTypes.incluindo })
  }

  const btFechar = () => {
    setOpenPecas(false)
    //   setErros({})
    //   setDetalhePeca(ResetDados)
    //   setLocalState({ action: actionTypes.pesquisando })
  }

  const btCancelar = () => {
    //setOpenPecas(false)
    //   setErros({})
    //   setDetalhePeca(ResetDados)
    //   setLocalState({ action: actionTypes.pesquisando })
  }
  const btConfirmaInclusao = async () => {

    //   if (validarDados()) {

    //     let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas]

    //     tmpDetalhe.push({
    //       idDetalheProducaoDublagem: rsMaster.detalheProducaoDublagens[indiceEdicao].idDetalheProducaoDublagem as number,
    //       metros: detalhePeca.metros,
    //     })

    //     setRsMaster({
    //       ...rsMaster,
    //       detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
    //         index === indiceEdicao
    //           ? { ...item, detalhePecas: tmpDetalhe }
    //           : item
    //       )
    //     })

    //     setLocalState({ action: actionTypes.pesquisando })
    //     setOpen(false)
    //   }
  }

  const btConfirmaAlteracao = () => {
    //   if (validarDados()) {

    //     const indice = rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.findIndex(
    //       (v, i) => v.idDetalhePeca === detalhePeca.idDetalhePeca
    //     )

    //     let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas]
    //     tmpDetalhe[indice] = {
    //       ...detalhePeca,
    //     }

    //     setRsMaster({
    //       ...rsMaster,
    //       detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
    //         index === indiceEdicao
    //           ? { ...item, detalhePecas: tmpDetalhe }
    //           : item
    //       )
    //     })
    //     setLocalState({ action: actionTypes.pesquisando })
    //     setDetalhePeca(ResetDados)
    //     setOpen(false)
    //   }
  }


  useEffect(() => {
    buscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <>
      <Dialog
        open={openPecas}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ ml: 5, color: 'white', flexGrow: 1, textAlign: 'center' }}>
              Itens em aberto
            </Typography>
            <Tooltip title={'Fechar'} >
              <IconButton
                color="secondary"
                sx={{ color: 'white', marginLeft: 'auto' }}
                onClick={() => btFechar()}
              >
                <CancelRoundedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Paper>
        <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12}>
              <TableSelect
                ItemSpeed={actions}
                tituloTabela='Listagem de Artigos'
                colunaSoma={['peso']}
                temTotal={true}
                onStatus={onStatus}
                cabecalho={cabecalhoForm}
                dados={detalhePeca}
                //dados={rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas}
                acoes={localState.action === 'pesquisando' ? [] :
                  [
                    // {
                    //   icone: "edit",
                    //   onAcionador: (rs: DetalhePecaInterface, indice: number) =>
                    //     onEditar(rs, indice),
                    //   toolTip: "Editar",
                    // },
                    // {
                    //   icone: "delete",
                    //   onAcionador: (rs: DetalhePecaInterface, indice: number) =>
                    //     onExcluir(rs, indice),
                    //   toolTip: "Excluir",
                    // },
                  ]}
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
                      onClick={localState.action === actionTypes.incluindo ?
                        () => btConfirmaInclusao() : () => btConfirmaAlteracao()}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                </Condicional>
              </Grid>
            </Condicional>
          </Grid>
        </Paper >
      </Dialog >
    </>
  )
}