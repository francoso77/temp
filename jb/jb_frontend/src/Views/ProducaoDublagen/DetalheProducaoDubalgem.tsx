import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { StatusPedidoItemType } from '../../types/statusPedidoItemTypes';
import InputCalc from '../../Componentes/InputCalc';
// import { SomatorioPedidoInterface } from './ProducaoDublagem';
import { EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { DetalheProducaoDublagemInterface, ProducaoDublagemInterface } from '../../../../jb_backend/src/interfaces/producaoDublagemInterface';
import { TipoColagemType } from '../../../../jb_backend/src/types/tipoColagemTypes';


interface PropsInterface {
  rsMaster: ProducaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProducaoDublagemInterface>>,
  masterLocalState: ActionInterface,
  // setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioPedidoInterface>>,
}


export default function DetalheProducaoDubalgem({ rsMaster, setRsMaster, masterLocalState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheProducaoDublagemInterface = {
    idDublagem: 0,
    metros: 0,
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [erros, setErros] = useState({});
  const [detalheProducaoDublagem, setDetalheProducaoDublagem] = useState<DetalheProducaoDublagemInterface>(ResetDados);

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Metros',
      alinhamento: 'right',
      campo: 'metros',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
  ]

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('metros', detalheProducaoDublagem, erros, retorno, 'maior que 0')

    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalheProducaoDublagemInterface, indice: number) => {

    // if (rs.statusItem === 1) {
    //   setLocalState({ action: actionTypes.editando })
    //   setIndiceEdicao(indice)
    //   setDetalhePedido(rs)
    //   setOpen(true)
    // } else {
    //   setMensagemState({
    //     titulo: 'Atenção',
    //     exibir: true,
    //     mensagem: 'Item em produção, não pode ser alterado!',
    //     tipo: MensagemTipo.Error,
    //     exibirBotao: true,
    //     cb: null
    //   })
    // }
  }

  const onExcluir = (rs: DetalheProducaoDublagemInterface) => {
    // if (rs.statusItem === 1) {

    //   let tmpDetalhe: Array<DetalhePedidoInterface> = []
    //   rsMaster.detalhePedidos.forEach(det => {
    //     if (det.idDetalhePedido !== rs.idDetalhePedido) {
    //       tmpDetalhe.push(det)
    //     }
    //   })
    //   setRsMaster({ ...rsMaster, detalhePedidos: tmpDetalhe })
    //   AtualizaSomatorio(tmpDetalhe)
    // } else {
    //   setMensagemState({
    //     titulo: 'Atenção',
    //     exibir: true,
    //     mensagem: 'Item em produção, não pode ser alterado!',
    //     tipo: MensagemTipo.Error,
    //     exibirBotao: true,
    //     cb: null
    //   })
    // }
  }

  const btIncluir = () => {
    if (
      rsMaster.dataProducao !== "" &&
      rsMaster.idPedido !== 0 &&
      rsMaster.idProduto !== 0 
    ) {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalheProducaoDublagem(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados da Produção!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheProducaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const btConfirmaInclusao = async () => {

    if (validarDados()) {
      let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = [...rsMaster.detalheProducaoDublagens]
      tmpDetalhe.push({
        idDublagem: rsMaster.idDublagem as number,
        metros: detalheProducaoDublagem.metros,

      })
      setRsMaster({
        ...rsMaster, detalheProducaoDublagens:
          [
            ...rsMaster.detalheProducaoDublagens,

            {
              idDublagem: rsMaster.idDublagem as number,
              metros: detalheProducaoDublagem.metros,
            }
          ]
      })
      // AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheProducaoDublagem(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    // if (validarDados()) {

    //   let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = [...rsMaster.detalheProducaoDublagens]
    //   tmpDetalhe[indiceEdicao] = { ...detalheProducaoDublagem, metros: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalhePedido.idProduto)] } }

    //   setRsMaster({
    //     ...rsMaster,
    //     detalhePedidos: [...tmpDetalhe]
    //   })
    //   setLocalState({ action: actionTypes.pesquisando })
    //   setDetalhePedido(ResetDados)
    //   setOpen(false)
    //   AtualizaSomatorio(tmpDetalhe)
    // }
  }

  const AtualizaSomatorio = (rs: Array<DetalhePedidoInterface>) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPedida
        total = total + (detalhe.qtdPedida * detalhe.vrUnitario)
      })
      // setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const BuscarDados = () => {
    // clsCrud
    //   .pesquisar({
    //     entidade: "Produto",
    //     campoOrder: ["nome"],
    //   })
    //   .then((rsProdutos: Array<ProdutoInterface>) => {
    //     setRsProduto(rsProdutos)
    //   })

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
              Item do Corte
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Metros"
                    dados={detalheProducaoDublagem}
                    field="metros"
                    setState={setDetalheProducaoDublagem}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
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
        </Condicional>
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
                  icone: "edit",
                  onAcionador: (rs: DetalheProducaoDublagemInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheProducaoDublagemInterface) =>
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