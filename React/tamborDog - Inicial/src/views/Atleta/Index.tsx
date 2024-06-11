import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { Avatar, Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { AtletaInterface } from '../../interfaces/AtletaInterface';
import { GlobalContext, GlobalContextInterface } from '../../Context/GlobalContext';
import { ActionInterface, actionTypes } from '../../interfaces/ActionInterface';
import { MensagemTipo } from '../../Context/MensagemState';
import Text from '../../Components/Text';
import DataTable, { DataTableCabecalhoInterface } from '../../Components/DataTable';
import ApiCls from '../../Services/ApiCls';
import ClsValidaCampo from '../../Services/ClsValidaCampos';
import Condicional from '../../Components/Condicional/Condicional';
import { Order } from '../../teste_apagar/Ordem_old';

const TEMPO_REFRESH_TEMPORARIO = 500

interface PesquisaInterface {
  nome: string
}

export default function Atleta() {

  const api: ApiCls = new ApiCls()
  const validaCampo: ClsValidaCampo = new ClsValidaCampo()

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'idAtleta',
      cabecalho: 'Id',
      alinhamento: 'left'
    },
    {
      campo: 'nome',
      cabecalho: 'Nome',
      alinhamento: 'left'
    },
    {
      campo: 'cpf',
      cabecalho: 'CPF',
      alinhamento: 'left'
    },
    {
      campo: 'ativo',
      cabecalho: 'Ativo',
      alinhamento: 'left',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    }
  ]

  const ResetDados: AtletaInterface = {
    idAtleta: 0,
    avatar: '',
    nome: '',
    telefone: '',
    email: '',
    nascimento: new Date(),
    cpf: '',
    escola: 0,
    ativo: false,
  }

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<AtletaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [atleta, setAtleta] = useState<AtletaInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const escolas = ['Cia & Cão', 'TamborDog', 'Sem Escola']
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('name');

  const handleChangeEscola = (event: SelectChangeEvent) => {
    let escola: number = parseInt(event.target.value as string)
    setAtleta({ ...atleta, escola: escola })
  };

  const btEditar = (rs: AtletaInterface) => {
    setAtleta(rs)
    setLocalState({ action: actionTypes.editando })
  }
  const btExcluir = (rs: AtletaInterface) => {
    setAtleta(rs)
    setLocalState({ action: actionTypes.excluindo })
  }
  const btIncluir = () => {
    setErros({})
    setAtleta(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setAtleta(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    if (validaCampo.campoVazio(atleta.nome)) {
      retorno = false
      erros.nome = 'Nome Não pode ser Vazio!'
    }
    if (!validaCampo.eTEL(atleta.telefone)) {
      retorno = false
      erros.telefone = 'Telefone inválido!'
    }
    if (!validaCampo.eEMAIL(atleta.email)) {
      retorno = false
      erros.email = 'E-mail inválido!'
    }
    if (!atleta.nascimento) {
      retorno = false
      erros.nascimento = 'Data de Nascimento inválida!'
    }
    if (!atleta.escola) {
      retorno = false
      erros.cidade = 'Defina uma Escola!'
    }
    if (!validaCampo.eCPF(atleta.cpf)) {
      retorno = false
      erros.cpf = 'CPF inválido!'
    }
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {
      let msg1: string = ''
      let msg2: string = ''
      let msg3: string = 'Cadastro de Atletas não atualizado!'
      let url_ativa: string = '/atleta/'.concat(atleta.idAtleta.toString())
      let body: any = atleta

      if (localState.action === actionTypes.incluindo) {
        msg1 = 'Incluíndo dados em Atleta...'
        msg2 = 'Atleta cadastrado com sucesso!'
        url_ativa = '/atleta'
      } else if (localState.action === actionTypes.excluindo) {
        msg1 = 'Excluíndo Atleta do cadastro ...'
        msg2 = 'Atleta excluído com sucesso!'
        msg3 = 'Atleta não excluído!'
        body = ''
      } else if (localState.action === actionTypes.editando) {
        msg1 = 'Editando dados do Atleta...'
        msg2 = 'Atleta alterado com sucesso!'
      }

      api.query<any>(url_ativa, body, msg1, mensagemState, setMensagemState, localState)
        .then(rs => {
          setMensagemState({
            ...mensagemState,
            titulo: 'Confirmado!',
            exibir: true,
            mensagem: msg2,
            tipo: MensagemTipo.Info,
            exibirBotao: true,
            cb: () => btPesquisar()
          })
          setAtleta(ResetDados)
          setLocalState({ action: 'pesquisando' })
        }).catch(() => {

          setMensagemState({
            ...mensagemState,
            exibir: true,
            mensagem: msg3,
            tipo: MensagemTipo.Error,
            exibirBotao: true
          })
        })
    }
  }

  const btPesquisar = () => {

    setTimeout(() => {
      api.pesq<any>('/atleta?name_like='.concat(pesquisa.nome), 'Recebendo Atletas ...', mensagemState, setMensagemState)
        .then(rs => {
          setRsPesquisa(rs)
          setMensagemState({
            ...mensagemState,
            exibir: false,
            mensagem: ''
          })
        }).catch(() => {

          setMensagemState({
            ...mensagemState,
            exibir: true,
            mensagem: 'Erro na conexão com o bando de dados!',
            tipo: MensagemTipo.Error,
            exibirBotao: true
          })
        })
    }, TEMPO_REFRESH_TEMPORARIO);
  }

  const irpara = useNavigate()

  const btFechar = () => {
    irpara('/')
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper variant="outlined" sx={{ padding: 2 }}>

          <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography component="h5" variant="h5" align="left">
                Cadastro de Atletas
                <Typography variant="body2" gutterBottom>
                  Ficha com os dados cadastrais do Atleta
                </Typography>
              </Typography>

              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Condicional condicao={localState.action === 'pesquisando'}>
              <Grid item xs={12} sm={10} sx={{ mb: 3 }}>
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
              <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                <Button sx={{ color: 'white' }} variant='contained' onClick={() => btIncluir()}>Incluir</Button>
              </Grid>
            </Condicional>

            <Condicional condicao={localState.action !== 'pesquisando'}>
              <Grid item xs={12} sm={12}>
                <Stack direction="row" spacing={2} >
                  <Avatar
                    alt={atleta.nome}
                    src={atleta.avatar}
                    sx={{ margin: '0 auto', width: 56, height: 56 }} />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Text
                  label="CPF"
                  tipo="mask"
                  dados={atleta}
                  field="cpf"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  autofocus
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <Text
                  label="Nome"
                  tipo="text"
                  dados={atleta}
                  field="nome"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Text
                  label="Ativo"
                  tipo="checkbox"
                  dados={atleta}
                  field="ativo"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="Nascimento"
                  type='date'
                  dados={atleta}
                  field="nascimento"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="Telefone"
                  type="text"
                  dados={atleta}
                  field="telefone"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="E-mail"
                  type="text"
                  dados={atleta}
                  field="email"
                  setState={setAtleta}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                <Box>
                  <FormControl fullWidth>
                    <Typography
                      variant='body2'
                      textAlign='left'
                      sx={{ mt: 1 }}
                    >
                      Escola
                    </Typography>
                    <Select
                      sx={{ my: 0, py: 0, height: 40 }}
                      disabled={localState.action === 'excluindo' ? true : false}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={atleta.escola.toString()}
                      // label="Escola"
                      onChange={handleChangeEscola}
                      required
                    >
                      {escolas.map((escola, i) => (
                        <MenuItem key={i} value={i}>{escola}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

            </Condicional>

            <Condicional condicao={localState.action === 'incluindo'}>
              <Button sx={{ marginTop: 3, color: 'white' }} variant="contained" onClick={btConfirmar} >Confirmar Inclusão</Button>
            </Condicional>

            <Condicional condicao={localState.action === 'editando'}>
              <Button sx={{ marginTop: 3, color: 'white' }} variant="contained" onClick={btConfirmar} >Confirmar Edição</Button>
            </Condicional>

            <Condicional condicao={localState.action === 'excluindo'}>
              <Button sx={{ marginTop: 3, color: 'white' }} variant="contained" onClick={btConfirmar} >Confirmar Exclusão</Button>
            </Condicional>

            <Condicional condicao={localState.action !== 'pesquisando'}>
              <Button sx={{ marginTop: 3, marginLeft: 1, color: 'white' }} variant="contained" onClick={btCancelar}>Cancelar</Button>
            </Condicional>

            <Condicional condicao={localState.action === 'pesquisando'}>
              <Grid item xs={12} sx={{ mt: 3 }}>
                <DataTable
                  dados={rsPesquisa}
                  cabecalho={Cabecalho}
                  onEditar={btEditar}
                  onExcluir={btExcluir}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
              </Grid>
            </Condicional>
          </Grid>
        </Paper>
      </Container>
    </>
  )
}
