import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalheProducaoDublagemInterface, DetalhePecaInterface } from '../../../../jb_backend/src/interfaces/producaoDublagemInterface';
import { SomatorioProducaoDublagemInterface } from './ProducaoDublagem';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { DetalhePedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import ComboBox from '../../Componentes/ComboBox';


interface PropsInterface {
  rsMaster: DetalheProducaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<DetalheProducaoDublagemInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProducaoDublagemInterface>>,
  setOpenMetros: React.Dispatch<React.SetStateAction<boolean>>
}


export default function DetalhePeca({ rsMaster, setRsMaster, masterLocalState, setRsSomatorio, setOpenMetros }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsFormatacao = new ClsFormatacao()
  const clsCrud = new ClsCrud()

  const ResetDados: DetalhePecaInterface = {
    idDetalheProducaoDublagem: null,
    metros: 0,
  }

  const [open, setOpen] = useState(false)
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [detalhePeca, setDetalhePeca] = useState<DetalhePecaInterface>(ResetDados)

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

    retorno = validaCampo.naoVazio('metros', detalhePeca, erros, retorno, 'Informe a metragem')

    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalhePecaInterface, indice: number) => {

    setLocalState({ action: actionTypes.editando })
    setDetalhePeca(rs)
    setOpen(true)
  }

  const onExcluir = (rs: DetalhePecaInterface) => {
    let tmpDetalhe: Array<DetalhePecaInterface> = []

    rsMaster.detalhePecas.forEach(det => {
      if (det.idDetalhePeca !== rs.idDetalhePeca) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalhePecas: tmpDetalhe })
    //AtualizaSomatorio(tmpDetalhe)
  }

  const btIncluir = () => {
    setOpen(true)
    // BuscarDados()
    setDetalhePeca(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalhePeca(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const btConfirmaInclusao = async () => {

    if (validarDados()) {

      let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalhePecas]
      tmpDetalhe.push({
        idDetalheProducaoDublagem: rsMaster.idDetalheProducaoDublagem as number,
        metros: detalhePeca.metros,
      })

      setRsMaster({
        ...rsMaster, detalhePecas:
          [
            ...rsMaster.detalhePecas,

            {
              idDetalheProducaoDublagem: rsMaster.idDetalheProducaoDublagem as number,
              metros: detalhePeca.metros,
            }
          ]
      })
      //AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalhePeca(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados()) {

      const indice = rsMaster.detalhePecas.findIndex(
        (v, i) => v.idDetalhePeca === detalhePeca.idDetalhePeca
      )

      let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalhePecas]
      tmpDetalhe[indice] = {
        ...detalhePeca,
      }

      setRsMaster({
        ...rsMaster,
        detalhePecas: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalhePeca(ResetDados)
      setOpen(false)
      //AtualizaSomatorio(tmpDetalhe)
    }
  }

  const AtualizaSomatorio = (rs: Array<DetalheProducaoDublagemInterface>) => {

    // let total: number = 0

    // if (rs) {
    //   rs.forEach((detalhe) => {
    //     total = total + detalhe.metros
    //   })
    //   setRsSomatorio({ total: total.toString() })
    // }
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
              Item
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
                <InputText
                  tipo='currency'
                  scale={2}
                  label="Metros"
                  dados={detalhePeca}
                  field="metros"
                  setState={setDetalhePeca}
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
            dados={rsMaster.detalhePecas}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "edit",
                  onAcionador: (rs: DetalhePecaInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalhePecaInterface) =>
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