import React, { useContext, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import Condicional from '../Condicional/Condicional';
import { PessoaTypes } from '../../types/pessoaTypes';
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
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { GraficoType, GraficoTypes } from '../../types/graficoTypes';


export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  tipo: 'pessoas' | 'dados'
}

interface DatasPesquisa {
  dtInicial: string
  dtFinal: string
}
export default function DialogGraficos(props: SimpleDialogProps) {

  const validaCampo = new ClsValidacao()
  const clsApi = new ClsApi()
  const clsFormatacao = new ClsFormatacao()

  const { onClose, selectedValue, open, tipo } = props

  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const [erros, setErros] = useState({})
  const [rsDatasPesquisa, setRsDatasPesquisa] = useState<DatasPesquisa>({
    dtInicial: '',
    dtFinal: ''
  })
  const [dadosPesquisa, setDadosPesquisa] = useState<Array<any>>([])
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [selectedValueRadio, setSelectedValueRadio] = useState<GraficoType>(GraficoType.mes);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValueRadio(event.target.value as GraficoType);
  };
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

  const handleTipoRadio = () => {
    // setSelectedValueRadio(selectedValueRadio)
  }
  const handleClose = () => {
    onClose(selectedValue);
  }

  const handleListItemClick = (value: string) => {
    onClose(value);
  }

  const btCancelar = () => {

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
      const grupo = selectedValueRadio

      console.log('btConfirmar', dtInicial, dtFinal, grupo)
      const producao = await clsApi.graficos<Array<any>>({
        url: 'graficos',
        method: 'post',
        dtInicial,
        dtFinal,
        grupo,
        mensagem: 'Buscando dados...',
        setMensagemState: setMensagemState
      })
      if (producao) {
        console.log('producao', producao)
      }
    }
  }

  return (
    <>
      <Condicional condicao={tipo === 'pessoas'}>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Escolha o tipo de Pessoa</DialogTitle>
          <List sx={{ pt: 0 }}>
            {PessoaTypes.map((pessoa) => (
              <ListItem disableGutters key={pessoa.descricao}>
                <ListItemButton onClick={() => handleListItemClick(pessoa.idPessoaType)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={pessoa.descricao} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Dialog>
      </Condicional>
      <Condicional condicao={tipo === 'dados'}>
        <Dialog onClose={handleClose} open={open}>
          <Paper sx={{ m: 1, p: 1, textAlign: 'center' }}>
            <DialogTitle>Gráficos de Produção</DialogTitle>
            <FormControl component="fieldset">
              <RadioGroup defaultValue={GraficoType.mes} value={selectedValueRadio} onChange={handleChange}>
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
      </Condicional>
    </>
  );
}