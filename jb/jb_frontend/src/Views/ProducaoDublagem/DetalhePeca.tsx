import { Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { DetalhePecaInterface, ProducaoDublagemInterface } from '../../Interfaces/producaoDublagemInterface';
import { SomatorioProducaoDublagemInterface } from './ProducaoDublagem';


interface PropsInterface {
  indiceEdicao: number
  rsMaster: ProducaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProducaoDublagemInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioProducaoDublagemInterface>>,
  setOpenMetros: React.Dispatch<React.SetStateAction<boolean>>
}


export default function DetalhePeca({ indiceEdicao, rsMaster, setRsMaster, masterLocalState, setRsSomatorio, setOpenMetros }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalhePecaInterface = {
    idDetalheProducaoDublagem: null,
    metros: 0,
  }

  const [open, setOpen] = useState(false)
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [detalhePeca, setDetalhePeca] = useState<DetalhePecaInterface>(ResetDados)
  const inputRef = useRef<HTMLInputElement>(null);

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Metros',
      alinhamento: 'center',
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

  const onExcluir = (rs: DetalhePecaInterface, indice: number) => {
    let tmpDetalhe: Array<DetalhePecaInterface> = []

    rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.forEach((det, i) => {
      if (i !== indice) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({
      ...rsMaster,
      detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
        index === indiceEdicao
          ? { ...item, detalhePecas: tmpDetalhe }
          : item
      )
    })
  }

  const btIncluir = () => {
    setOpen(true)
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

      let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas]

      tmpDetalhe.push({
        idDetalheProducaoDublagem: rsMaster.detalheProducaoDublagens[indiceEdicao].idDetalheProducaoDublagem as number,
        metros: detalhePeca.metros,
      })

      setRsMaster({
        ...rsMaster,
        detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
          index === indiceEdicao
            ? { ...item, detalhePecas: tmpDetalhe }
            : item
        )
      })

      setLocalState({ action: actionTypes.pesquisando })
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {
    if (validarDados()) {

      const indice = rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas.findIndex(
        (v, i) => v.idDetalhePeca === detalhePeca.idDetalhePeca
      )

      let tmpDetalhe: Array<DetalhePecaInterface> = [...rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas]
      tmpDetalhe[indice] = {
        ...detalhePeca,
      }

      setRsMaster({
        ...rsMaster,
        detalheProducaoDublagens: rsMaster.detalheProducaoDublagens.map((item, index) =>
          index === indiceEdicao
            ? { ...item, detalhePecas: tmpDetalhe }
            : item
        )
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalhePeca(ResetDados)
      setOpen(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
                erros={erros}
                onFocus={(e) => e.target.select()}
                textAlign='center'
                labelAlign='center'
                inputRef={inputRef}
                autoFocus
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
      <Paper sx={{ m: 0, p: 1 }}>
        <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Condicional condicao={localState.action !== actionTypes.excluindo}>
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
            colunaSoma={['metros']}
            temTotal={true}
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheProducaoDublagens[indiceEdicao].detalhePecas}
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
                  onAcionador: (rs: DetalhePecaInterface, indice: number) =>
                    onExcluir(rs, indice),
                  toolTip: "Excluir",
                },
              ]}
          />
        </Grid>
      </Paper>
    </>
  )
}