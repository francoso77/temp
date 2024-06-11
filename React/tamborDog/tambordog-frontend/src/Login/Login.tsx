import { Button, Checkbox, FormControlLabel, Grid, Link, Paper, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ClsValidacao from '../Utils/ClsValidacao';
import Text from '../Componentes/Text';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../ContextoGlobal/MensagemState';
import { UserInterface } from '../../../tambordog-backend/src/interfaces/userInterface';
import ClsCrud from '../Utils/ClsCrudApi';

const APPLE: string = '/apple.png';
const FACEBOOK: string = '/facebook.png';
const GOOGLE: string = '/google.png';

export default function Login() {

  const [erros, setErros] = useState({})
  const [dados, setDados] = useState({ cpf: '', senha: '' })
  const clsCrud = new ClsCrud()
  const clsValidacao: ClsValidacao = new ClsValidacao()
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let tmpErros: { [key: string]: string } = {}

    retorno = clsValidacao.eCPF("cpf", dados, tmpErros, retorno)
    retorno = clsValidacao.naoVazio("senha", dados, tmpErros, retorno)
    retorno = clsValidacao.tamanho("senha", dados, tmpErros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    setErros(tmpErros)
    return retorno
  }

  const contextGlobal = useContext(GlobalContext) as GlobalContextInterface
  const navegar = useNavigate()

  const btEntrar = () => {

    if (validarDados()) {

      clsCrud
        .pesquisar({
          entidade: "User",
          criterio: {
            cpf: "%".concat(dados.cpf).concat("%"),
          },
          camposLike: ["cpf"],
        })
        .then((rs: Array<UserInterface>) => {
          if (dados.cpf === rs[0].cpf && dados.senha === rs[0].senha) {
            contextGlobal.setUsuarioState({
              usuario: rs[0].idUser ? rs[0].idUser : 'sem id',
              logado: true
            })
            contextGlobal.setLayoutState({
              titulo: 'Etapas Realizadas',
              tituloAnterior: '',
              pathTitulo: '/EtapasRealizadas',
              pathTituloAnterior: ''
            })
            navegar("/EtapasRealizadas")
          } else {
            contextGlobal.setMensagemState({
              ...contextGlobal.mensagemState,
              exibir: true,
              tipo: MensagemTipo.Error,
              titulo: 'Validação',
              mensagem: 'Usário ou senha inválido!',
              exibirBotao: true
            })
          }
        }).catch(() => {
          contextGlobal.setMensagemState({
            ...contextGlobal.mensagemState,
            exibir: true,
            tipo: MensagemTipo.Error,
            titulo: 'Validação',
            mensagem: 'Usário ou senha inválido!',
            exibirBotao: true
          })
          // setMensagemState({
          //   ...mensagemState,
          //   titulo: 'Erro de conexão',
          //   exibir: true,
          //   mensagem: 'Erro na conexão com banco de dados!',
          //   tipo: MensagemTipo.Error,
          //   exibirBotao: true,
          // });
        })
    }
  }

  return (
    <>
      <Grid
        container
        minHeight="100vh"
        justifyContent="center"
        alignContent="center"
      >
        <Grid item xs={12} sm={8} md={5} lg={4}>
          <Paper sx={{ padding: 3, margin: 3 }}>
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <img src="./windows11/Wide310x150Logo.scale-400.png" style={{ maxWidth: "100px" }} />
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Text
                  autofocus
                  label='CPF'
                  mask="000.000.000-00"
                  tipo='mask'
                  field='cpf'
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Text
                  field="senha"
                  label="Senha"
                  tipo='pass'
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                  mapKeyPress={[{ key: 'Enter', onKey: btEntrar }]}
                />
              </Grid>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <FormControlLabel control={<Checkbox />} label={
                    <Typography variant="caption" display="block" gutterBottom>
                      Lembre-me
                    </Typography>
                  } />
                </Grid>
                <Grid item>
                  <FormControlLabel control={<Link href="#" />} onClick={() => navegar('/User')} label={
                    <Typography variant="caption" display="block" gutterBottom>
                      Cadastrar
                    </Typography>
                  } />
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  onClick={() => btEntrar()}
                  fullWidth
                  variant="contained"
                >
                  Entrar
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", mt: 4.5 }}>
                <Link>Esqueci a Senha</Link>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", mt: 4.5 }}>
                <Button
                  startIcon={<img src={GOOGLE} alt="logotipo da Google" width="50" height="50" />}
                >
                </Button>
                <Button
                  startIcon={<img src={FACEBOOK} alt="logotipo do Facebook" width="50" height="50" />}
                >
                </Button>
                <Button
                  startIcon={<img src={APPLE} alt="logotipo da Apple" width="50" height="50" />}
                >
                </Button>
              </Grid>
            </Grid >
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}