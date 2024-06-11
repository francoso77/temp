import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { Radio, FormControlLabel, RadioGroup, FormLabel, Avatar, Stack, Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { CaoInterface } from '../../interfaces/CaoInterface';
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

export default function Cao() {

  const api: ApiCls = new ApiCls()
  const validaCampo: ClsValidaCampo = new ClsValidaCampo()

  const Cabecalho: Array<DataTableCabecalhoInterface> = [
    {
      campo: 'idCao',
      cabecalho: 'Id',
      alinhamento: 'left'
    },
    {
      campo: 'nome',
      cabecalho: 'Nome',
      alinhamento: 'left'
    },
    {
      campo: 'categoria',
      cabecalho: 'Categoria',
      alinhamento: 'left',
    },
    {
      campo: 'ativo',
      cabecalho: 'Ativo',
      alinhamento: 'left',
      format: (v: boolean) => { return v ? 'Sim' : 'Não' }
    }
  ]

  const ResetDados: CaoInterface = {
    idCao: 0,
    avatar: '',
    nome: '',
    categoria: 0,
    pedigree: 0,
    raca: 0,
    genero: '',
    nascimento: new Date(),
    vacina: new Date(),
    ativo: false,
  }

  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<CaoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [cao, setCao] = useState<CaoInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const pedigrees = ['Azul', 'Branco', 'Rosa', 'Sem Pedrigree']
  const racasDeCaes = [
    "Akita Inu",
    "Basset Hound",
    "Beagle",
    "Bichon Frisé",
    "Border Collie",
    "Boxer",
    "Bulldog Francês",
    "Bulldog Inglês",
    "Bull Terrier",
    "Cavalier King Charles Spaniel",
    "Chihuahua",
    "Chow Chow",
    "Cocker Spaniel",
    "Dachshund (Cofap/Teckel)",
    "Dálmata",
    "Doberman",
    "Golden Retriever",
    "Husky Siberiano",
    "Labrador Retriever",
    "Lhasa Apso",
    "Maltese",
    "Poodle",
    "Pomeranian",
    "Pug",
    "Rottweiler",
    "Schnauzer Miniatura",
    "Shih Tzu",
    "Staffordshire Bull Terrier",
    "Yorkshire Terrier"
  ];
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const handleChangePedigree = (event: SelectChangeEvent) => {
    let ped: number = parseInt(event.target.value as string)
    setCao({ ...cao, pedigree: ped })
  };

  const handleChangeRaca = (event: SelectChangeEvent) => {
    let raca: number = parseInt(event.target.value as string)
    setCao({ ...cao, raca: raca })
  };
  const btEditar = (rs: CaoInterface) => {
    setCao(rs)
    setLocalState({ action: actionTypes.editando })
  }
  const btExcluir = (rs: CaoInterface) => {
    setCao(rs)
    setLocalState({ action: actionTypes.excluindo })
  }
  const btIncluir = () => {
    setErros({})
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

    if (validaCampo.campoVazio(cao.nome)) {
      retorno = false
      erros.name = 'Nome Não pode ser Vazio!'
    }
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {
      let msg1: string = ''
      let msg2: string = ''
      let msg3: string = 'Cadastro de Pessoas não atualizado!'
      let url_ativa: string = '/cao/'.concat(cao.idCao.toString())
      let body: any = cao

      if (localState.action === actionTypes.incluindo) {
        msg1 = 'Incluíndo dados do Cão...'
        msg2 = 'Cão cadastrado com sucesso!'
        url_ativa = '/cao'
      } else if (localState.action === actionTypes.excluindo) {
        msg1 = 'Excluíndo Cão do cadastro ...'
        msg2 = 'Cão excluído com sucesso!'
        msg3 = 'Cão não excluído!'
        body = ''
      } else if (localState.action === actionTypes.editando) {
        msg1 = 'Editando dados do cão...'
        msg2 = 'Cão alterado com sucesso!'
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
          setCao(ResetDados)
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
      api.pesq<any>('/cao?name_like='.concat(pesquisa.nome), 'Recebendo Cães ...', mensagemState, setMensagemState)
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
              <Typography component="h5" variant="h5" align='left'>
                Cadastro de Cães
                <Typography variant="body2" gutterBottom>
                  Informações detalhadas dos Cães
                </Typography>
              </Typography>

              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Condicional condicao={localState.action === 'pesquisando'}>
              <Grid item xs={12} sm={10} sx={{ mb: 3 }}>
                <Text
                  label="Digite o nome do cão"
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
                    alt={cao.nome}
                    src={cao.avatar}
                    sx={{ margin: '0 auto', width: 56, height: 56 }} />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Text
                  label="Nome"
                  tipo="text"
                  dados={cao}
                  field="nome"
                  setState={setCao}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  autofocus
                />
              </Grid>
              <Grid item xs={12} sm={4} >
                <Text
                  label="Ativo"
                  tipo="checkbox"
                  dados={cao}
                  field="ativo"
                  setState={setCao}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl >
                  <FormLabel id="demo-radio-buttons-group-label" >Gênero</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="F"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="F" control={<Radio />} label="Fêmea" />
                    <FormControlLabel value="M" control={<Radio />} label="Macho" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl >
                  <FormLabel id="demo-radio-buttons-group-label" >Categoria</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="G"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="P" control={<Radio />} label="(P) Mini < 35 cm" />
                    <FormControlLabel value="M" control={<Radio />} label="(M) Medio de 35 a < 43 cm" />
                    <FormControlLabel value="G" control={<Radio />} label="(G) Padrão > 43 cm" />
                    <FormControlLabel value="BC" control={<Radio />} label="(BC) Border Collie" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Pedigree</InputLabel>
                    <Select
                      sx={{ my: 0, py: 0, height: 40 }}
                      disabled={localState.action === 'excluindo' ? true : false}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={cao.pedigree.toString()}
                      label="Pedigree"
                      onChange={handleChangePedigree}
                      required
                    >
                      {pedigrees.map((pedigree, i) => (
                        <MenuItem key={i} value={i}>{pedigree}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Raças</InputLabel>
                    <Select
                      sx={{ my: 0, py: 0, height: 40 }}
                      disabled={localState.action === 'excluindo' ? true : false}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={cao.raca.toString()}
                      label="Raças"
                      onChange={handleChangeRaca}
                      required
                    >
                      {racasDeCaes.map((raca, i) => (
                        <MenuItem key={i} value={i}>{raca}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="Nascimento"
                  type='date'
                  dados={cao}
                  field="nascimento"
                  setState={setCao}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Text
                  label="Vencimento Vacina"
                  type='date'
                  dados={cao}
                  field="vacina"
                  setState={setCao}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                />
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
