import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import Condicional from '../../Components/Condicional/Condicional';
import Text from '../../Components/Text';
import CloseIcon from '@mui/icons-material/Close';
import { GlobalContext, GlobalContextInterface } from '../../Context/GlobalContext';
import { FuncionarioInterface } from '../../interfaces/FuncionarioInterface';
import ApiCls from '../../Services/ApiCls';
import ClsValidaCampo from '../../Services/ClsValidaCampos';
import { ActionInterface, actionTypes } from '../../interfaces/ActionInterface';
import { MensagemTipo } from '../../Context/MensagemState';
import { useNavigate } from 'react-router-dom';
import { CustomTab } from '../../Components/Tab';
import DataTable, { DataTableCabecalhoInterface } from '../../Components/DataTable';
import Selection from '../../Components/Selection';


const TEMPO_REFRESH_TEMPORARIO = 500
type Order = 'asc' | 'desc';

interface PesquisaInterface {
  nome: string
}

export default function Ordem() {

  const ResetDados: FuncionarioInterface = {

    idFuncionario: 0,
    nome: "",
    setor: 0,
    horario: 0,
    ctps: "",
    escoail: "",
    funcao: 0,
    admissao: '',
    demissao: '',
    cpf: "",
    rg: "",
    eleitor: "",
    pis: "",
    transporte: "",
    alimentacao: "",
    nascimento: '',
    pai: "",
    mae: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    telefone: "",
    celular: "",
    ativo: false
  }
  const api: ApiCls = new ApiCls()
  const validaCampo: ClsValidaCampo = new ClsValidaCampo()
  const guias = ['dados pessoais', 'documentos', 'endereço', 'dados profissionais']
  const setores = ['Setor', 'Administração', 'Dublagem', 'Malharia', 'Portaria']
  const funcoes = [
    'Função',
    'Ajudante de Dublagem',
    'Ajudante de Mecânico',
    'Ajudante Geral',
    'Assistente de Tecelão',
    'Auxiliar Administrativo',
    'Auxiliar de Tecelão',
    'Encarregado de Malharia',
    'Estoquista',
    'Expedidor',
    'Gerente Comercial',
    'Líder de Turno',
    'Mecânico Têxtil',
    'Porteiro',
    'Tecelão',
  ]
  const horarios = [
    'Horário',
    '12 x 36 - Diurno',
    '12 x 36 - Noturno',
    '05:40 as 14:00',
    '14:00 as 22:20',
    '14:00 as 22:20 SEG a SEX',
    '22:20 as 05:40',
    '07:00 as 17:00',
  ]
  const [currentTab, setCurrentTab] = useState(0);
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<FuncionarioInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [funcionario, setFuncionario] = useState<FuncionarioInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    if (validaCampo.campoVazio(funcionario.nome)) {
      retorno = false
      erros.nome = 'Nome Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.cep)) {
      retorno = false
      erros.cep = 'CEP inválido!'
    }
    if (validaCampo.campoVazio(funcionario.endereco)) {
      retorno = false
      erros.endereco = 'Endereço Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.numero)) {
      retorno = false
      erros.numero = 'Número Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.bairro)) {
      retorno = false
      erros.bairro = 'Bairro Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.cidade)) {
      retorno = false
      erros.cidade = 'Cidade Não pode ser Vazio!'
    }
    if (!validaCampo.eUF(funcionario.uf)) {
      retorno = false
      erros.uf = 'UF inválido!'
    }
    if (!validaCampo.eCPF(funcionario.cpf)) {
      retorno = false
      erros.cpf = 'CPF inválido!'
    }
    if (funcionario.setor === 0) {
      retorno = false
      erros.setor = 'Escolha um Setor!'
    }
    if (funcionario.horario === 0) {
      retorno = false
      erros.horario = 'Escolha o Horário de trabalho!'
    }
    if (funcionario.funcao === 0) {
      retorno = false
      erros.funcao = 'Escolha qual a Função!'
    }
    if (validaCampo.campoVazio(funcionario.ctps)) {
      retorno = false
      erros.ctps = 'CTPS Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.rg)) {
      retorno = false
      erros.rg = 'RG Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.pis)) {
      retorno = false
      erros.pis = 'PIS Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.pai)) {
      retorno = false
      erros.pai = 'PAI Não pode ser Vazio!'
    }
    if (validaCampo.campoVazio(funcionario.mae)) {
      retorno = false
      erros.mae = 'MÃE Não pode ser Vazio!'
    }
    if (!validaCampo.isDateValid(funcionario.nascimento)) {
      retorno = false
      erros.nascimento = "Informe uma data de Nascimento válida!"
    }
    if (!validaCampo.isDateValid(funcionario.admissao)) {
      retorno = false
      erros.admissao = "Informe uma data de Admissão válida!"
    }
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {
      let msg1: string = ''
      let msg2: string = ''
      let msg3: string = 'Cadastro de Funcionário não atualizado!'
      let url_ativa: string = '/funcionarios/'.concat(funcionario.idFuncionario.toString())
      let body: any = funcionario

      if (localState.action === actionTypes.incluindo) {
        msg1 = 'Incluíndo dados em Funcionários...'
        msg2 = 'Funcionário cadastrado com sucesso!'
        url_ativa = '/funcionarios'
      } else if (localState.action === actionTypes.excluindo) {
        msg1 = 'Excluíndo Funcionário do cadastro ...'
        msg2 = 'Funcionário excluído com sucesso!'
        msg3 = 'Funcionário não excluído!'
        body = ''
      } else if (localState.action === actionTypes.editando) {
        msg1 = 'Editando dados do Funcionário...'
        msg2 = 'Funcionário alterado com sucesso!'
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
          setErros({})
          setCurrentTab(0)
          setFuncionario(ResetDados)
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

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'idFuncionario',
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
      cabecalho: 'cpf',
      alinhamento: 'left',
    },
    {
      campo: 'ativo',
      cabecalho: 'Ativo',
      alinhamento: 'left',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    }
  ]

  const btEditar = (rs: FuncionarioInterface) => {
    setFuncionario(rs)
    setLocalState({ action: actionTypes.editando })
  }
  const btExcluir = (rs: FuncionarioInterface) => {
    setFuncionario(rs)
    setLocalState({ action: actionTypes.excluindo })
  }
  const btIncluir = () => {
    setErros({})
    setFuncionario(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setFuncionario(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
    setCurrentTab(0)
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

  const btPesquisar = () => {

    setTimeout(() => {
      api.pesq<any>('/funcionarios?nome_like='.concat(pesquisa.nome), 'Recebendo Pessoas ...', mensagemState, setMensagemState)
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
            mensagem: 'Erro na conexão com o banco de dados!',
            tipo: MensagemTipo.Error,
            exibirBotao: true
          })
        })
    }, TEMPO_REFRESH_TEMPORARIO);
  };
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

    validaCampo.verificaCEP(funcionario.cep)
      .then(temCep => {
        if (temCep) {
          funcionario.endereco = validaCampo.tmp_eCEP.logradouro
          funcionario.bairro = validaCampo.tmp_eCEP.bairro
          funcionario.cidade = validaCampo.tmp_eCEP.localidade
          funcionario.uf = validaCampo.tmp_eCEP.uf
          setMensagemState({
            ...mensagemState,
            exibir: false,
            mensagem: ''
          })
        } else {
          funcionario.endereco = ''
          funcionario.bairro = ''
          funcionario.cidade = ''
          funcionario.uf = ''
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
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography component="h5" variant="h5" align="left">
              Cadastro de Funcionários
              <Typography variant="body2" gutterBottom>
                Dados cadastrais do registro do Funcionário na empresa.
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
            <CustomTab labels={guias} currentTab={currentTab} setState={setCurrentTab} />
            {currentTab === 0 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Nome"
                    tipo="text"
                    dados={funcionario}
                    field="nome"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    autofocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Nascimento"
                    type='date'
                    dados={funcionario}
                    field="nascimento"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    tipo='password'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Pai"
                    tipo="text"
                    dados={funcionario}
                    field="pai"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Mãe"
                    tipo="text"
                    dados={funcionario}
                    field="mae"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Telefone"
                    tipo="mask"
                    dados={funcionario}
                    field="telefone"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Celular"
                    tipo="mask"
                    dados={funcionario}
                    field="celular"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
              </>
            )}

            {currentTab === 1 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="CPF"
                    tipo="mask"
                    dados={funcionario}
                    field="cpf"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    autofocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="CTPS"
                    tipo="mask"
                    dados={funcionario}
                    field="ctps"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="E-Social"
                    tipo="mask"
                    dados={funcionario}
                    field="esocial"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="RG"
                    tipo="mask"
                    dados={funcionario}
                    field="rg"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Título de Eleitor"
                    tipo="mask"
                    dados={funcionario}
                    field="eleitor"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="PIS"
                    tipo="mask"
                    dados={funcionario}
                    field="pis"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
              </>
            )}
            {currentTab === 2 && (
              <>
                <Grid item xs={12} sm={3}>
                  <Text
                    label="CEP"
                    tipo="mask"
                    dados={funcionario}
                    field="cep"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    iconeEnd='searchicon'
                    onClickIconeEnd={() => btBuscaCep()}
                    mapKeyPress={[{ key: 'Enter', onKey: btBuscaCep }]}
                    autofocus
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Text
                    label="Endereço"
                    type="text"
                    dados={funcionario}
                    field="endereco"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Text
                    label="Número"
                    tipo="valor"
                    dados={funcionario}
                    field="numero"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Text
                    label="Bairro"
                    tipo="text"
                    dados={funcionario}
                    field="bairro"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Cidade"
                    tipo="text"
                    dados={funcionario}
                    field="cidade"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={2} >
                  <Text
                    label="UF"
                    tipo="text"
                    dados={funcionario}
                    field="uf"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
              </>
            )}
            {currentTab === 3 && (
              <>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Ativo"
                    tipo="checkbox"
                    dados={funcionario}
                    field="ativo"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Selection
                    label='Setor'
                    disabled={localState.action === 'excluindo' ? true : false}
                    dados={funcionario}
                    field="setor"
                    setState={setFuncionario}
                    erros={erros}
                    dadosMap={setores}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Vale Transporte"
                    tipo="text"
                    dados={funcionario}
                    field="transporte"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    autofocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Vale Alimentação"
                    tipo="text"
                    dados={funcionario}
                    field="alimentacao"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Admissão"
                    type='date'
                    dados={funcionario}
                    field="admissao"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    tipo='password'
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Text
                    label="Demissão"
                    type='date'
                    dados={funcionario}
                    field="demissao"
                    setState={setFuncionario}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    tipo='password'
                  />
                </Grid>

                <Grid item xs={12} sm={6} >
                  <Selection
                    label='Horários'
                    disabled={localState.action === 'excluindo' ? true : false}
                    dados={funcionario}
                    field="horario"
                    setState={setFuncionario}
                    erros={erros}
                    dadosMap={horarios}
                  />
                </Grid>
                <Grid item xs={12} sm={6} >
                  <Selection
                    label='Função'
                    disabled={localState.action === 'excluindo' ? true : false}
                    dados={funcionario}
                    field="funcao"
                    setState={setFuncionario}
                    erros={erros}
                    dadosMap={funcoes}
                  />
                </Grid>
              </>
            )}
            <Box mt={3} minWidth={'100%'} display="flex" justifyContent="flex-end">
              {currentTab === 3 ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCurrentTab(currentTab + 1)}
                >
                  Próxima
                </Button>
              )}
            </Box>
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
  );
};
