import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { DataTableCabecalhoInterface, ItemSpeedDial } from '../../Componentes/DataTable';
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ClsFormatacao from '../../Utils/ClsFormatacao';
import TableSelect from '../../Componentes/DataTable/tableSelect';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import { ProducaoMalhariaInterface } from '../../Interfaces/producaoMalhariaInterface';


interface PropsInterface {
  rsPecas: any[],
  setRsPecas: React.Dispatch<React.SetStateAction<Array<any>>>,
  openPecas: boolean,
  setOpenPecas: React.Dispatch<React.SetStateAction<boolean>>,
  rsListaPecas: any[],
  setRsListaPecas: React.Dispatch<React.SetStateAction<Array<any>>>,
}


export default function DetalhePecaTinturaria({ openPecas, setOpenPecas, rsPecas, setRsPecas, rsListaPecas, setRsListaPecas }: PropsInterface) {

  const clsFormatacao = new ClsFormatacao()
  const clsCrud = new ClsCrud()

  const [detalhePeca, setDetalhePeca] = useState<any[]>([])
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface

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

  const btFechar = () => {
    setOpenPecas(false)
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
                acoes={[]}
              />
            </Grid>
          </Grid>
        </Paper >
      </Dialog >
    </>
  )
}