import { Box, Container, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import ClsValidacao from '../../Utils/ClsValidacao';
import ClsCrud from '../../Utils/ClsCrudApi';
import { ModuloInterface } from '../../Interfaces/sistema/moduloInterface';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import Condicional from '../../Componentes/Condicional/Condicional';
import InputText from '../../Componentes/InputText';
import { UsuarioType } from '../../types/usuarioTypes';
import ModulosPermissao from './ModuloPermissao';

export default function ModulosPage() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()

  const ResetDados: ModuloInterface = {
    modulo: ''
  }

  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<ModuloInterface>>([])
  const [erros, setErros] = useState({})
  const [modulos, setModulos] = useState<ModuloInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Módulo',
      alinhamento: 'center',
      campo: 'modulo',

    },
  ]

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Modulo",
        relations: ["moduloPermissoes"],
        criterio: {
          modulo: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["modulo"],
        campoOrder: ['modulo'],
        msg: 'Pesquisando módulos ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<ModuloInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const pesquisarID = (id: string | number): Promise<ModuloInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Modulo",
        criterio: {
          idModulo: id,
        },
        camposLike: ["idModulo"],
      })
      .then((rs: Array<ModuloInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setModulos(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setModulos(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setModulos(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setModulos(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('modulo', modulos, erros, retorno, 'A descrição do módulo não pode ser vázio')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "Modulo",
        criterio: {
          modulo: modulos.modulo,
        },
        camposLike: ["modulo"],
        msg: 'Pesquisando módulos ...',
        setMensagemState: setMensagemState
      })
      .then((rs) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Item já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else {
          if (validarDados()) {
            if (['incluindo', 'editando'].includes(localState.action)) {
              clsCrud.incluir({
                entidade: "Modulo",
                criterio: modulos,
                localState: localState,
                token: usuarioState.token
              })
                .then((rs) => {
                  if (rs.ok) {
                    if (localState.action === actionTypes.incluindo) {
                      setModulos(rs.dados)
                      setLocalState({ action: actionTypes.detalhes })
                    } else {

                      setLocalState({ action: actionTypes.pesquisando })
                    }
                    btPesquisar()
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            } else if (localState.action === actionTypes.excluindo) {
              clsCrud.excluir({
                entidade: "Modulo",
                criterio: {
                  idModulo: modulos.idModulo
                },
                camposLike: ["idModulo"],
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState
              })
                .then((rs) => {
                  if (rs.ok) {
                    setLocalState({ action: actionTypes.pesquisando })
                  } else {
                    setMensagemState({
                      titulo: 'Erro...',
                      exibir: true,
                      mensagem: 'Erro no cadastro - Consulte Suporte',
                      tipo: MensagemTipo.Error,
                      exibirBotao: true,
                      cb: null
                    })
                  }
                })
            }
          }
        }
      })
  }

  const irPara = useNavigate()

  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Módulos',
      pathTitulo: '/',
      pathTituloAnterior: '/Modulo'
    })
    irPara('/')
  }

  return (

    <Container maxWidth="md" sx={{ mt: 1 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, ml: 1 }}>
            <Typography component="h5" variant="h5" align="left">
              Cadastro de Módulos
            </Typography>
            <Tooltip title={'Fechar'}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={9} md={10} sx={{ ml: 2 }}>
              <InputText
                label="Busque pela descrição do módulo"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => { btPesquisar() }}
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
            <Grid item xs={12} sx={{ ml: 2, mr: 3 }}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
                  {
                    icone: "edit",
                    onAcionador: (rs: ModuloInterface) =>
                      onEditar(rs.idModulo as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ModuloInterface) =>
                      onExcluir(rs.idModulo as number),
                    toolTip: "Excluir",
                  },
                ] : []}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            <Grid item xs={12} >
              <Box sx={{ pl: 3, pr: 3 }} >
                <InputText
                  label="Descrição do Módulo"
                  dados={modulos}
                  field="modulo"
                  setState={setModulos}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={35}
                  onFocus={(e) => e.target.select()}
                  autoFocus
                />
              </Box>
            </Grid>
            <Condicional condicao={['detalhes', 'editando'].includes(localState.action)}>
              <Grid item xs={12} >
                <ModulosPermissao
                  modulo={modulos.idModulo as number}
                />
              </Grid>
            </Condicional>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3 }}
                  onClick={() => btCancelar()}
                >
                  <CancelRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
              <Condicional condicao={['incluindo', 'editando', 'detalhes'].includes(localState.action)}>
                <Tooltip title={'Confirmar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3 }}
                    onClick={() => btConfirmar()}
                  >
                    <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>
              <Condicional condicao={localState.action === 'excluindo'}>
                <Tooltip title={'Excluir'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btConfirmar()}
                  >
                    <DeleteIcon sx={{ fontSize: 60 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>
            </Grid>
          </Condicional>
        </Grid>
      </Paper>
    </Container>
  )
}