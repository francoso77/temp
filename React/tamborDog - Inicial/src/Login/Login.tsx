import { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { GlobalContext, GlobalContextInterface } from '../Context/GlobalContext';
import MenuCls, { MenuOpcoesInterface } from '../Layout/MenuCls';
import Copyright from '../Layout/Copyright';
import ComText from '../Components/Text';
import { URL_SERVIDOR } from '../Config/Setup';
import { MensagemTipo } from '../Context/MensagemState';


interface LoginInterface {
    usuario: string
    senha: string
    token: string
}

export default function Login() {
    const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
    const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
    const setLoginState = (useContext(GlobalContext) as GlobalContextInterface).setLoginState

    const [usuarioState, setUsuarioState] = useState<LoginInterface>({
        usuario: '',
        senha: '',
        token: ''
    })

    const [exibirSenhaState, setExibirSenhaState] = useState(false)

    const handleExibirSenha = () => {
        setExibirSenhaState(!exibirSenhaState)
    }
    const logar = () => {

        setMensagemState({
            ...mensagemState,
            titulo: 'Processando...',
            mensagem: 'Login autorizado, carregando menu...',
            exibir: true,
            tipo: MensagemTipo.Loading,
            exibirBotao: false,
            cb: null
        })

        let urlMenu = URL_SERVIDOR.concat('/MenuDto')
        let url = URL_SERVIDOR.concat('/usuarios?usuario=')
        url = url.concat(usuarioState.usuario)
        url = url.concat('&senha=')
        url = url.concat(usuarioState.senha)

        setTimeout(() => {

            fetch(url).then(rs => {
                return rs.json()
            }).then((rs: LoginInterface[]) => {

                if (rs.length > 0) {

                    setLoginState({
                        logado: true,
                        usuario: rs[0].usuario,
                        token: rs[0].token
                    })

                    fetch(urlMenu).then(rs => {
                        return rs.json()
                    }).then((rs: MenuOpcoesInterface[]) => {
                        const clsMenu = new MenuCls(rs)
                        setLayoutState({ ...layoutState, opcoesMenu: clsMenu.Menu })
                    })

                } else {
                    setMensagemState({
                        ...mensagemState,
                        exibir: true,
                        mensagem: 'Verifique Usuário / Senha',
                        tipo: MensagemTipo.Error,
                        exibirBotao: true
                    })
                }
            }).catch(() => {
                setMensagemState({
                    ...mensagemState,
                    exibir: true,
                    mensagem: 'Erro de conexão com o Servidor',
                    tipo: MensagemTipo.Error,
                    exibirBotao: true
                })
            }
            )
        }, 1500)
    }

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
                            <img src="img/tamborDogFundo.png" width={150} alt="logotipo da TamborDOG" />
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
                                Tambor DOG
                            </Typography>

                            <ComText
                                dados={usuarioState}
                                field='usuario'
                                label='Usuário'
                                setState={setUsuarioState}
                                autofocus
                            />

                            <ComText
                                dados={usuarioState}
                                field='senha'
                                label='Senha'
                                type={exibirSenhaState ? "text" : "password"}
                                setState={setUsuarioState}
                                iconeEnd={exibirSenhaState ? 'visibility_off' : 'visibility'}
                                onClickIconeEnd={handleExibirSenha}
                                mapKeyPress={[{ key: 'Enter', onKey: logar }]}
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
