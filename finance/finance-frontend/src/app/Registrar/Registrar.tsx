import { Container, Grid, IconButton, Paper, Tooltip, Box, Avatar, Typography } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useRef, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UserInterface } from '../../Interfaces/sistema/user';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import TermoDeUsoModal from './TermoDeUsoModal';
import TitleBar from '../../Componentes/BarraDeTitulo';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { deepPurple } from '@mui/material/colors';
import { URL_BACKEND } from '../../Utils/Servidor';

export default function Registrar() {


  interface PropsInterface extends UserInterface {
    confirmePassword: string
  }

  const ResetDados: PropsInterface = {
    name: '',
    email: '',
    password: '',
    whatsapp: '',
    confirmePassword: '',
    isActive: true,
    tentativasLogin: 0,
    resetToken: '',
    resetTokenExpires: new Date(),
    termsAccepted: false,
    termsAcceptedAt: new Date(),
    profilePicture: ''
  }
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()

  const { mensagemState, setMensagemState, setUsuarioState, usuarioState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [usuario, setUsuario] = useState<PropsInterface>(ResetDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUsuario((prev: any) => ({
        ...prev,
        profilePicture: file,
      }))
    }
  }

  const isFile = (obj: any): obj is File =>
    obj &&
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.size === 'number' &&
    typeof obj.type === 'string';


  const fotoUrl =
    isFile(usuario.profilePicture)
      ? URL.createObjectURL(usuario.profilePicture)
      : usuario.profilePicture
        ? `${URL_BACKEND}/uploads/users/${usuario.profilePicture}`
        : null;


  const pesquisarID = async (id: string | number): Promise<PropsInterface> => {

    const rs = await clsCrud
      .pesquisar({
        entidade: "User",
        criterio: {
          id: id,
        },
      });
    return rs[0];
  }

  const irPara = useNavigate()
  const btFechar = async () => {
    irPara('/')
    // if (!usuarioState.logado) {
    // } else {
    //   irPara('/dashboard')
    //   setLayoutState({ ...layoutState, titulo: 'Dashboard', pathTitulo: '/dashboard' })
    // }
  }

  const btCancelar = () => {
    setErros({})
    setUsuario(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
    btFechar()
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('name', usuario, erros, retorno, 'Digite um nome para o usuário')
    retorno = validaCampo.naoVazio('password', usuario, erros, retorno, 'A senha não pode ser vázio')
    retorno = validaCampo.eEmail('email', usuario, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', usuario, erros, retorno, false)
    retorno = validaCampo.eTrue('termsAccepted', usuario, erros, retorno, true)
    retorno = validaCampo.naoVazio('confirmePassword', usuario, erros, retorno, 'Confirme a senha')

    if (usuario.password !== usuario.confirmePassword) {
      erros['confirmePassword'] = 'As senhas devem ser iguais'
      retorno = false
    }

    setErros(erros)
    return retorno
  }

  const TemEmail = async (): Promise<boolean> => {

    try {
      const rs = await clsCrud.pesquisar({
        entidade: "User",
        criterio: { email: usuario.email },
        camposLike: ["email"],
      });


      if (rs.length > 0) {
        setMensagemState({
          ...mensagemState,
          titulo: "Atenção",
          exibir: true,
          mensagem: "E-mail já cadastrado!",
          tipo: MensagemTipo.Error,
          exibirBotao: true,
        });
        return false;
      }

      return true;
    } catch (error) {
      setMensagemState({
        ...mensagemState,
        titulo: "Erro de conexão",
        exibir: true,
        mensagem: "Erro na conexão com banco de dados!",
        tipo: MensagemTipo.Error,
        exibirBotao: true,
      });

      return false;
    }
  };

  const exibirMensagem = (titulo: string, mensagem: string, tipo: MensagemTipo) => {
    setMensagemState({
      ...mensagemState,
      titulo,
      exibir: true,
      mensagem,
      tipo,
      exibirBotao: true,
    })
  }

  const executarAcao = async (acao: "incluir" | "editar", mensagemSucesso: string) => {
    try {
      const formData = new FormData();
      formData.append("name", usuario.name);
      formData.append("email", usuario.email);
      formData.append("password", usuario.password);
      formData.append("whatsapp", usuario.whatsapp);
      formData.append("termsAccepted", usuario.termsAccepted.toString());

      if (
        usuario.profilePicture &&
        typeof usuario.profilePicture === "object" &&
        "name" in usuario.profilePicture &&
        "type" in usuario.profilePicture
      ) {
        // É um File (ou parecido com File)
        formData.append("file", usuario.profilePicture as File);
      } else if (typeof usuario.profilePicture === "string") {
        // É um nome de arquivo (string)
        formData.append("profilePicture", usuario.profilePicture);
      }


      const endpoint =
        acao === "incluir"
          ? `${URL_BACKEND}/auth/upload-profile`
          : `${URL_BACKEND}/auth/${usuario.id}`;


      const method = acao === "incluir" ? "POST" : "PATCH";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const rs = await response.json();

      if (rs.ok || response.ok) {
        exibirMensagem("Cadastro", mensagemSucesso, MensagemTipo.Ok);

        // Se for edição, atualize o contexto global com a nova foto
        if (acao === "editar") {
          const novaFoto =
            typeof usuario.profilePicture === "string"
              ? usuario.profilePicture
              : rs.dados?.profilePicture || "";

          setUsuarioState({
            ...usuarioState,
            nomeUsuario: usuario.name,
            emailUsuario: usuario.email,
            fotoUsuario: novaFoto
              ? `${URL_BACKEND}/uploads/users/${novaFoto}`
              : usuarioState.fotoUsuario,
            fotoUsuarioVersao: Date.now(), // Adicionado
          });

        }

        btFechar();
        setLocalState({ action: actionTypes.pesquisando });
      }

    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error);
    }
  }

  const btConfirmar = async () => {

    if (!validarDados()) return;

    if (localState.action === actionTypes.incluindo && (await TemEmail())) {
      await executarAcao("incluir", "Usuário incluído com sucesso!");
    } else if (localState.action === actionTypes.editando) {
      await executarAcao("editar", "Dados alterados com sucesso!");
    }
    irPara('/login')
  }

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }

  useEffect(() => {

    if (!usuarioState.logado) {
      setLocalState({ action: actionTypes.incluindo })
    } else {

      pesquisarID(usuarioState.idUsuario).then((rs) => {
        setLocalState({ action: actionTypes.editando })
        setUsuario(rs)
        setUsuario({
          ...rs,
          confirmePassword: '',
          password: '',
          //profilePicture: rs.profilePicture,
        });
      })
    }
  }, [usuarioState])

  return (
    <>
      <Form method='post' action='/User' >

        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Paper variant="outlined" sx={{ p: 1, bgcolor: '#050516', border: '1px solid #3a3a3a' }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TitleBar
                  title="Cadastro de Usuário"
                  onClose={() => btFechar()}
                  textColor='#fff'
                  backgroundColor='#050516'
                  fontSize='1.5rem'
                />
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} md={12} >
                  <Box
                    ref={(el: any) => (fieldRefs.current[0] = el)}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >

                    <Tooltip title="Clique para alterar a foto">
                      <IconButton onClick={handleImageClick}>
                        <Avatar
                          alt={usuarioState.emailUsuario}
                          src={fotoUrl || undefined}
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: deepPurple[200],
                          }}
                        >
                          {!fotoUrl && (
                            <AccountCircleTwoToneIcon fontSize="large" sx={{ color: "#fff" }} />
                          )}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <InputText
                      label="Nome"
                      setState={setUsuario}
                      dados={usuario}
                      field="name"
                      erros={erros}
                      type="text"
                      onKeyDown={(event: any) => btPulaCampo(event, 2)}
                      corFonte='#fff'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                    <InputText
                      label="E-mail"
                      setState={setUsuario}
                      dados={usuario}
                      field="email"
                      erros={erros}
                      type="email"
                      tipo="text"
                      onKeyDown={(event: any) => btPulaCampo(event, 3)}
                      corFonte='#fff'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                    <InputText
                      label="Whatsapp"
                      setState={setUsuario}
                      dados={usuario}
                      field="whatsapp"
                      erros={erros}
                      type="tel"
                      mask='tel'
                      onKeyDown={(event: any) => btPulaCampo(event, 4)}
                      corFonte='#fff'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                    <Text
                      field="password"
                      label="Senha"
                      dados={usuario}
                      type='password'
                      setState={setUsuario}
                      tipo='pass'
                      erros={erros}
                      onKeyDown={(event: any) => btPulaCampo(event, 5)}
                      corFonte='#fff'
                      autocomplete='password'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                    <Text
                      field="confirmePassword"
                      label="Confirme a Senha"
                      dados={usuario}
                      type='password'
                      setState={setUsuario}
                      tipo='pass'
                      erros={erros}
                      onKeyDown={(event: any) => btPulaCampo(event, 1)}
                      corFonte='#fff'
                      autocomplete='confirmePassword'
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  sx={{
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // mantém os itens colados à esquerda
                    gap: 1, // adiciona espaço entre InputText e o Modal
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InputText
                      label="Aceito"
                      tipo="checkbox"
                      dados={usuario}
                      field="termsAccepted"
                      setState={setUsuario}
                      onKeyDown={(event: any) => btPulaCampo(event, 1)}
                      erros={erros}
                    />
                    <TermoDeUsoModal />
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1, textAlign: 'right' }}>
                  <Tooltip title={'Cancelar'}>
                    <IconButton
                      color="secondary"
                      sx={{ mt: 1, ml: 2 }}
                      onClick={() => btCancelar()}
                    >
                      <CancelRoundedIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                  <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                    <Tooltip title={'Confirmar'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 1, ml: 2 }}
                        onClick={() => btConfirmar()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Container >
      </Form >
    </>
  )
}