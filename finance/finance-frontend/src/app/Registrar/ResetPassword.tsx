// ForgotPassword.tsx
import { useContext, useState } from 'react';
import ClsApi from '../../Utils/ClsApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { Box, Grid, Paper } from '@mui/material';
import TitleBar from '../../Componentes/BarraDeTitulo';
import Text from '../../Componentes/Text';
import CustomButton from '../../Componentes/Button';
import SendIcon from '@mui/icons-material/Send';
import ClsValidacao from '../../Utils/ClsValidacao';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';

export function ResetPassword() {
    const [dados, setDados] = useState({ newPassword: '', confirmPassword: '' });
    const clsApi: ClsApi = new ClsApi();
    const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
    const [erros, setErros] = useState({});
    const validaCampo: ClsValidacao = new ClsValidacao();
    const irPara = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const validarDados = (): boolean => {
        let retorno: boolean = true
        let erros: { [key: string]: string } = {}

        retorno = validaCampo.naoVazio('newPassword', dados, erros, retorno, 'A senha não pode ser vázio')
        retorno = validaCampo.tamanho("newPassword", dados, erros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
        retorno = validaCampo.naoVazio('confirmPassword', dados, erros, retorno, 'A senha não pode ser vázio')
        retorno = validaCampo.tamanho("confirmPassword", dados, erros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")

        if (dados.newPassword !== dados.confirmPassword) {
            erros['confirmPassword'] = 'As senhas devem ser iguais'
            retorno = false
        }
        setErros(erros)
        return retorno
    }

    const handleSubmit = async () => {

        if (!validarDados()) return

        const rsForgotPassword = await clsApi.execute<{ ok: boolean; mensagem: string }>({
            method: 'post',
            url: 'auth/reset-password',
            newPassword: dados.newPassword,
            token: token ?? '',
        });
        if (rsForgotPassword.ok) {

            console.log(rsForgotPassword.mensagem)

            setMensagemState({
                titulo: 'Redefinição de senha',
                exibir: true,
                mensagem: 'Senha redefinida!',
                tipo: MensagemTipo.Ok,
                exibirBotao: true,
                cb: null,
            });
            irPara('/login')
        }
    };


    // useEffect(() => {
    //     const url = new URL(window.location.href);
    //     setToken(url.searchParams.get('token') || '');
    // }, []);

    return (
        <Form method='post' onSubmit={handleSubmit}>
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
                                title="Nova Senha"
                                textColor="#fff"
                                backgroundColor="transparent"
                                fontSize="1.75rem"
                                textAlign="center"
                            />
                            <Text
                                field="newPassword"
                                label="Senha"
                                dados={dados}
                                type='password'
                                setState={setDados}
                                tipo='pass'
                                erros={erros}
                                corFonte='#fff'
                                autocomplete='new-password'
                            />
                            <Text
                                field="confirmPassword"
                                label="Confirme a Senha"
                                dados={dados}
                                type='password'
                                setState={setDados}
                                tipo='pass'
                                erros={erros}
                                corFonte='#fff'
                                autocomplete='confirmPassword'
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
                            Alterar Senha
                        </CustomButton>
                    </Grid>
                </Grid>
            </Grid>
        </Form>
    );
}