import Alert from '@mui/material/Alert';
import { GlobalContext, GlobalContextInterface } from '../ContextoGlobal/ContextoGlobal';
import Condicional from '../Componentes/Condicional/Condicional';
import { MensagemTipo } from '../ContextoGlobal/MensagemState';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button, Dialog, Grid, Typography } from '@mui/material';
import { useContext } from 'react';

// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   display: 'flex'
// };

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
    if (mensagemState.cb) {
      mensagemState.cb(true)
    }
  }
  const exibirBotao = (): boolean =>
    (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao)
    || (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0)

  const textoBotao = (): string =>
    (typeof mensagemState.exibirBotao === 'string' && mensagemState.exibirBotao.length > 0) ? mensagemState.exibirBotao
      : (typeof mensagemState.exibirBotao === 'boolean' && mensagemState.exibirBotao) ? 'Fechar' : ''

  const MontaMensagem = () =>

    <Grid container justifyContent='center' alignItems='center' sx={{ margin: 'auto' }}>
      <Grid item xs={12} sx={{ padding: 2, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'left' }}>
        <Box>
          <Condicional condicao={mensagemState.titulo.length > 0}>
            <Typography variant="h6" sx={{ fontWeight: 'bolder' }}>
              {mensagemState.titulo}
            </Typography>
          </Condicional>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ padding: 2, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'center' }}>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Loading}>
          <CircularProgress />
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Warning && mensagemState.mensagem.length > 0}>
          <Alert severity={'warning'}> {mensagemState.mensagem}</Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Error && mensagemState.mensagem.length > 0}>
          <Alert severity={'error'}> {mensagemState.mensagem}</Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Info && mensagemState.mensagem.length > 0}>
          <Alert severity={'info'}> {mensagemState.mensagem}</Alert>
        </Condicional>
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Ok && mensagemState.mensagem.length > 0}>
          <Alert severity={'success'} > {mensagemState.mensagem}</Alert>
        </Condicional>
      </Grid>
      <Condicional condicao={exibirBotao()}>
        <Grid item xs={12} sx={{ padding: 1, border: 'none', borderWidth: '2px', borderColor: 'green', textAlign: 'right' }}>
          <Box>
            <Condicional condicao={mensagemState.exibirBotao !== 'SN'}>
              <Button variant='contained' color='primary' onClick={() => fecharJanela()} sx={{ margin: 2, color: 'white' }}>
                {textoBotao()}
              </Button>
            </Condicional>
            <Condicional condicao={mensagemState.exibirBotao === 'SN'}>
              <Button variant='contained' color='primary' onClick={() => btResposta(true)} sx={{ margin: 2, color: 'white' }}>
                Sim
              </Button>
              <Button variant='contained' color='primary' onClick={() => btResposta(false)} sx={{ margin: 2, color: 'white' }}>
                Não
              </Button>
            </Condicional>
          </Box>
        </Grid>
      </Condicional>
    </Grid>

  return (
    <Dialog
      fullWidth
      open={mensagemState.exibir}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <><MontaMensagem /></>
    </Dialog>
  );
}
