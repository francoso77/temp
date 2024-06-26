import { Grid, IconButton, Paper, Avatar, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { CaoInterface } from '../../../../tambordog-backend/src/interfaces/caoInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { AtletaInterface } from '../../../../tambordog-backend/src/interfaces/atletaInterface';
import { RacaInterface } from '../../../../tambordog-backend/src/interfaces/racaInterface';
import { CategoriaInterface } from '../../../../tambordog-backend/src/interfaces/categoriaInterface';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ShowText from '../../Componentes/ShowText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ComboBox from '../../Componentes/ComboBox';


interface PropsInterface {
  rsAtleta: AtletaInterface
}

export default function Cao({ rsAtleta }: PropsInterface) {

  const clsFormatacao: ClsFormatacao = new ClsFormatacao()
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: CaoInterface = {
    nome: '',
    dataNascimento: '',
    ativo: true,
    avatar: '',
    idAtleta: rsAtleta.idAtleta as string,
    idRaca: '',
    idCategoria: ''
  }

  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<CaoInterface>>([])
  const [erros, setErros] = useState({})
  const [cao, setCao] = useState<CaoInterface>(ResetDados)
  const [rsRaca, setRsRaca] = useState<Array<RacaInterface>>([])
  const [rsCategoria, setRsCategoria] = useState<Array<CategoriaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Nome',
      alinhamento: 'left',
      campo: 'nome'
    },
    {
      cabecalho: 'Nascimento',
      alinhamento: 'left',
      campo: 'dataNascimento',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Ativo',
      alinhamento: 'left',
      campo: 'ativo',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const pesquisarID = (id: string | number): Promise<CaoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Cao",
        criterio: {
          idCao: id,
        },
      })
      .then((rsCao: Array<CaoInterface>) => {
        return rsCao[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rsCao) => {
      setCao(rsCao)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rsCao) => {
      setCao(rsCao)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setCao(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setCao(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', cao, erros, retorno, 'Nome do Cão não pode ser vázio')
    retorno = validaCampo.eData('dataNascimento', cao, erros, retorno, false)
    retorno = validaCampo.naoVazio('idAtleta', cao, erros, retorno, 'Escolha um Atleta')
    retorno = validaCampo.naoVazio('idCategoria', cao, erros, retorno, 'Escolha uma Categoria')
    retorno = validaCampo.naoVazio('idRaca', cao, erros, retorno, 'Escolha uma Raça')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Cao",
          criterio: cao,
          localState: localState.action,
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
      } else if (localState.action === actionTypes.excluindo) {
        clsCrud.excluir({
          entidade: "Cao",
          criterio: {
            idCao: cao.idCao
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

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Cao",
        criterio: {
          idAtleta: rsAtleta.idAtleta,
        },
        select: ["idCao", "nome", "dataNascimento", "ativo"],
        msg: 'Pesquisando cães ...',
        setMensagemState: setMensagemState
      })
      .then((rsCaes: Array<CaoInterface>) => {
        setRsPesquisa(rsCaes)
      })
  }

  const BuscarDados = () => {
    // clsCrud
    //   .pesquisar({
    //     entidade: "Atleta",
    //     criterio: {
    //       nome: "%".concat("%"),
    //     },
    //     camposLike: ["nome"],
    //   })
    //   .then((rsAtletas: Array<AtletaInterface>) => {
    //     setRsAtleta(rsAtletas)
    //   })

    clsCrud
      .pesquisar({
        entidade: "Categoria",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rsCategorias: Array<CategoriaInterface>) => {
        setRsCategoria(rsCategorias)
      })
    clsCrud
      .pesquisar({
        entidade: "Raca",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rsRacas: Array<RacaInterface>) => {
        setRsRaca(rsRacas)
      })
  }

  const irpara = useNavigate()
  const btFechar = () => {
    irpara('/Atleta')
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Cães',
      pathTitulo: '/Atleta',
      pathTituloAnterior: '/Atleta'
    })
  }
  // if (localState.action !== actionTypes.pesquisando) {
  //   BuscarDados()
  // }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (
    <>
      <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, padding: 1.5 }}>
        <Grid item xs={12}>
          <ShowText
            titulo="Atleta"
            descricao={rsAtleta.nome} />
        </Grid>

        <Grid item xs={12}>
          <ShowText
            titulo="WhatsAPP"
            tipo="whatsapp"
            descricao={rsAtleta.whatsapp}
          />
        </Grid>
      </Paper>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={11} >
              <Text
                label="Digite o nome"
                tipo="text"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autofocus
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: { xs: 0, md: 2 } }}
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
                    onAcionador: (rs: CaoInterface) =>
                      onEditar(rs.idCao as string),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: CaoInterface) =>
                      onExcluir(rs.idCao as string),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={localState.action !== 'pesquisando'}>
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <InputText
                label="Ativo"
                tipo="checkbox"
                dados={cao}
                field="ativo"
                setState={setCao}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3,
                mt: 3
              }} >
              <Avatar
                alt={cao.nome}
                src={cao.avatar}
                sx={{ width: 88, height: 88 }}
              />
            </Grid>

            <Grid item xs={12} md={8} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Nome"
                tipo="text"
                dados={cao}
                field="nome"
                setState={setCao}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                autoFocus
                maxLength={60}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Data de Nascimento"
                setState={setCao}
                dados={cao}
                field="dataNascimento"
                erros={erros}
                type="tel"
                tipo='date'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsRaca}
                campoDescricao="nome"
                campoID="idRaca"
                dados={cao}
                mensagemPadraoCampoEmBranco="Escolha uma raça"
                field="idRaca"
                label="Raças"
                erros={erros}
                setState={setCao}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsCategoria}
                campoDescricao="nome"
                campoID="idCategoria"
                dados={cao}
                mensagemPadraoCampoEmBranco="Escolha uma categoria"
                field="idCategoria"
                label="Categorias"
                erros={erros}
                setState={setCao}
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
      </Paper >
    </>
  )
}