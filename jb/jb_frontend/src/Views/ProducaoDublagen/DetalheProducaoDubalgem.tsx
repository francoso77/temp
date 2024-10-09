import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProducaoDublagemInterface, ProducaoDublagemInterface } from '../../../../jb_backend/src/interfaces/producaoDublagemInterface';
import { SomatorioProducaoDublagemInterface } from './ProducaoDublagem';


interface PropsInterface {
  rsMaster: ProducaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProducaoDublagemInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProducaoDublagemInterface>>,
}


export default function DetalheProducaoDubalgem({ rsMaster, setRsMaster, masterLocalState, setRsSomatorio }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalheProducaoDublagemInterface = {
    idDublagem: 0,
    metros: 0,
  }

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

    setLocalState({ action: actionTypes.editando })
    setDetalheProducaoDublagem(rs)
    setOpen(true)
  }

  const onExcluir = (rs: DetalheProducaoDublagemInterface) => {
    let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = []
    rsMaster.detalheProducaoDublagens.forEach(det => {
      if (det.idDetalheProducaoDublagem !== rs.idDetalheProducaoDublagem) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheProducaoDublagens: tmpDetalhe })
    AtualizaSomatorio(tmpDetalhe)
  }

  const btIncluir = () => {
    if (
      rsMaster.dataProducao !== "" &&
      rsMaster.idPedido !== 0 &&
      rsMaster.idProduto !== 0
    ) {
      setOpen(true)
      // BuscarDados()
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
      AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheProducaoDublagem(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados()) {

      const indice = rsMaster.detalheProducaoDublagens.findIndex(
        (v, i) => v.idDublagem === detalheProducaoDublagem.idDublagem
      )

      let tmpDetalhe: Array<DetalheProducaoDublagemInterface> = [...rsMaster.detalheProducaoDublagens]
      tmpDetalhe[indice] = {
        ...detalheProducaoDublagem,
      }

      setRsMaster({
        ...rsMaster,
        detalheProducaoDublagens: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalheProducaoDublagem(ResetDados)
      setOpen(false)
      AtualizaSomatorio(tmpDetalhe)
    }
  }

  const AtualizaSomatorio = (rs: Array<DetalheProducaoDublagemInterface>) => {

    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {
        total = total + detalhe.metros
      })
      setRsSomatorio({ total: total.toString() })
    }
  }

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
                  textAlign='center'
                  labelAlign='center'
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