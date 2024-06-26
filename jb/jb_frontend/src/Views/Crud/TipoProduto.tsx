import { Container, Grid, IconButton, Paper, Typography, Tooltip } from '@mui/material';
// import { styled } from '@mui/system';
import Text from '../../Componentes/Text';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { TipoProdutoInterface } from '../../../../jb_backend/src/interfaces/tipoProdutoInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import ComboBox from '../../Componentes/ComboBox';



export default function TipoProduto() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: TipoProdutoInterface = {
    nome: '',
  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPesquisa, setRsPesquisa] = useState<Array<TipoProdutoInterface>>([])
  const [erros, setErros] = useState({})
  const [tipoProduto, setTipoProduto] = useState<TipoProdutoInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Nome',
      alinhamento: 'left',
      campo: 'nome'
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

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "TipoProduto",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["idTipoProduto", "nome"],
        msg: 'Pesquisando tipos de Produtos ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<TipoProdutoInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const pesquisarID = (id: string | number): Promise<TipoProdutoInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "TipoProduto",
        criterio: {
          idTipoProduto: id,
        },
      })
      .then((rs: Array<TipoProdutoInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTipoProduto(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTipoProduto(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setTipoProduto(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setTipoProduto(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', tipoProduto, erros, retorno, 'Nome do tipo de produto não pode ser vázio')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {
    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "TipoProduto",
          criterio: tipoProduto,
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
          entidade: "TipoProduto",
          criterio: {
            idTipoProduto: tipoProduto.idTipoProduto
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

  const irPara = useNavigate()

  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Tipo de Produto',
      pathTitulo: '/',
      pathTituloAnterior: '/TipoProduto'
    })
    irPara('/')
  }

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              {/* Informe aqui o nome técnico de cada raça */}
              <Typography variant="body2" gutterBottom>
                Informe o nome do tipo de produto
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
                onClickIconeEnd={() => { btPesquisar() }}
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
                    onAcionador: (rs: TipoProdutoInterface) =>
                      onEditar(rs.idTipoProduto as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: TipoProdutoInterface) =>
                      onExcluir(rs.idTipoProduto as number),
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
              <Text
                label="Nome"
                tipo="text"
                dados={tipoProduto}
                field="nome"
                setState={setTipoProduto}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
                autofocus
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