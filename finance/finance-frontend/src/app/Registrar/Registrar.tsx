import { Container, Grid, IconButton, Paper, Tooltip, Box } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useRef, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UserInterface } from '../../../../finance-backend/src/interfaces/sistema/user';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TermoDeUsoModal from './TermoDeUsoModal';
import TitleBar from '../../Componentes/BarraDeTitulo';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


export default function Registrar() {

  interface PesquisaInterface {
    itemPesquisa: string
  }

  interface PropsInterface extends UserInterface {
    confirmePassword: string
  }



  const ResetDados: PropsInterface = {
    name: '',
    email: '',
    password: '',
    confirmePassword: '',
    isActive: true,
    tentativasLogin: 0,
    resetToken: '',
    resetTokenExpires: new Date(),
    termsAccepted: false,
    termsAcceptedAt: new Date()
  }
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { mensagemState, setMensagemState, usuarioState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [usuario, setUsuario] = useState<PropsInterface>(ResetDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<PropsInterface>>([])


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'id',
      alinhamento: 'left',
      campo: 'id'
    },
    {
      cabecalho: 'Nome',
      alinhamento: 'left',
      campo: 'name'
    },

    {
      cabecalho: 'E-mail',
      alinhamento: 'left',
      campo: 'email'
    },


  ]

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
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Usuários',
      pathTitulo: '/',
      pathTituloAnterior: '/user'
    })

    irPara('/')

  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setUsuario(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setUsuario(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setUsuario(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
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
    retorno = validaCampo.tamanho("password", usuario, erros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    retorno = validaCampo.naoVazio('confirmePassword', usuario, erros, retorno, 'A senha não pode ser vázio')
    retorno = validaCampo.tamanho("confirmePassword", usuario, erros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    retorno = validaCampo.eEmail('email', usuario, erros, retorno, false)
    retorno = validaCampo.eSenhaIgual('password', 'confirmePassword', usuario, erros, retorno, 'As senhas devem ser iguais')
    retorno = validaCampo.eTrue('termsAccepted', usuario, erros, retorno, true)

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
      const rs = await clsCrud.incluir({
        entidade: "User",
        criterio: usuario,
      })

      if (rs.ok) {
        exibirMensagem("Cadastro", mensagemSucesso, MensagemTipo.Ok)
        btFechar();
        setLocalState({ action: actionTypes.pesquisando })
      }
    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error)
    }
  }
  const btConfirmar = async () => {
    if (!validarDados()) return;

    if (localState.action === actionTypes.incluindo && (await TemEmail())) {
      await executarAcao("incluir", "Usuário incluído com sucesso!");
    } else if (localState.action === actionTypes.editando) {
      await executarAcao("editar", "Usuário alterado com sucesso!");
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

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "User",
        criterio: {
          name: "%".concat(pesquisa.itemPesquisa).concat("%"),
        },
        camposLike: ["name"],
        msg: 'Pesquisando usuários ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PropsInterface>) => {
        setRsPesquisa(rs)
      })
  }

  useEffect(() => {

    if (!usuarioState.logado) {
      setLocalState({ action: actionTypes.incluindo })
    } else {

      // if (verificarTipoUsuario()) {
      //   setLocalState({ action: actionTypes.pesquisando })
      // } else {
      //   if (usuarioState.logado) {
      //     pesquisarID(usuarioState.idUsuario).then((rs) => {
      //       setLocalState({ action: actionTypes.editando })
      //       setUsuario(rs)
      //     })
      //   }
      // }
    }

  }, [usuarioState, pesquisarID])

  return (
    <>
      <Form method='post' action='/Usuario' >

        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Paper variant="outlined" sx={{ p: 1, bgcolor: '#09072e' }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {/* <Typography component="h5" variant="h5" align="left" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Cadastro de Usuários
                </Typography>
                <Tooltip title={'Cancelar'}>
                  <IconButton sx={{ color: '#fff' }} onClick={() => btFechar()}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip> */}
                <TitleBar
                  title="Cadastro de Usuários"
                  onClose={() => btFechar()}
                />
              </Grid>
              <Condicional condicao={localState.action === 'pesquisando'}>
                <Grid item xs={10} md={11}>
                  <InputText
                    label="Pesquisa"
                    tipo="uppercase"
                    dados={pesquisa}
                    field="itemPesquisa"
                    setState={setPesquisa}
                    iconeEnd='searchicon'
                    onClickIconeEnd={() => btPesquisar()}
                    mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                    autoFocus
                    corFonte='#fff'
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Tooltip title={'Incluir'}>
                    <IconButton
                      color="primary"
                      sx={{ mt: 5, ml: { xs: 1, md: 2 } }}
                      onClick={() => btIncluir()}
                    >
                      <AddCircleIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <DataTable
                    cabecalho={cabecalhoForm}
                    dados={rsPesquisa}
                    acoes={[
                      {
                        icone: EditOutlinedIcon,
                        onAcionador: (rs: UserInterface) =>
                          onEditar(rs.id as string),
                        toolTip: "Editar",
                      },
                      {
                        icone: DeleteTwoToneIcon,
                        onAcionador: (rs: UserInterface) =>
                          onExcluir(rs.id as string),
                        toolTip: "Excluir",
                      },
                    ]}
                  />
                </Grid>
              </Condicional>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} sm={12} md={12} sx={{ color: '#fff', textAlign: 'left' }}>
                  <InputText
                    label="Ativo"
                    tipo="checkbox"
                    dados={usuario}
                    field="isActive"
                    setState={setUsuario}
                    disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}

                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[2] = el)}>

                    <InputText
                      label="Nome"
                      setState={setUsuario}
                      dados={usuario}
                      field="name"
                      erros={erros}
                      type="text"
                      tipo='uppercase'
                      disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 3)}
                      corFonte='#fff'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[3] = el)}>

                    <InputText
                      label="E-mail"
                      setState={setUsuario}
                      dados={usuario}
                      field="email"
                      erros={erros}
                      type="email"
                      tipo="text"
                      disabled={localState.action === 'excluindo' ? true : false}
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
                      disabled={localState.action === 'excluindo' ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 5)}
                      corFonte='#fff'
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[4] = el)}>

                    <Text
                      field="confirmePassword"
                      label="Confirme a Senha"
                      dados={usuario}
                      type='password'
                      setState={setUsuario}
                      tipo='pass'
                      erros={erros}
                      disabled={localState.action === 'excluindo' ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 5)}
                      corFonte='#fff'
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
                      disabled={['excluindo', 'editando'].includes(localState.action)}
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