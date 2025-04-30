import { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { GlobalContext, GlobalContextInterface } from '../../Context/GlobalContext';
import ApiCls from '../../Services/ApiCls';
import MenuCls from '../../Layout/MenuCls';
import Copyright from '../../Layout/Copyright';
import ComText from '../../Components/Text';


interface LoginInterface {
    login: string
    senha: string
}

export default function Login() {

    const GlobalContexto = (useContext(GlobalContext) as GlobalContextInterface)

    const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface

    const [usuarioState, setUsuarioState] = useState<LoginInterface>({ login: '', senha: '' })

    const [exibirSenhaState, setExibirSenhaState] = useState(false)

    const handleExibirSenha = () => {
        setExibirSenhaState(!exibirSenhaState)
    }

    const clsApi = new ApiCls()

    const dados = {
        "login": "Frank",
        "senha": "123"
    }

    const logar = () => {

        setMensagemState({ ...mensagemState, exibir: true })

        // clsApi.query<any>('/Usuario/AuthenticateUser', 'Login', GlobalContexto.mensagemState, GlobalContexto.setMensagemState).then(rs => {

        //     const clsMenu = new MenuCls(rs.MenuDto)

        //     GlobalContexto.setLoginState({ ...GlobalContexto.loginState, logado: true })
        //     GlobalContexto.setLayoutState({ ...GlobalContexto.layoutState, opcoesMenu: clsMenu.Menu })


        // })
    }
    /*   if (rs.token && rs.token.length > 0) {

           const clsMenu = new MenuCls(rs.MenuDto)

           GlobalContexto.setLoginState({ ...GlobalContexto.loginState, logado: true })
           GlobalContexto.setLayoutState({ ...GlobalContexto.layoutState, opcoesMenu: clsMenu.Menu })
           console.log(JSON.stringify(clsMenu.Menu))
       } else {

           GlobalContexto.setMensagemState({
               ...GlobalContexto.mensagemState,
               exibir: true,
               mensagem: 'Verifique Usuário / Senha',
               tipo: MensagemTipo.Erro
           })
       }
   }).catch((erro) => {

       console.log(erro)
       GlobalContexto.setMensagemState({
           ...GlobalContexto.mensagemState,
           exibir: true,
           mensagem: 'Erro de conexão com o Servidor',
           tipo: MensagemTipo.Erro
       })
   })
}*/
    return (
        <>
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

                            <ComText
                                dados={usuarioState}
                                field='login'
                                label='Usuário'
                                setState={setUsuarioState}
                            //valida='txt'
                            />

                            <ComText
                                dados={usuarioState}
                                field='senha'
                                label='Senha'
                                type={exibirSenhaState ? "text" : "password"}
                                setState={setUsuarioState}
                                iconeEnd={exibirSenhaState ? 'visibility_off' : 'visibility'}
                                onClickIconeEnd={handleExibirSenha}
                            //valida='txt'
                            />

                            <Button variant='contained' onClick={() => logar()} sx={{ width: '100%', mb: 3, mt: 3 }}>Logar</Button>
                            <Copyright />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}
