// ForgotPassword.tsx
import { useContext, useState } from 'react';
import ClsApi from '../../Utils/ClsApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import { UserInterface } from '../../../../finance-backend/src/interfaces/sistema/user';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { Grid } from '@mui/material';
import TitleBar from '../../Componentes/BarraDeTitulo';
import ClsValidacao from '../../Utils/ClsValidacao';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const clsApi: ClsApi = new ClsApi();
    const { usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
    const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
    const clsCrud: ClsCrud = new ClsCrud();
    const [erros, setErros] = useState({});

    const validarDados = () => {
        let retorno: boolean = true
        let erros: { [key: string]: string } = {}
        const regExpEmail: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!regExpEmail.test(email)) {
            setErros(erros)
            return retorno
        }
    }

    const verificarEmail = async (): Promise<boolean> => {

        if (!validarDados()) {
            return false;
        }
        const rsEmail: Array<UserInterface> = await clsCrud.pesquisar({
            entidade: "User",
            criterio: { email: email },
        });

        return rsEmail.length > 0;
    };

    const handleSubmit = async () => {
        const emailExiste = await verificarEmail();

        if (emailExiste) {
            const rsForgotPassword = await clsApi.execute<{ ok: boolean; mensagem: string }>({
                method: 'post',
                url: 'auth/forgot-password',
                email: email,
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
            }
        }
    };


    return (
        <Grid
            container
            spacing={2}
            sx={{
                // Removed minHeight: '100vh' to prevent it from occupying the full screen height
                height: 'fit-content', // Make the height fit its content
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #3a3a3a',
                borderRadius: '10px',
                // Added margin to center the grid with a smaller size
                margin: 'auto',
                padding: '20px', // Add some padding inside the bordered area
                boxSizing: 'border-box', // Include padding in the element's total width and height
                // Optional: You can set a maxWidth to the container itself if you want a global limit
                maxWidth: '600px', // Example: limiting the maximum width of the bordered grid
            }}
        >
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <TitleBar
                    title="Redefinição de senha"
                    textColor="#fff"
                    backgroundColor="#050516"
                    fontSize="1.75rem"
                    textAlign="center"
                />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* INPUT */}
                    <Grid item xs={12}>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Digite seu e‑mail"
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: 'transparent',
                                color: '#f0f0f0',
                                border: '1px solid #666',
                                borderRadius: 4,
                                outline: 'none',
                            }}
                        />
                    </Grid>

                    {/* BOTÃO */}
                    <Grid item xs={12}>
                        <button
                            onClick={handleSubmit}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'transparent',
                                color: '#f0f0f0',
                                border: '1px solid #666',
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = '#222')}
                            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            Enviar
                        </button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}