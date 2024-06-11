import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { PersonInterface } from '../../interfaces/PersonInterface';
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

export default function Person() {

  const api: ApiCls = new ApiCls()
  const validaCampo: ClsValidaCampo = new ClsValidaCampo()

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'idPerson',
      cabecalho: 'Id',
      alinhamento: 'left'
    },
    {
      campo: 'name',
      cabecalho: 'Nome',
      alinhamento: 'left'
    },
    {
      campo: 'category',
      cabecalho: 'Categoria',
      alinhamento: 'left',
      format: (v: number) => { return v === 0 ? 'Despesas' : 'Receitas' }
    },
    {
      campo: 'ativo',
      cabecalho: 'Ativo',
      alinhamento: 'left',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    }
  ]

  const ResetDados: PersonInterface = {
    idPerson: 0,
    name: '',
    category: 0,
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    ativo: false,
  }

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<PersonInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [person, setPerson] = useState<PersonInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const categorys = ['Despesas', 'Receitas']
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('name');

  const handleChangeCategory = (event: SelectChangeEvent) => {
    let cat: number = parseInt(event.target.value as string)
    setPerson({ ...person, category: cat })
  };

  const btEditar = (rs: PersonInterface) => {
    setPerson(rs)
    setLocalState({ action: actionTypes.editando })
  }
  const btExcluir = (rs: PersonInterface) => {
    setPerson(rs)
    setLocalState({ action: actionTypes.excluindo })
  }
  const btIncluir = () => {
    setErros({})
    setPerson(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setPerson(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    if (validaCampo.campoVazio(person.name)) {
      retorno = false
      erros.name = 'Nome Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(person.cep)) {
      retorno = false
      erros.cep = 'CEP inválido!'
    }
    if (validaCampo.campoVazio(person.endereco)) {
      retorno = false
      erros.endereco = 'Endereço Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(person.numero)) {
      retorno = false
      erros.numero = 'Número Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(person.bairro)) {
      retorno = false
      erros.bairro = 'Bairro Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(person.cidade)) {
      retorno = false
      erros.cidade = 'Cidade Não pode ser Vazio!'
    }
    if (!validaCampo.eUF(person.uf)) {
      retorno = false
      erros.uf = 'UF inválido!'
    }
    if (!validaCampo.eCPF(person.cpf)) {
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
      let msg3: string = 'Cadastro de Pessoas não atualizado!'
      let url_ativa: string = '/person/'.concat(person.idPerson.toString())
      let body: any = person

      if (localState.action === actionTypes.incluindo) {
        msg1 = 'Incluíndo dados em Pessoa...'
        msg2 = 'Pessoa cadastrado com sucesso!'
        url_ativa = '/person'
      } else if (localState.action === actionTypes.excluindo) {
        msg1 = 'Excluíndo Pessoa do cadastro ...'
        msg2 = 'Pessoa excluída com sucesso!'
        msg3 = 'Pessoa não excluído!'
        body = ''
      } else if (localState.action === actionTypes.editando) {
        msg1 = 'Editando dados da Pessoa...'
        msg2 = 'Pessoa alterada com sucesso!'
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
          setPerson(ResetDados)
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

  const btBuscaCep = () => {
    setMensagemState({
      ...mensagemState,
      titulo: 'Processando',
      mensagem: 'Recebendo dados do CEP...',
      exibir: true,
      tipo: MensagemTipo.Loading,
      exibirBotao: false,
      cb: null
    })

    validaCampo.verificaCEP(person.cep)
      .then(temCep => {
        if (temCep) {
          person.endereco = validaCampo.tmp_eCEP.logradouro
          person.bairro = validaCampo.tmp_eCEP.bairro
          person.cidade = validaCampo.tmp_eCEP.localidade
          person.uf = validaCampo.tmp_eCEP.uf
          setMensagemState({
            ...mensagemState,
            exibir: false,
            mensagem: ''
          })
        } else {
          person.endereco = ''
          person.bairro = ''
          person.cidade = ''
          person.uf = ''
          setMensagemState({
            ...mensagemState,
            titulo: 'Não Encontrado',
            mensagem: 'CEP inexistente...',
            exibir: true,
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        }
      })
      .catch(() => {
        setMensagemState({
          ...mensagemState,
          exibir: true,
          mensagem: 'Erro na conexão com o servidor de cep!',
          tipo: MensagemTipo.Error,
          exibirBotao: true
        })
      })
  }

  const btPesquisar = () => {

    setTimeout(() => {
      api.pesq<any>('/person?name_like='.concat(pesquisa.nome), 'Recebendo Pessoas ...', mensagemState, setMensagemState)
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
                Cadastro de Pessoas
                <Typography variant="body2" gutterBottom>
                  Cadastro de clientes e fornecedores para controle financeiro
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
                <Button variant='contained' onClick={() => btIncluir()}>Incluir</Button>
              </Grid>
            </Condicional>

            <Condicional condicao={localState.action !== 'pesquisando'}>
              <Grid item xs={12} sm={3}>
                <Text
                  label="CPF"
                  tipo="mask"
                  dados={person}
                  field="cpf"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  autofocus
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Text
                  label="Nome"
                  tipo="text"
                  dados={person}
                  field="name"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Text
                  label="Ativo"
                  tipo="checkbox"
                  dados={person}
                  field="ativo"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Text
                  label="CEP"
                  tipo="mask"
                  dados={person}
                  field="cep"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  iconeEnd='searchicon'
                  onClickIconeEnd={() => btBuscaCep()}
                  mapKeyPress={[{ key: 'Enter', onKey: btBuscaCep }]}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <Text
                  label="Endereço"
                  type="text"
                  dados={person}
                  field="endereco"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Text
                  label="Número"
                  tipo="valor"
                  dados={person}
                  field="numero"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Text
                  label="Bairro"
                  tipo="text"
                  dados={person}
                  field="bairro"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="Cidade"
                  tipo="text"
                  dados={person}
                  field="cidade"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={2} >
                <Text
                  label="UF"
                  tipo="text"
                  dados={person}
                  field="uf"
                  setState={setPerson}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>

              <Grid item xs={12} sm={12} sx={{ my: 2 }}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                    <Select
                      sx={{ my: 0, py: 0, height: 40 }}
                      disabled={localState.action === 'excluindo' ? true : false}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={person.category.toString()}
                      label="Categoria"
                      onChange={handleChangeCategory}
                      required
                    >
                      {categorys.map((category, i) => (
                        <MenuItem key={i} value={i}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

            </Condicional>

            <Condicional condicao={localState.action === 'incluindo'}>
              <Button sx={{ marginTop: 3 }} variant="contained" onClick={btConfirmar} >Confirmar Inclusão</Button>
            </Condicional>

            <Condicional condicao={localState.action === 'editando'}>
              <Button sx={{ marginTop: 3 }} variant="contained" onClick={btConfirmar} >Confirmar Edição</Button>
            </Condicional>

            <Condicional condicao={localState.action === 'excluindo'}>
              <Button sx={{ marginTop: 3 }} variant="contained" onClick={btConfirmar} >Confirmar Exclusão</Button>
            </Condicional>

            <Condicional condicao={localState.action !== 'pesquisando'}>
              <Button sx={{ marginTop: 3, marginLeft: 1 }} variant="contained" onClick={btCancelar}>Cancelar</Button>
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
