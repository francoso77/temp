import React, { useContext, useRef, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Box, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import InputText from '../InputText';
import ClsValidacao from '../../Utils/ClsValidacao';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ClsApi from '../../Utils/ClsApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { GraficoType } from '../../types/graficoTypes';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';


export interface SimpleDialogProps {
  setDados: React.Dispatch<React.SetStateAction<any[]>>
  setLocalState: React.Dispatch<React.SetStateAction<ActionInterface>>
  clickFechar: () => void
  setSelectedValueRadio: React.Dispatch<React.SetStateAction<GraficoType>>
}

interface DatasPesquisa {
  dtInicial: string
  dtFinal: string
}
export default function DialogGraficos(props: SimpleDialogProps) {
  const { setDados, setLocalState, clickFechar, setSelectedValueRadio } = props

  const validaCampo = new ClsValidacao()
  const clsApi = new ClsApi()

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({})
  const [rsDatasPesquisa, setRsDatasPesquisa] = useState<DatasPesquisa>({ dtInicial: '', dtFinal: '' })
  const [selectedRadio, setSelectedRadio] = useState<GraficoType>(GraficoType.mes);
  const [open, setOpen] = useState(true)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value as GraficoType)
    setSelectedValueRadio(event.target.value as GraficoType)
  }

  const MensagemErro = (erro: string) => {
    setMensagemState({
      titulo: 'Erro...',
      exibir: true,
      mensagem: erro,
      tipo: MensagemTipo.Error,
      exibirBotao: true,
      cb: null
    })
  }
  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index]
      if (nextField) {
        const input = nextField.querySelector('input')
        if (input) {
          input.focus()
        }
      }
    }
  }

  const btCancelar = () => {
    clickFechar()
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dtInicial', rsDatasPesquisa, erros, retorno)
    retorno = validaCampo.eData('dtFinal', rsDatasPesquisa, erros, retorno)

    setErros(erros)
    return retorno
  }

  const validarDatas = (): boolean => {
    let retorno: boolean = true
    if (rsDatasPesquisa.dtFinal >= rsDatasPesquisa.dtInicial) {
      retorno = true
    } else {
      retorno = false
      MensagemErro('Data final menor que data inicial')
    }
    return retorno
  }
  const btConfirmar = async () => {
    if (validarDados() && validarDatas()) {

      const dtInicial = rsDatasPesquisa.dtInicial
      const dtFinal = rsDatasPesquisa.dtFinal
      const grupo = selectedRadio

      const producao = await clsApi.execute<Array<any>>({
        url: 'graficos',
        method: 'post',
        dtInicial,
        dtFinal,
        grupo,
        mensagem: 'Buscando dados...',
        setMensagemState: setMensagemState
      })
      if (producao) {
        setLocalState({ action: actionTypes.pesquisando })
        setDados(producao)
        setOpen(!open)
      }
    }
  }

  return (
    <>
      <Dialog open={open}>
        <Paper sx={{ m: 1, p: 1, textAlign: 'center' }}>
          <DialogTitle>Gráficos de Produção</DialogTitle>
          <FormControl component="fieldset">
            <RadioGroup value={selectedRadio} onChange={handleChange}>
              {Object.entries(GraficoType).map(([key, value]) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box>
            <Paper variant="outlined"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
                p: 1,
                backgroundColor: '#3c486b'
              }}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'white' }}>
                  Período
                </Typography>
              </Grid>
            </Paper>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={6} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <InputText
                    type='tel'
                    tipo="date"
                    label="Início"
                    dados={rsDatasPesquisa}
                    field="dtInicial"
                    setState={setRsDatasPesquisa}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                    textAlign='center'
                    labelAlign='center'
                    autoFocus
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <InputText
                    type='tel'
                    tipo="date"
                    label="Fim"
                    dados={rsDatasPesquisa}
                    field="dtFinal"
                    setState={setRsDatasPesquisa}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                    textAlign='center'
                    labelAlign='center'
                  />
                </Box>
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
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Dialog>
    </>
  );
}