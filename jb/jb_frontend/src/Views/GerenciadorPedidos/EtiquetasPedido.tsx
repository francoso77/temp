import { Container, Dialog, Grid, IconButton, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProgramacaoDublagemInterface, ProgramacaoDublagemInterface } from '../../../../jb_backend/src/interfaces/programacaoDublagemInterface';
import { StatusPedidoType, StatusPedidoTypes } from '../../types/statusPedidoTypes';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import GerenciadorPedido from './GerenciadorPedidos';
import ClsApi from '../../Utils/ClsApi';
import { PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import CloseIcon from '@mui/icons-material/Close'



interface PropsInterface {
  programacao: number,
  setOpenMaster: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function EtiquetasPedido({ programacao, setOpenMaster }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()

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
      format: (_v, rs: any) => StatusPedidoTypes.find(v => v.idStatusPedido === rsPedido.find(v => v.idPedido === rs.idPedido)?.statusPedido)?.descricao
    }

  ]

  const onEtiqueta = (rs: DetalheProgramacaoDublagemInterface) => {

  }

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

    console.log(programacao, 'programacao')
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
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "printTwoToneIcon",
                    onAcionador: (rs: DetalheProgramacaoDublagemInterface) =>
                      onEtiqueta(rs),
                    toolTip: "Excluir",
                  },
                ]}

              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  )
}