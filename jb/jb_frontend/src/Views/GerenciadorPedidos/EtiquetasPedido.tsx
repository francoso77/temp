import { Container, Grid, IconButton, Paper } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import { DataTableCabecalhoInterface, ItemSpeedDial } from '../../Componentes/DataTable';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProgramacaoDublagemInterface } from '../../Interfaces/programacaoDublagemInterface';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import ClsApi from '../../Utils/ClsApi';
import { PedidoInterface } from '../../Interfaces/pedidoInterface';
import CloseIcon from '@mui/icons-material/Close'
import TableSelect from '../../Componentes/DataTable/tableSelect';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import SellTwoToneIcon from '@mui/icons-material/SellTwoTone';
import ClsRelatorioProgramacao from '../../Utils/ClsRelatorioProgramacao';
import { StatusTypes } from '../../types/statusTypes';

interface PropsInterface {
  programacao: number,
  setOpenMaster: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EtiquetasPedido({ programacao, setOpenMaster }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()
  const clsRelatorioProgramacao = new ClsRelatorioProgramacao()

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([])
  const [rsPessoa, setRsPessoa] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Pedido',
      alinhamento: 'center',
      campo: 'idPedido',
      largura: 15,
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Data',
      alinhamento: 'center',
      campo: 'dataPedido',
      // format: (data) => clsFormatacao.dataISOtoUser(data)
      format: (_v, rs: any) => {
        const pedido = rsPedido.find(v => v.idPedido === rs.idPedido);
        return pedido ? clsFormatacao.dataISOtoUser(pedido.dataPedido) : '';
      }
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'idPessoa_cliente',
      format: (_v, rs: any) => rsPessoa.find(v => v.idPessoa === rsPedido.find(v => v.idPedido === rs.idPedido)?.idPessoa_cliente)?.nome
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      campo: 'idPessoa_vendedor',
      format: (_v, rs: any) => rsPessoa.find(v => v.idPessoa === rsPedido.find(v => v.idPedido === rs.idPedido)?.idPessoa_vendedor)?.nome
    },
    {
      cabecalho: 'Status',
      alinhamento: 'center',
      campo: 'statusPedido',
      format: (_v, rs: any) => StatusTypes.find(v => v.idStatus === rsPedido.find(v => v.idPedido === rs.idPedido)?.statusPedido)?.descricao
    }

  ]

  async function onStatus(
    selecao: any,
    setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>,
    tipo: "etiqueta" | "romaneio"
  ) {

    const tmp: Array<number> = []
    selecao.forEach((sel: any) => {

      tmp.push(rsPesquisa[sel].idPedido)

    })
    if (tipo === "etiqueta") {
      onEtiqueta(tmp)
    } else {
      onRomaneio(tmp)
    }
    setSelected([])
  }


  const onEtiqueta = async (ids: number[]) => {
    clsRelatorioProgramacao.renderEtiqueta(ids)
  }

  const onRomaneio = async (ids: number[]) => {
    clsRelatorioProgramacao.renderRomaneio(ids)
  }

  const actions: Array<ItemSpeedDial> = [
    { icon: <SellTwoToneIcon />, name: 'Etiqueta', tipo: "etiqueta" },
    { icon: <ArticleTwoToneIcon />, name: 'Romaneio', tipo: "romaneio" },
  ]
  const btFechar = () => {
    setOpenMaster(false)
  }
  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Pedido",
        relations: [
          "detalhePedidos",
        ],
      })
      .then((rsPedidos: Array<PedidoInterface>) => {
        setRsPedido(rsPedidos)
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ["nome"],
      })
      .then((rsPessoas: Array<PessoaInterface>) => {
        setRsPessoa(rsPessoas)
      })

    clsApi.execute<Array<PedidoInterface>>({
      url: 'pedidosFechados',
      method: 'post',
      id: programacao,
      mensagem: 'Pesquisando pedidos ...',
      setMensagemState: setMensagemState
    })
      .then((rs) => {
        setRsPesquisa(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [programacao])

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Paper variant="outlined" sx={{ p: 1 }}>
          <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <TableSelect
                ItemSpeed={actions}
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "sellTwoToneIcon",
                    onAcionador: (rs: DetalheProgramacaoDublagemInterface) =>
                      onEtiqueta([rs.idPedido]),
                    toolTip: "Etiqueta",
                  },
                  {
                    icone: "articleTwoToneIcon",
                    onAcionador: (rs: DetalheProgramacaoDublagemInterface) =>
                      onRomaneio([rs.idPedido]),
                    toolTip: "Romaneio",
                  },
                ]}
                onStatus={onStatus}
                tituloTabela='Pedidos Cortados'
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  )
}