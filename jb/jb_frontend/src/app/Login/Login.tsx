import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import ClsValidacao from '../../Utils/ClsValidacao';
import Text from '../../Componentes/Text';
import { Form, useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import ClsApi from '../../Utils/ClsApi';
import Copyright from '../Layout/Copyright';
import MenuCls, { MenuOpcoesInterface } from '../Layout/ClsMenu';
import { RespostaPadraoInterface } from '../../../../jb_backend/src/interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../../../jb_backend/src/interfaces/loginIterface';
import { UsuarioType } from '../../types/usuarioTypes';


export default function Login() {

  const [erros, setErros] = useState({})
  const [dados, setDados] = useState({ cpf: '007.323.026-09', senha: 'teste123' })
  const clsValidacao: ClsValidacao = new ClsValidacao()
  const { mensagemState, setMensagemState, layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const contextGlobal = useContext(GlobalContext) as GlobalContextInterface
  const clsApi = new ClsApi()
  const navegar = useNavigate()

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let tmpErros: { [key: string]: string } = {}

    retorno = clsValidacao.eCPF("cpf", dados, tmpErros, retorno)
    retorno = clsValidacao.naoVazio("senha", dados, tmpErros, retorno)
    retorno = clsValidacao.tamanho("senha", dados, tmpErros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    setErros(tmpErros)
    return retorno
  }



  const btEntrar = () => {

    if (validarDados()) {


      clsApi.execute<RespostaPadraoInterface<LoginInterface>>({
        url: 'loginUsuario',
        method: 'post',
        cpf: dados.cpf,
        senha: dados.senha,
        mensagem: 'Verificando usuário e senha',
        setMensagemState: setMensagemState
      })
        .then((rs) => {
          if (rs.ok && rs.dados) {

            contextGlobal.setUsuarioState({
              idUsuario: rs.dados.idUsuario,
              nomeUsuario: rs.dados.nomeUsuario,
              logado: true,
              token: rs.dados.token,
              tipoUsuario: rs.dados.tipoUsuario,
              idsMenu: rs.dados.tipoUsuario === UsuarioType.default ? [7] :
                rs.dados.tipoUsuario === UsuarioType.vendedor ? [1, 5, 6, 10] :
                  rs.dados.tipoUsuario === UsuarioType.estoquistaMalharia ? [3, 4, 6, 10] :
                    rs.dados.tipoUsuario === UsuarioType.estoquistaDublagem ? [2, 6, 7, 9, 10] :
                      rs.dados.tipoUsuario === UsuarioType.producaoDublagem ? [2, 7, 8, 10] :
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              permissoes: rs.dados.permissoes
            })

            const MENU: Array<MenuOpcoesInterface> = [
              {
                id: '1',
                parentId: null,
                descricao: 'Cadastros',
                path: '',
                icon: 'app_registration_outlined',
                permitido: Object.entries(rs.dados.permissoes).some(([key, value]) => value.PERMISSOES.MANUTENCAO),
                filhos: []
              },
              {
                id: '2',
                parentId: '1',
                descricao: 'Cores',
                path: '/Cor',
                icon: 'color_lens',
                filhos: [],
                permitido: rs.dados.permissoes.COR.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '3',
                parentId: '1',
                descricao: 'Estrutura de Produtos',
                path: '/Estrutura',
                icon: 'auto_awesome_motion_outlined',
                filhos: [],
                permitido: rs.dados.permissoes.ESTRUTURA.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '4',
                parentId: '1',
                descricao: 'Máquinas Teares',
                path: '/Maquina',
                icon: 'miscellaneous_services',
                filhos: [],
                permitido: rs.dados.permissoes.MAQUINA.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '5',
                parentId: '1',
                descricao: 'Pessoas',
                path: '/Pessoa',
                icon: 'groups_rounded',
                filhos: [],
                permitido: rs.dados.permissoes.PESSOA.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '6',
                parentId: '1',
                descricao: 'Prazo de Entrega',
                path: '/PrazoEntrega',
                icon: 'calendar_month_rounded',
                filhos: [],
                permitido: rs.dados.permissoes.PRAZO.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '7',
                parentId: '1',
                descricao: 'Produtos',
                path: '/Produto',
                icon: 'category_rounded',
                filhos: [],
                permitido: rs.dados.permissoes.PRODUTO.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '8',
                parentId: '1',
                descricao: 'Unidades de Medidas',
                path: '/UnidadeMedida',
                icon: 'square_foot',
                filhos: [],
                permitido: rs.dados.permissoes.UNIDADE_MEDIDA.PERMISSOES.MANUTENCAO.length > 0,
              },
              {
                id: '9',
                parentId: null,
                descricao: 'Sistema',
                path: '',
                icon: 'settings_outlined',
                permitido: true,
                filhos: []
              },
              {
                id: '10',
                parentId: '9',
                descricao: 'Grupos de Usuários',
                path: '/GruposUsuarios',
                icon: 'people_alt_outlined',
                filhos: [],
                permitido: true,
              },
              {
                id: '11',
                parentId: '9',
                descricao: 'Usuários',
                path: '/Usuarios',
                icon: 'person_outline_outlined',
                filhos: [],
                permitido: true,
              }
            ]

            const clsMenu = new MenuCls(MENU)
            setLayoutState({ ...layoutState, opcoesMenu: clsMenu.Menu })
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
          navegar("/login")
        })
    }

    //console.log('usuario', idUsuario)

    // clsApi.execute<any>({
    //   url: 'permissoesUsuario',
    //   token: token,
    //   method: 'post',
    //   mensagem: 'Buscando permissões do usuário...',
    //   setMensagemState: setMensagemState
    // }).then((rsPermissoes: PermissoesTypeInterface) => {
    //   console.log('permissoes', rsPermissoes)

    //   const clsMenu = new MenuCls()

    //   setLayoutState({ ...layoutState, opcoesMenu: clsMenu.Menu })

    //   console.log('Menu', clsMenu.Menu)
    //   navegar("/")

    //   }).catch(() => {
    //     setMensagemState({
    //       ...mensagemState,
    //       exibir: true,
    //       tipo: MensagemTipo.Error,
    //       titulo: 'Erro de conexão',
    //       mensagem: 'Não foi possível conectar ao servidor.',
    //       exibirBotao: true
    //     })
    //     navegar("/login")
    //   })


    // } else {
    //   setMensagemState({
    //     ...mensagemState,
    //     exibir: true,
    //     tipo: MensagemTipo.Error,
    //     titulo: 'Validação',
    //     mensagem: 'Usário ou senha inválido!',
    //     exibirBotao: true
    //   })
    // }
    //     }).catch(() => {
    //       setMensagemState({
    //         ...mensagemState,
    //         exibir: true,
    //         tipo: MensagemTipo.Error,
    //         titulo: 'Erro de conexão',
    //         mensagem: 'Não foi possível conectar ao servidor.',
    //         exibirBotao: true
    //       })
    //     })
    // }
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
                  {/* <Grid item>
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
                  </Grid> */}
                  {/* <Grid item>
                    <FormControlLabel control={<Link href="#" />} onClick={() => navegar('/Usuario')} label={
                      <Typography variant="caption" display="block" gutterBottom>
                        Cadastrar
                      </Typography>
                    } />
                  </Grid> */}
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
  )
}



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