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

export default function Perfil() {

  interface PropsInterface {
    id: string,
    name: string,
    email: string,
    whatsapp: string,
    profilePicture: string
  }

  const ResetDados: PropsInterface = {
    id: '',
    name: '',
    email: '',
    whatsapp: '',
    profilePicture: ''
  }
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()

  const { mensagemState, setMensagemState, setUsuarioState, usuarioState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({})
  const [perfil, setPerfil] = useState<PropsInterface>(ResetDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPerfil((prev: any) => ({
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
    isFile(perfil.profilePicture)
      ? URL.createObjectURL(perfil.profilePicture)
      : perfil.profilePicture
        ? `${URL_BACKEND}/uploads/users/${perfil.profilePicture}`
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
    setErros({})
    setPerfil(ResetDados)
    irPara('/dashboard')
    setLayoutState({ ...layoutState, titulo: 'Dashboard', pathTitulo: '/dashboard' })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('name', perfil, erros, retorno, 'Digite um nome para o usuário')
    retorno = validaCampo.eEmail('email', perfil, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', perfil, erros, retorno, false)


    setErros(erros)
    return retorno
  }

  const TemEmail = async (): Promise<boolean> => {

    try {
      const rs = await clsCrud.pesquisar({
        entidade: "User",
        criterio: { email: perfil.email },
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

  const executarAcao = async () => {

    setMensagemState({
      titulo: "Verificando dados para o cadastro...",
      exibir: true,
      mensagem: "",
      tipo: MensagemTipo.Loading,
      exibirBotao: false,
      cb: null
    })

    try {
      const formData = new FormData();
      formData.append("name", perfil.name);
      formData.append("email", perfil.email);
      formData.append("whatsapp", perfil.whatsapp);

      if (
        perfil.profilePicture &&
        typeof perfil.profilePicture === "object" &&
        "name" in perfil.profilePicture &&
        "type" in perfil.profilePicture
      ) {
        // É um File (ou parecido com File)
        formData.append("file", perfil.profilePicture as File);
      } else if (typeof perfil.profilePicture === "string") {
        // É um nome de arquivo (string)
        formData.append("profilePicture", perfil.profilePicture);
      }


      const endpoint = `${URL_BACKEND}/auth/${perfil.id}`;
      const method = "PATCH";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const rs = await response.json();
      console.log('rs', rs);

      if (rs.ok || response.ok) {
        setMensagemState({
          ...mensagemState,
          exibir: false,
        })

        btFechar();
      }

    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error);
    }
  }

  const btConfirmar = async () => {
    if (!validarDados() && (await TemEmail())) return;
    await executarAcao();
    irPara('/dashboard')
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

    pesquisarID(usuarioState.idUsuario).then((rs) => {
      if (rs) {
        setPerfil((prev: any) => ({
          ...prev,
          id: rs.id,
          name: rs.name,
          email: rs.email,
          whatsapp: rs.whatsapp,
          profilePicture: rs.profilePicture
        }))
      }

    })
  }, [usuarioState])

  return (
    <>
      <Form method='post' action='/User' >

        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Paper variant="outlined" sx={{ p: 1, bgcolor: '#050516', border: '1px solid #3a3a3a' }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TitleBar
                  title="Perfil de Usuário"
                  onClose={() => btFechar()}
                  textColor='#fff'
                  backgroundColor='#050516'
                  fontSize='1.5rem'
                />
              </Grid>
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
                    setState={setPerfil}
                    dados={perfil}
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
                    setState={setPerfil}
                    dados={perfil}
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
                    setState={setPerfil}
                    dados={perfil}
                    field="whatsapp"
                    erros={erros}
                    type="tel"
                    mask='tel'
                    onKeyDown={(event: any) => btPulaCampo(event, 4)}
                    corFonte='#fff'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1, textAlign: 'right' }}>
                <Tooltip title={'Cancelar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 1, ml: 2 }}
                    onClick={() => btFechar()}
                  >
                    <CancelRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Alterar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 1, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper >
        </Container >
      </Form >
    </>
  )
}