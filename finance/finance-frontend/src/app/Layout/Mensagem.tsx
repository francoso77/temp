import Alert from '@mui/material/Alert';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Dialog, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import TitleBar from '../../Componentes/BarraDeTitulo';
import CustomButton from '../../Componentes/Button';

export default function Mensagem() {
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface

  const btResposta = (resposta: boolean) => {
    if (mensagemState.cb) {
      fecharJanela()
      mensagemState.cb(resposta)
    }
  }

  const fecharJanela = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }
  const exibirBotao = (): boolean =>
    (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao)
    || (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0)

  const textoBotao = (): string =>
    (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0) ? mensagemState.exibirBotao
      : (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao) ? 'Fechar' : ''

  const darkStyles = {
    backgroundColor: '#121212',
    color: '#ffffff',
  };

  const MontaMensagem = () =>

    <Grid container justifyContent='center' alignItems='center' sx={{ ...darkStyles, border: '1px solid #333' }}>
      <Grid item xs={12} sx={{ textAlign: 'left' }}> <Box>
        <Condicional condicao={mensagemState.titulo.length > 0}>
          <TitleBar
            title={mensagemState.titulo}
            textColor='#ffffff'
            backgroundColor='#121212'
            fontSize='1.5rem'
          />
          <Box sx={{ borderBottom: '1px solid #333' }} />
        </Condicional>
      </Box>
      </Grid>
      <Grid item xs={12} sx={{ padding: 1, textAlign: 'center' }}>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Loading}>
          <CircularProgress />
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Warning && mensagemState.mensagem.length > 0}>
          <Alert severity={'warning'} sx={{ bgcolor: '#121212', }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{mensagemState.mensagem}</Typography>
          </Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Error && mensagemState.mensagem.length > 0}>
          <Alert severity={'error'} sx={{ bgcolor: '#121212' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{mensagemState.mensagem}</Typography>
          </Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Info && mensagemState.mensagem.length > 0}>
          <Alert severity={'info'} sx={{ bgcolor: '#121212' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{mensagemState.mensagem}</Typography>

          </Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Ok && mensagemState.mensagem.length > 0}>
          <Alert severity={'success'} sx={{ bgcolor: '#121212' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>{mensagemState.mensagem}</Typography>

          </Alert>
        </Condicional>
      </Grid>
      <Condicional condicao={exibirBotao()}>
        <Grid item xs={12} sx={{ padding: 1, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'right' }}>
          <Box>
            <Condicional condicao={mensagemState.exibirBotao !== 'SN'}>
              <CustomButton
                bgColor='#333'
                textColor='#ffffff'
                onClick={() => fecharJanela()}
                sx={{ margin: 2, color: 'white' }}>
                {textoBotao()}
              </CustomButton>
            </Condicional>
            <Condicional condicao={mensagemState.exibirBotao === 'SN'}>
              <CustomButton
                bgColor='#1976d2'
                textColor='#000'
                onClick={() => btResposta(true)}
                sx={{ color: 'white' }}>
                Sim
              </CustomButton>
              <CustomButton
                bgColor='#10355a'
                textColor='#000'
                onClick={() => btResposta(false)}
                sx={{ ml: 1, color: 'white' }}>
                Não
              </CustomButton>
            </Condicional>
          </Box>
        </Grid>
      </Condicional>
    </Grid>

  return (
    <Dialog
      fullWidth
      open={mensagemState.exibir}
      PaperProps={{
        sx: {
          ...darkStyles,
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <><MontaMensagem /></>
    </Dialog>
  );
}
