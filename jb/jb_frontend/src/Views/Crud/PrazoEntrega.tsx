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
import { PrazoEntregaInterface } from '../../../../jb_backend/src/interfaces/prazoEntregaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';


export default function prazoEntrega() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()


  const ResetDados: PrazoEntregaInterface = {
    nome: '',
    dias: ''
  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [rsPesquisa, setRsPesquisa] = useState<Array<PrazoEntregaInterface>>([])
  const [erros, setErros] = useState({})
  const [prazoEntrega, setPrazoEntrega] = useState<PrazoEntregaInterface>(ResetDados)
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
      cabecalho: 'Qtd Dias',
      alinhamento: 'left',
      campo: 'dias'
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
        entidade: "PrazoEntrega",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["idPrazoEntrega", "nome", "dias"],
        msg: 'Pesquisando prazo de entregas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<PrazoEntregaInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const pesquisarID = (id: string | number): Promise<PrazoEntregaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "PrazoEntrega",
        criterio: {
          idPrazoEntrega: id,
        },
      })
      .then((rs: Array<PrazoEntregaInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPrazoEntrega(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setPrazoEntrega(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    setPrazoEntrega(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setPrazoEntrega(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', prazoEntrega, erros, retorno, 'Nome do prazo de entrega não pode ser vázio')
    retorno = validaCampo.naoVazio('dias', prazoEntrega, erros, retorno, 'Exemplo: 30 ou 30/60 ou 30/60/90')

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {
    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "PrazoEntrega",
          criterio: prazoEntrega,
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
          entidade: "PrazoEntrega",
          criterio: {
            idPrazoEntrega: prazoEntrega.idPrazoEntrega
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
      tituloAnterior: 'Prazo de Entrega',
      pathTitulo: '/',
      pathTituloAnterior: '/PrazoEntrega'
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
                Informe os prazos de entrega
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
                    onAcionador: (rs: PrazoEntregaInterface) =>
                      onEditar(rs.idPrazoEntrega as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: PrazoEntregaInterface) =>
                      onExcluir(rs.idPrazoEntrega as number),
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
                dados={prazoEntrega}
                field="nome"
                setState={setPrazoEntrega}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
                autofocus
              />
            </Grid>
            <Grid item xs={12}>
              <Text
                label="Qtd de Dias"
                tipo="text"
                dados={prazoEntrega}
                field="dias"
                setState={setPrazoEntrega}
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