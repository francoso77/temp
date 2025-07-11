import { Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UnidadeMedidaInterface } from '../../Interfaces/unidadeMedidaInteface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';

export default function UnidadeMedida() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()



  const ResetDados: UnidadeMedidaInterface = {
    sigla: '',
    nome: ''
  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<UnidadeMedidaInterface>>([])
  const [erros, setErros] = useState({})
  const [unidadeMedida, setUnidadeMedida] = useState<UnidadeMedidaInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Sigla',
      alinhamento: 'left',
      campo: 'sigla'
    },
    {
      cabecalho: 'Nome',
      alinhamento: 'left',
      campo: 'nome'
    },
  ]

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "UnidadeMedida",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["idUnidade", "sigla", "nome"],
        msg: 'Pesquisando unidade de medidas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<UnidadeMedidaInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const pesquisarID = (id: string | number): Promise<UnidadeMedidaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "UnidadeMedida",
        criterio: {
          idUnidade: id,
        },
      })
      .then((rs: Array<UnidadeMedidaInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setUnidadeMedida(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setUnidadeMedida(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setUnidadeMedida(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setUnidadeMedida(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', unidadeMedida, erros, retorno, 'Nome da unidade de Medida não pode ser vázio')
    retorno = validaCampo.naoVazio('sigla', unidadeMedida, erros, retorno, 'Sigla não pode ser vázio')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "UnidadeMedida",
        criterio: {
          nome: "%".concat(unidadeMedida.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["nome"],
        msg: 'Pesquisando unidades de medidas ...',
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

            if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
              clsCrud.incluir({
                entidade: "UnidadeMedida",
                criterio: unidadeMedida,
                localState: localState,
                cb: () => btPesquisar(),
                setMensagemState: setMensagemState,
                token: usuarioState.token
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
            } else if (localState.action === actionTypes.excluindo) {
              clsCrud.excluir({
                entidade: "UnidadeMedida",
                criterio: {
                  idUnidade: unidadeMedida.idUnidade
                },
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
      tituloAnterior: 'Cadastro de Unidades Medida',
      pathTitulo: '/',
      pathTituloAnterior: '/UnidadeMedida'
    })
    irPara('/')
  }

  return (

    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
              <InputText
                label="Pesquisa"
                tipo="uppercase"
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
            <Grid item xs={12}>
              <DataTable
                cabecalho={cabecalhoForm}
                dados={rsPesquisa}
                acoes={[
                  {
                    icone: "edit",
                    onAcionador: (rs: UnidadeMedidaInterface) =>
                      onEditar(rs.idUnidade as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: UnidadeMedidaInterface) =>
                      onExcluir(rs.idUnidade as number),
                    toolTip: "Excluir",
                  },
                ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            <Grid item xs={12}>
              <InputText
                label="Sigla"
                tipo="uppercase"
                dados={unidadeMedida}
                field="sigla"
                setState={setUnidadeMedida}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={2}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <InputText
                label="Nome"
                tipo="uppercase"
                dados={unidadeMedida}
                field="nome"
                setState={setUnidadeMedida}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btCancelar()}
                >
                  <CancelRoundedIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Tooltip>
              <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                <Tooltip title={'Confirmar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
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