import { Dialog, Grid, IconButton, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProgramacaoDublagemInterface, ProgramacaoDublagemInterface } from '../../../../jb_backend/src/interfaces/programacaoDublagemInterface';
import { StatusPedidoTypes } from '../../types/statusPedidoTypes';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import GerenciadorPedido from './GerenciadorPedidos';
import ClsApi from '../../Utils/ClsApi';
import { PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';


interface PropsInterface {
  rsMaster: ProgramacaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProgramacaoDublagemInterface>>,
  masterLocalState: ActionInterface,
}


export default function DetalheProgramacaoDublagem({ rsMaster, setRsMaster, masterLocalState }: PropsInterface) {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()

  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([])
  const [rsPessoa, setRsPessoa] = useState<Array<PessoaInterface>>([])
  const [_rsPesquisa, setRsPesquisa] = useState<Array<any>>([])


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

  const AlterarStatusPedido = async (pedidos: Array<number>) => {
    await clsApi.execute<Array<PedidoInterface>>({
      url: 'produzirPedidos',
      method: 'post',
      pedidos,
      tipoProducao: 'A',
      mensagem: 'Alterando status dos pedidos ...',
      setMensagemState: setMensagemState
    })
    setTimeout(() => {
    }, 10000);
  }
  const onExcluir = (rs: DetalheProgramacaoDublagemInterface) => {

    const pedido: number[] = [rs.idPedido]
    let tmpDetalhe: Array<DetalheProgramacaoDublagemInterface> = []
    rsMaster.detalheProgramacaoDublagens.forEach(det => {
      if (det.idPedido !== rs.idPedido) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheProgramacaoDublagens: tmpDetalhe })
    AlterarStatusPedido(pedido)
  }

  const btIncluir = () => {
    if (rsMaster.dataProgramacao !== "") {
      setOpen(true)
      BuscarDados()
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe a data da Programação!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
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

    clsCrud
      .pesquisar({
        entidade: "ProgramacaoDublagem",
        relations: [
          "detalheProgramacaoDublagens",
          "detalheProgramacaoDublagens.pedido",
        ]
      })
      .then((rsProgramacaoDublagem: Array<any>) => {
        setRsPesquisa(rsProgramacaoDublagem)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <GerenciadorPedido
          detalhe={rsMaster.detalheProgramacaoDublagens}
          setOpenDetalhe={setOpen}
        />
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
            dados={rsMaster.detalheProgramacaoDublagens}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheProgramacaoDublagemInterface) =>
                    onExcluir(rs),
                  toolTip: "Excluir",
                },
              ]}
          />
        </Grid>
      </Paper>
    </>
  )
}