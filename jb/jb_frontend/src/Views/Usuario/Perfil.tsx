import { Container, Grid, IconButton, Paper, Typography, Tooltip, Box } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UsuarioInterface } from '../../Interfaces/sistema/usuarioInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';


interface PerfilInterface {
  idUsuario: number,
  nome: string,
  cpf: string,
  email: string
}

const ResetDados: PerfilInterface = {
  idUsuario: 0,
  nome: '',
  cpf: '',
  email: '',
}

export default function Perfil() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { mensagemState, setMensagemState, usuarioState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [erros, setErros] = useState({})
  const [perfil, setPerfil] = useState<PerfilInterface>(ResetDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const pesquisarID = async (id: string | number): Promise<UsuarioInterface> => {

    const rs = await clsCrud
      .pesquisar({
        entidade: "Usuario",
        criterio: {
          idUsuario: id,
        },
      });
    return rs[0];
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setPerfil(ResetDados)
    setErros({})
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Usuário',
      pathTitulo: '/',
      pathTituloAnterior: '/Usuario'
    })

    irPara('/')

  }


  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eCPF('cpf', perfil, erros, retorno, false)
    retorno = validaCampo.naoVazio('nome', perfil, erros, retorno, 'Digite um nome para o usuário')
    retorno = validaCampo.eEmail('email', perfil, erros, retorno, false)
    setErros(erros)
    return retorno
  }

  const TemCPF = async (): Promise<boolean> => {

    try {
      const rs = await clsCrud.pesquisar({
        entidade: "Usuario",
        criterio: { cpf: perfil.cpf },
        camposLike: ["cpf"],
      });


      if (rs.length > 0) {
        setMensagemState({
          ...mensagemState,
          titulo: "Atenção",
          exibir: true,
          mensagem: "CPF já cadastrado!",
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

  const btConfirmar = async () => {
    if (!validarDados() && (await TemCPF())) return;
    try {
      const rs = await clsCrud.incluir({
        entidade: "Usuario",
        criterio: perfil,
        token: usuarioState.token
      })

      if (rs.ok) {
        exibirMensagem("Cadastro", "Dados atualizados com sucesso!", MensagemTipo.Ok)
        btFechar();
      }
    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error)
    }

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


    if (usuarioState.logado) {
      pesquisarID(usuarioState.idUsuario).then((rs) => {
        setPerfil({
          ...rs,
          idUsuario: rs.idUsuario as number,
          nome: rs.nome,
          cpf: rs.cpf,
          email: rs.email,
        })
      })
    }


  }, [usuarioState])

  return (
    <>
      <Form method='post' action='/Perfil'>

        <Container maxWidth="md" sx={{ mt: 1.5 }}>
          <Paper variant="outlined" sx={{ padding: 1 }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography component="h5" variant="h5" align="left">
                  Perfl de Usuário
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <InputText
                    label="Nome"
                    setState={setPerfil}
                    dados={perfil}
                    field="nome"
                    erros={erros}
                    type="text"
                    tipo='uppercase'
                    onKeyDown={(event: any) => btPulaCampo(event, 2)}
                  />

                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    label="CPF"
                    mask="cpf"
                    //onBlur={() => TemCPF()}
                    setState={setPerfil}
                    dados={perfil}
                    field="cpf"
                    erros={erros}
                    type='tel'
                    min={14}
                    onKeyDown={(event: any) => btPulaCampo(event, 3)}
                    autoFocus
                  />

                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                <Box ref={(el: any) => (fieldRefs.current[3] = el)}>

                  <InputText
                    label="E-mail"
                    setState={setPerfil}
                    dados={perfil}
                    field="email"
                    erros={erros}
                    type="email"
                    tipo="text"
                    onKeyDown={(event: any) => btPulaCampo(event, 4)}
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
                <Tooltip title={'Confirmar'}>
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