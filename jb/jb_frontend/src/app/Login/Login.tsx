import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Paper, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import ClsValidacao from '../../Utils/ClsValidacao';
import Text from '../../Componentes/Text';
import { Form, useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsApi from '../../Utils/ClsApi';
import Copyright from '../Layout/Copyright';

// const APPLE: string = '/apple.png';
// const FACEBOOK: string = '/facebook.png';
// const GOOGLE: string = '/google.png';

export default function Login() {

  const [erros, setErros] = useState({})
  const [dados, setDados] = useState({ cpf: '', senha: '' })
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const clsApi = new ClsApi()
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

  useEffect(() => {
    const tmpCpf = localStorage.getItem('cpf')
    const tmpSenha = localStorage.getItem('senha')
    if (tmpCpf && tmpSenha) {
      setDados({ ...dados, cpf: tmpCpf, senha: tmpSenha })
      setRememberMe(true)
    }
  })
  const btEntrar = () => {
    // setMensagemState({
    //   ...mensagemState,
    //   titulo: 'Processando...',
    //   mensagem: 'Login autorizado, carregando menu...',
    //   exibir: true,
    //   tipo: MensagemTipo.Loading,
    //   exibirBotao: false,
    //   cb: null
    // })

    if (validarDados()) {

      clsApi.execute<any>({
        url: 'loginUsuario',
        method: 'post',
        cpf: dados.cpf,
        senha: dados.senha,
        mensagem: 'Verificando usuário e senha',
        setMensagemState: setMensagemState
      })
        .then((rs) => {
          if (rs.ok && rs.dados && rs.dados.length > 0) {
            const [usuario, token, tipoUsuario, idUsuario] = rs.dados.split('.')

            contextGlobal.setUsuarioState({
              idUsuario: Number(idUsuario),
              usuario: usuario,
              logado: true,
              token: token,
              tipoUsuario: tipoUsuario,
              idsMenu: tipoUsuario === '0' ? [7] :
                tipoUsuario === '5' ? [1, 5, 6, 9] :
                  tipoUsuario === '2' ? [3, 4, 6, 9] :
                    tipoUsuario === '3' ? [2, 6, 7, 9] :
                      tipoUsuario === '4' ? [2, 7, 8, 9] :
                        [1, 2, 3, 4, 5, 6, 7, 8, 9]
            })

            if (rememberMe) {
              localStorage.setItem('cpf', dados.cpf)
              localStorage.setItem('senha', dados.senha)
            } else {
              localStorage.removeItem('cpf')
              localStorage.removeItem('senha')
            }
            // contextGlobal.setLayoutState({
            //   titulo: 'Dashboard',
            //   tituloAnterior: '',
            //   pathTitulo: '/Dashboard',
            //   pathTituloAnterior: ''
            // })

            //ir para a página inicial

            navegar("/")
          } else {
            setMensagemState({
              ...mensagemState,
              exibir: true,
              tipo: MensagemTipo.Error,
              titulo: 'Validação',
              mensagem: 'Usário ou senha inválido!',
              exibirBotao: true
            })
          }
        }).catch(() => {
          setMensagemState({
            ...mensagemState,
            exibir: true,
            tipo: MensagemTipo.Error,
            titulo: 'Erro de conexão',
            mensagem: 'Não foi possível conectar ao servidor.',
            exibirBotao: true
          })
        })
    }
  }

  return (

    <>
      <Form method='post' action='/Login'>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          height='100vh'
        >
          <Grid item xs={10} sm={8} md={6} lg={4}>
            <Paper>
              <Box
                sx={{ backgroundColor: 'primary.main', padding: 2 }}
                textAlign='center'
              >
                <img src="img/logomarca.png" width={150} alt="JB Textil" />
                <Typography component="p" variant="h6" color="white">
                  Versão
                  <Typography component="span" variant="body1" color="white">
                    &nbsp;1.00 -&nbsp;
                    <Typography component="span" variant="h6" color="white">
                      Release
                      <Typography component="span" variant="body1" color="white">
                        &nbsp;00001/01
                      </Typography>
                    </Typography>
                  </Typography>
                </Typography>
              </Box>
              <Box
                sx={{ backgroundColor: 'white', padding: 2, mx: 5 }}
                textAlign='center'
              >
                <Typography variant="h4" fontFamily='sans-serif' fontWeight='bolder' color="primary.main">
                  JB Textil
                </Typography>

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

                <Text
                  field="senha"
                  label="Senha"
                  tipo='pass'
                  type='password'
                  dados={dados}
                  setState={setDados}
                  erros={erros}
                  mapKeyPress={[{ key: 'Enter', onKey: btEntrar }]}
                />
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <FormControlLabel control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    } label={
                      <Typography variant="caption" display="block" gutterBottom>
                        Lembre-me
                      </Typography>
                    } />
                  </Grid>
                  <Grid item>
                    <FormControlLabel control={<Link href="#" />} onClick={() => navegar('/Usuario')} label={
                      <Typography variant="caption" display="block" gutterBottom>
                        Cadastrar
                      </Typography>
                    } />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant='contained' onClick={() => btEntrar()} sx={{ width: '100%', mt: 1.5 }}>Logar</Button>
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center", mt: 1.5, mb: 2 }}>
                    <Link href="#">Esqueci a senha</Link>
                  </Grid>
                </Grid>
                <Copyright />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Form>
    </>

    // <>
    //   <Form method='post' action='/Login'>
    //     <Grid
    //       container
    //       minHeight="100vh"
    //       justifyContent="center"
    //       alignContent="center"
    //     >
    //       <Grid item xs={12} sm={8} md={5} lg={4}>
    //         <Paper sx={{ padding: 3, margin: 3 }}>
    //           <Grid container>
    //             <Grid item xs={12} sx={{ textAlign: "center" }}>
    //               {/* <img src="./windows11/Wide310x150Logo.scale-400.png" style={{ maxWidth: "100px" }} /> */}
    //             </Grid>
    //             <Grid item xs={12} sx={{ mt: 3 }}>
    //               <Text
    //                 autofocus
    //                 label='CPF'
    //                 mask="000.000.000-00"
    //                 tipo='mask'
    //                 field='cpf'
    //                 dados={dados}
    //                 setState={setDados}
    //                 erros={erros}
    //               />
    //             </Grid>
    //             <Grid item xs={12} sx={{ mt: 3 }}>
    //               <Text
    //                 field="senha"
    //                 label="Senha"
    //                 tipo='pass'
    //                 type='password'
    //                 dados={dados}
    //                 setState={setDados}
    //                 erros={erros}
    //                 mapKeyPress={[{ key: 'Enter', onKey: btEntrar }]}
    //               />
    //             </Grid>
    //             <Grid container alignItems="center" justifyContent="space-between">
    //               <Grid item>
    //                 <FormControlLabel control={<Checkbox />} label={
    //                   <Typography variant="caption" display="block" gutterBottom>
    //                     Lembre-me
    //                   </Typography>
    //                 } />
    //               </Grid>
    //               <Grid item>
    //                 <FormControlLabel control={<Link href="#" />} onClick={() => navegar('/Usuario')} label={
    //                   <Typography variant="caption" display="block" gutterBottom>
    //                     Cadastrar
    //                   </Typography>
    //                 } />
    //               </Grid>
    //             </Grid>
    //             <Grid item xs={12} sx={{ mt: 3 }}>
    //               <Button
    //                 onClick={() => btEntrar()}
    //                 fullWidth
    //                 variant="contained"
    //               >
    //                 Entrar
    //               </Button>
    //             </Grid>
    //             <Grid item xs={12} sx={{ textAlign: "center", mt: 4.5 }}>
    //               <Link>Esqueci a Senha</Link>
    //             </Grid>
    //             <Grid item xs={12} sx={{ textAlign: "center", mt: 4.5 }}>
    //               <Button
    //                 startIcon={<img src={GOOGLE} alt="logotipo da Google" width="50" height="50" />}
    //               >
    //               </Button>
    //               <Button
    //                 startIcon={<img src={FACEBOOK} alt="logotipo do Facebook" width="50" height="50" />}
    //               >
    //               </Button>
    //               <Button
    //                 startIcon={<img src={APPLE} alt="logotipo da Apple" width="50" height="50" />}
    //               >
    //               </Button>
    //             </Grid>
    //           </Grid >
    //         </Paper>
    //       </Grid>
    //     </Grid>
    //   </Form>
    // </>
  )
}