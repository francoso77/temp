import { Container, Grid, IconButton, Paper, Typography, Tooltip, Box, Switch, Dialog, useTheme, useMediaQuery } from '@mui/material';
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
import { PessoaType } from '../../types/pessoaTypes';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import UsuariosPermissoes from './UsuariosPermissoes';


const ResetDados: UsuarioInterface = {
  cpf: '',
  senha: '',
  ativo: true,
  nome: '',
  tentativasLogin: 0,
  tipoUsuario: UsuarioType.default,
  email: '',
  resetToken: '',
  resetTokenExpires: new Date(),
  idPessoa_vendedor: 0
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
  const [open, setOpen] = useState(false)
  const [openPermissao, setOpenPermissao] = useState(false)
  const [idUsuario, setIdUsuario] = useState(0)

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
    {
      cabecalho: 'Ativo',
      alinhamento: 'center',
      campo: 'ativo',
      render: (valor: boolean, row: any) => {
        return (
          <Switch
            checked={Boolean(valor)}
            color="primary"
            size="small"
            onChange={async (event) => {
              const novoValor = event.target.checked;

              // Atualiza no estado principal (exemplo usando setRsPedido)
              setRsPesquisa((prev) =>
                prev.map((usuario) =>
                  usuario.idUsuario === row.idUsuario
                    ? { ...usuario, ativo: novoValor }
                    : usuario,

                  updateAtivo(row.idUsuario, novoValor)
                )
              );

            }}
          />
        );
      }
    }
  ]

  const updateAtivo = async (id: number, novoValor: boolean) => {

    const user = rsPesquisa.filter((item) => item.idUsuario === id)
    user[0].ativo = novoValor

    await clsCrud.incluir({
      entidade: "Usuario",
      criterio: user[0],
      token: usuarioState.token
    });
  }
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
      tituloAnterior: 'Cadastro de Usuário',
      pathTitulo: '/',
      pathTituloAnterior: '/Usuario'
    })

    irPara('/')

  }

  const onPermissao = (id: number) => {
    setIdUsuario(id)
    setOpenPermissao(true)
  }

  const onTrocar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setUsuario(rs)
      setOpen(true)
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

  const btCancelarTipo = () => {
    setOpen(false)
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

  const temVendedor = async (usuario: UsuarioInterface): Promise<number> => {

    const rs = await clsCrud.pesquisar({
      entidade: "Pessoa",
      criterio: { cpf_cnpj: usuario.cpf },
      camposLike: ["cpf_cnpj"],
      token: usuarioState.token
    })

    if (rs.length === 0) {
      const vendedor: PessoaInterface = {
        nome: usuario.nome,
        apelido: '',
        cpf_cnpj: usuario.cpf,
        email: usuario.email,
        endereco: '',
        numero: 0,
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        telefone: '',
        whatsapp: '',
        comissao: 0,
        tipoPessoa: PessoaType.vendedor,
        ativo: true,
      }

      await clsCrud.incluir({
        entidade: "Pessoa",
        criterio: vendedor,
        token: usuarioState.token
      })

      const vendedorCadastrado = await clsCrud.pesquisar({
        entidade: "Pessoa",
        criterio: { cpf_cnpj: vendedor.cpf_cnpj },
        camposLike: ["cpf_cnpj"],
        token: usuarioState.token
      })
      return vendedorCadastrado[0].idPessoa

    } else {

      return rs[0].idPessoa
    }
  }

  const btConfirmar = async () => {

    if (!validarDados() && (await TemCPF())) return;
    if (usuario.tipoUsuario === UsuarioType.vendedor) {

      const idVendedor = await temVendedor(usuario)

      usuario.idPessoa_vendedor = idVendedor
    }

    try {
      const rs = await clsCrud.incluir({
        entidade: "Usuario",
        criterio: usuario,
        token: usuarioState.token
      })

      if (rs.ok) {
        exibirMensagem("Cadastro", "Usuário cadastrado com sucesso!", MensagemTipo.Ok)
        setLocalState({ action: actionTypes.pesquisando })
        btFechar();
      }
    } catch (error) {
      exibirMensagem("Erro de conexão", "Erro na conexão com banco de dados!", MensagemTipo.Error)
    }

  }

  const btConfirmaAlteracao = async () => {

    const rs = await clsCrud.incluir({
      entidade: "Usuario",
      criterio: usuario,
      token: usuarioState.token,
    })

    if (rs.ok) {
      await btPesquisar()
      setOpen(false)
    } else {
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

  const btPesquisar = async () => {
    await clsCrud
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


  useEffect(() => {

    btPesquisar()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <>
      <Form method='post' action='/Usuario'>

        <Container maxWidth="md" sx={{ mt: 1 }}>
          <Paper variant="outlined" sx={{ padding: 1 }}>

            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography component="h5" variant="h5" align="left">
                  Cadastro de Usuários
                </Typography>
                <Tooltip title={'Fechar'}>
                  <IconButton onClick={() => btFechar()}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Condicional condicao={localState.action === 'pesquisando'}>
                <Grid item xs={10} md={11}>
                  <InputText
                    label="Buscar por nome"
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
                      sx={{ mt: 4, ml: { xs: 0, md: 1 } }}
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
                        icone: "published_with_changes",
                        onAcionador: (rs: UsuarioInterface) =>
                          onTrocar(rs.idUsuario as number),
                        toolTip: "Alterar Tipo de usuário",
                      },
                      {
                        icone: "playlist_add_check_circle_twotone",
                        onAcionador: (rs: UsuarioInterface) =>
                          onPermissao(rs.idUsuario as number),
                        toolTip: "Configurar Permissões",
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
                    //disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 0 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <InputText
                      label="CPF"
                      mask="cpf"
                      setState={setUsuario}
                      dados={usuario}
                      field="cpf"
                      erros={erros}
                      type='tel'
                      //disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
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
                      //                      disabled={['excluindo', 'editando'].includes(localState.action) ? true : false}
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
                      //                      disabled={localState.action === 'excluindo' ? true : false}
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
                      //disabled={localState.action === 'excluindo' ? true : false}
                      onKeyDown={(event: any) => btPulaCampo(event, 5)}
                    />
                  </Box>
                </Grid>
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
                      //                      disabled={localState.action === 'excluindo' ? true : false}
                      erros={erros}
                      setState={setUsuario}
                      onFocus={(e) => e.target.select()}
                    />
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
              </Condicional>
              <Dialog
                open={open}
                fullScreen={fullScreen}
                fullWidth
                maxWidth='sm'>
                <Paper variant="outlined"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    m: 1,
                    p: 1.5,
                    backgroundColor: '#3c486b'
                  }}>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontSize: 25, mt: 1, textAlign: 'center' }}>
                      Trocar Tipo de Usuário
                    </Typography>
                  </Grid>
                </Paper>
                <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
                  <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={12} sm={12}>
                      <Text
                        field="nome"
                        label="Usuário"
                        dados={usuario}
                        setState={setUsuario}
                        erros={erros}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                      <ComboBox
                        opcoes={UsuarioTypes}
                        campoDescricao="descricao"
                        campoID="idUsuarioType"
                        dados={usuario}
                        mensagemPadraoCampoEmBranco="Escolha um tipo de usuário"
                        field="tipoUsuario"
                        label="Tipo de Usuário"
                        erros={erros}
                        setState={setUsuario}
                        onFocus={(e) => e.target.select()}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
                    <Tooltip title={'Cancelar'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3 }}
                        onClick={() => btCancelarTipo()}
                      >
                        <CancelRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Alterar'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3 }}
                        onClick={() => btConfirmaAlteracao()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Paper >
              </Dialog >
            </Grid>
            <Condicional condicao={openPermissao}>
              <Grid item xs={12} sm={12} sx={{ mt: 1, textAlign: 'right' }}>
                <UsuariosPermissoes
                  idUsuario={idUsuario}
                  openPermissao={openPermissao}
                  setOpenPermissao={setOpenPermissao}
                />
              </Grid>
            </Condicional>
          </Paper >
        </Container >
      </Form >
    </>
  )
}