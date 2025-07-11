import { Container, Grid, IconButton, Paper, Typography, Tooltip, Box } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useRef, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UsuarioInterface } from '../../Interfaces/sistema/usuarioInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import InputText from '../../Componentes/InputText';
import { UsuarioType, UsuarioTypes } from '../../types/usuarioTypes';
import ComboBox from '../../Componentes/ComboBox';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from "@mui/icons-material/AddCircle";




const ResetDados: UsuarioInterface = {
  cpf: '',
  senha: '',
  ativo: true,
  nome: '',
  tentativasLogin: 0,
  tipoUsuario: UsuarioType.default,
  email: '',
  resetToken: '',
  resetTokenExpires: new Date()
}

export default function Usuario() {

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { mensagemState, setMensagemState, usuarioState, setLayoutState, layoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [erros, setErros] = useState({})
  const [usuario, setUsuario] = useState<UsuarioInterface>(ResetDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsPesquisa, setRsPesquisa] = useState<Array<UsuarioInterface>>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'id',
      alinhamento: 'left',
      campo: 'idUsuario'
    },
    {
      cabecalho: 'Nome',
      alinhamento: 'left',
      campo: 'nome'
    },
    {
      cabecalho: 'CPF',
      alinhamento: 'left',
      campo: 'cpf'
    },
    {
      cabecalho: 'E-mail',
      alinhamento: 'left',
      campo: 'email'
    },
    {
      cabecalho: 'Tipo Usuário',
      alinhamento: 'left',
      campo: 'tipoUsuario',
      format: (tipo) => UsuarioTypes.find(t => t.idUsuarioType === tipo)?.descricao.toUpperCase()
    },

  ]

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
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Usuários',
      pathTitulo: '/',
      pathTituloAnterior: '/Usuario'
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
    if (verificarTipoUsuario()) {

      setErros({})
      setUsuario(ResetDados)
      setLocalState({ action: actionTypes.pesquisando })

    } else {
      btFechar()
    }
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eCPF('cpf', usuario, erros, retorno, false)
    retorno = validaCampo.naoVazio('nome', usuario, erros, retorno, 'Digite um nome para o usuário')
    retorno = validaCampo.naoVazio('senha', usuario, erros, retorno, 'A senha não pode ser vázio')
    retorno = validaCampo.tamanho("senha", usuario, erros, retorno, false, 6, 10, "Campo deve ter entre 6 e 10 caracteres")
    retorno = validaCampo.eEmail('email', usuario, erros, retorno, false)
    setErros(erros)
    return retorno
  }

  const TemCPF = async (): Promise<boolean> => {

    try {
      const rs = await clsCrud.pesquisar({
        entidade: "Usuario",
        criterio: { cpf: usuario.cpf },
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

  const executarAcao = async (acao: "incluir" | "editar", mensagemSucesso: string) => {
    try {
      const rs = await clsCrud.incluir({
        entidade: "Usuario",
        criterio: usuario,
      })

      if (rs.ok) {
        exibirMensagem("Cadastro", mensagemSucesso, MensagemTipo.Ok)
        if (!verificarTipoUsuario()) {
          btFechar();
        }
        setLocalState({ action: actionTypes.pesquisando })
      }
    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error)
    }
  }
  const btConfirmar = async () => {
    if (!validarDados()) return;

    if (localState.action === actionTypes.incluindo && (await TemCPF())) {
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
        entidade: "Usuario",
        criterio: {
          nome: "%".concat(pesquisa.itemPesquisa).concat("%"),
        },
        camposLike: ["nome"],
        msg: 'Pesquisando usuários ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<UsuarioInterface>) => {
        setRsPesquisa(rs)
      })
  }

  const verificarTipoUsuario = (): boolean => {
    const tipoUsuario = Number(usuarioState.tipoUsuario)
    return tipoUsuario === UsuarioType.admin
  }

  useEffect(() => {

    if (!usuarioState.logado) {
      setLocalState({ action: actionTypes.incluindo })
    } else {

      if (verificarTipoUsuario()) {
        setLocalState({ action: actionTypes.pesquisando })
      } else {
        if (usuarioState.logado) {
          pesquisarID(usuarioState.idUsuario).then((rs) => {
            setLocalState({ action: actionTypes.editando })
            setUsuario(rs)
          })
        }
      }
    }

  }, [usuarioState, verificarTipoUsuario, pesquisarID])

  return (
    <>
      <Form method='post' action='/Usuario'>

        <Container maxWidth="md" sx={{ mt: 1.5 }}>
          <Paper variant="outlined" sx={{ padding: 1 }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography component="h5" variant="h5" align="left">
                  Cadastro de Usuários
                </Typography>
                <IconButton onClick={() => btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Condicional condicao={localState.action === 'pesquisando' && !verificarTipoUsuario()}>
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
                  />
                </Grid>
                <Grid item xs={2} md={1}>
                  <Tooltip title={'Incluir'}>
                    <IconButton
                      color="secondary"
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
                        icone: 'edit',
                        onAcionador: (rs: UsuarioInterface) =>
                          onEditar(rs.idUsuario as number),
                        toolTip: "Editar",
                      },
                      {
                        icone: "delete",
                        onAcionador: (rs: UsuarioInterface) =>
                          onExcluir(rs.idUsuario as number),
                        toolTip: "Excluir",
                      },
                    ]}
                  />
                </Grid>
              </Condicional>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
                  <InputText
                    label="Ativo"
                    tipo="checkbox"
                    dados={usuario}
                    field="ativo"
                    setState={setUsuario}
                    disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <InputText
                      label="CPF"
                      mask="cpf"
                      onBlur={() => TemCPF()}
                      setState={setUsuario}
                      dados={usuario}
                      field="cpf"
                      erros={erros}
                      type='tel'
                      disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                      min={14}
                      onKeyDown={(event: any) => btPulaCampo(event, 2)}
                      autoFocus
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[2] = el)}>

                    <InputText
                      label="Nome"
                      setState={setUsuario}
                      dados={usuario}
                      field="nome"
                      erros={erros}
                      type="text"
                      tipo='uppercase'
                      disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 3)}
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
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[4] = el)}>

                    <Text
                      field="senha"
                      label="Senha"
                      dados={usuario}
                      type='password'
                      setState={setUsuario}
                      tipo='pass'
                      erros={erros}
                      disabled={localState.action === 'excluindo' ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 5)}
                    />
                  </Box>
                </Grid>
                {/* <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                  <Text
                    field="senha"
                    label="Senha"
                    dados={usuario}
                    type='password'
                    setState={setUsuario}
                    tipo='pass'
                    erros={erros}
                    disabled={localState.action === 'excluindo' ? true : false}
                  />
                </Grid> */}
                <Condicional condicao={verificarTipoUsuario()}>
                  <Grid item xs={12} sm={12} sx={{ mt: 0 }}>
                    <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                      <ComboBox
                        opcoes={UsuarioTypes}
                        campoDescricao="descricao"
                        campoID="idUsuarioType"
                        dados={usuario}
                        mensagemPadraoCampoEmBranco="Escolha um tipo de usuário"
                        field="tipoUsuario"
                        label="Tipo de Usuário"
                        disabled={localState.action === 'excluindo' ? true : false}
                        erros={erros}
                        setState={setUsuario}
                        onFocus={(e) => e.target.select()}
                      />
                    </Box>
                  </Grid>
                </Condicional>
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