import { Container, Grid, IconButton, Paper, Typography, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { CategoriaInterface } from '../../../../tambordog-backend/src/interfaces/categoriaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';



const ResetDados: CategoriaInterface = {
  nome: '',
  observacao: ''
}
interface PesquisaInterface {
  nome: string
}

export default function Categoria() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPesquisa, setRsPesquisa] = useState<Array<CategoriaInterface>>([])
  const [erros, setErros] = useState({})
  const [categoria, setCategoria] = useState<CategoriaInterface>(ResetDados)
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
      cabecalho: 'Observação',
      alinhamento: 'left',
      campo: 'observacao'
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

  const pesquisarID = (id: string | number): Promise<CategoriaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Categoria",
        criterio: {
          idCategoria: id,
        },
      })
      .then((rsCategoria: Array<CategoriaInterface>) => {
        return rsCategoria[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rsCategoria) => {
      setCategoria(rsCategoria)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rsCategoria) => {
      setCategoria(rsCategoria)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setCategoria(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setCategoria(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', categoria, erros, retorno, 'Nome da categoria não pode ser vázio')
    retorno = validaCampo.naoVazio('observacao', categoria, erros, retorno, 'Deve conter a observação da categoria')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Categoria",
          criterio: categoria,
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
          entidade: "Categoria",
          criterio: {
            idCategoria: categoria.idCategoria
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
        entidade: "Categoria",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["idCategoria", "nome", "observacao"],
        msg: 'Pesquisando categorias ...',
        setMensagemState: setMensagemState
      })
      .then((rsCategorias: Array<CategoriaInterface>) => {
        setRsPesquisa(rsCategorias)
      })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Categoria',
      pathTitulo: '/',
      pathTituloAnterior: '/Categoria'
    })
    irPara('/')
  }

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              {/* Dados cadastrais referente as categorias de cães */}
              <Typography variant="body2" gutterBottom>
                Dados cadastrais referente as categorias de cães
              </Typography>
            </Typography>

            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={11}>
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
                    onAcionador: (rs: CategoriaInterface) =>
                      onEditar(rs.idCategoria as string),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: CategoriaInterface) =>
                      onExcluir(rs.idCategoria as string),
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
            <Grid item xs={12}>
              <InputText
                label="Nome"
                tipo="text"
                dados={categoria}
                field="nome"
                setState={setCategoria}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <InputText
                label="Observação"
                tipo="text"
                dados={categoria}
                field="observacao"
                setState={setCategoria}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
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