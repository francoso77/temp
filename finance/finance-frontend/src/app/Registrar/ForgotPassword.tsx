// ForgotPassword.tsx
import { useContext, useState } from 'react';
import ClsApi from '../../Utils/ClsApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import { UserInterface } from '../../Interfaces/sistema/user';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { Box, Grid, Paper } from '@mui/material';
import TitleBar from '../../Componentes/BarraDeTitulo';
import Text from '../../Componentes/Text';
import CustomButton from '../../Componentes/Button';
import SendIcon from '@mui/icons-material/Send';
import ClsValidacao from '../../Utils/ClsValidacao';
import { useNavigate } from 'react-router-dom';

export function ForgotPassword() {

    const [dados, setDados] = useState({ email: '' });
    const clsApi: ClsApi = new ClsApi();
    const { usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
    const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
    const clsCrud: ClsCrud = new ClsCrud();
    const [erros, setErros] = useState({});
    const validaCampo: ClsValidacao = new ClsValidacao();
    const irPara = useNavigate()

    const validarDados = (): boolean => {
        let retorno: boolean = true
        let erros: { [key: string]: string } = {}

        retorno = validaCampo.eEmail('email', dados, erros, retorno, false, 'Digite um e-mail valido')

        setErros(erros)
        return retorno
    }

    const verificarEmail = async (): Promise<boolean> => {

        if (!validarDados()) {
            return false;
        }
        const rsEmail: Array<UserInterface> = await clsCrud.pesquisar({
            entidade: "User",
            criterio: { email: dados.email },
        });

        return rsEmail.length > 0;
    };

    const handleSubmit = async () => {
        const emailExiste = await verificarEmail();

        if (emailExiste) {
            const rsForgotPassword = await clsApi.execute<{ ok: boolean; mensagem: string }>({
                method: 'post',
                url: 'auth/forgot-password',
                email: dados.email,
                mensagem: 'Enviando instruções para o e-mail...',
                token: usuarioState.token,
            });
            if (rsForgotPassword.ok) {

                setMensagemState({
                    titulo: 'Redefinição de senha',
                    exibir: true,
                    mensagem: 'Instruções de redefinição de senha enviadas para o e-mail.',
                    tipo: MensagemTipo.Ok,
                    exibirBotao: true,
                    cb: null,
                });
                irPara('/login')
            }
        }
    };


    return (
        <Grid
            container
            justifyContent='center'
            alignItems='center'
            height='90vh'
        >
            <Grid item xs={12} sm={8} md={6} lg={4} sx={{ border: '1px solid #3a3a3a', p: 2, borderRadius: 2 }}>

                <Paper sx={{ bgcolor: 'transparent' }}>

                    <Box
                        textAlign='center'

                    >
                        <TitleBar
                            title="Redefinição de senha"
                            textColor="#fff"
                            backgroundColor="transparent"
                            fontSize="1.75rem"
                            textAlign="center"
                        />
                        <Text
                            corFonte='#fff'
                            autofocus
                            label='E-mail'
                            tipo='text'
                            field='email'
                            dados={dados}
                            setState={setDados}
                            erros={erros}
                            autocomplete='email'
                        />
                    </Box>
                </Paper>
                <Grid item xs={12}>
                    <CustomButton
                        bgColor='#1976d2'
                        textColor='#ffffff'
                        icon={<SendIcon />}
                        onClick={() => handleSubmit()}
                        sx={{ width: '100%', mt: 1.5 }}
                    >
                        Enviar
                    </CustomButton>
                </Grid>
            </Grid>
        </Grid>
    );
}