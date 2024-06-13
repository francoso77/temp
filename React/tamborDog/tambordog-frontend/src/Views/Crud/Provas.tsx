import { Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ProvaInterface } from '../../../../tambordog-backend/src/interfaces/provaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import InputSelect from '../../Componentes/Select';
import { PisoTypes } from '../../types/PisoTypes';
import ComboBox from '../../Componentes/ComboBox';
import { CampeonatoInterface } from '../../../../tambordog-backend/src/interfaces/campeonatoInterface';
import InputMultiline from '../../Componentes/InputMultline';
import { StatusProvaType } from '../../types/ProvaTypes';

const ResetDados: ProvaInterface = {
  nomeProva: '',
  endereco: '',
  numero: 0,
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  lat: '',
  long: '',
  tipoPiso: PisoTypes.grama,
  dataHoraProva: new Date(),
  valorProva: 0,
  valorProvaAte12: 0,
  telefone: '',
  whatsapp: '',
  email: '',
  status: StatusProvaType.inscAberta,
  idCampeonato: '',
  termoAceite: '',
  foto: false
}
interface PesquisaInterface {
  nome: string
}

export default function Prova() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<ProvaInterface>>([])
  const [erros, setErros] = useState({})
  const [prova, setProva] = useState<ProvaInterface>(ResetDados)
  const [rsCampeonato, setRsCampeonato] = useState<Array<CampeonatoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Prova',
      alinhamento: 'left',
      campo: 'nomeProva'
    },
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataHoraProva',
      format: (data) => clsFormatacao.dataEHora(data)
    },
    {
      cabecalho: 'Situação',
      alinhamento: 'left',
      campo: 'status'
    },
    {
      cabecalho: 'WhatsApp',
      alinhamento: 'left',
      campo: 'whatsapp'
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

  const pesquisarID = (id: string | number): Promise<ProvaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Prova",
        criterio: {
          idProva: id,
        },
      })
      .then((rs: Array<ProvaInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProva(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProva(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProva(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setProva(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}
    retorno = validaCampo.naoVazio('nomeProva', prova, erros, retorno, 'Nome do prova não pode ser vázio')
    retorno = validaCampo.naoVazio('cep', prova, erros, retorno, 'Informe um CEP válido')
    retorno = validaCampo.eData('dataHoraProva', prova, erros, retorno, false)
    // retorno = validaCampo.eData('horaProva', prova, erros, retorno, false)
    retorno = validaCampo.eTelefone('telefone', prova, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', prova, erros, retorno, false)
    retorno = validaCampo.eEmail('email', prova, erros, retorno, false)
    retorno = validaCampo.naoVazio('endereco', prova, erros, retorno, 'Informe um endereço')
    retorno = validaCampo.naoVazio('numero', prova, erros, retorno, 'Número inválido')
    retorno = validaCampo.naoVazio('bairro', prova, erros, retorno, 'Informe um bairro')
    retorno = validaCampo.naoVazio('cidade', prova, erros, retorno, 'Informe a cidade')
    retorno = validaCampo.eUF('uf', prova, erros, retorno, false)
    retorno = validaCampo.naoVazio('idCampeonato', prova, erros, retorno, 'Informe um campeonato')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Prova",
          criterio: prova,
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
          entidade: "Prova",
          criterio: {
            idProva: prova.idProva
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
        entidade: "Prova",
        criterio: {
          nomeProva: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nomeProva"],
        select: [
          "idProva",
          "nomeProva",
          "telefone",
          "whatsapp",
          "email",
          'endereco',
          'numero',
          'bairro',
          'cidade',
          'uf',
          'cep',
          'lat',
          'long',
          'tipoPiso',
          'dataHoraProva',
          'valorProva',
          'valorProvaAte12',
          'status',
          'termoAceite',
          'foto',
          'idCampeonato'
        ],
        msg: 'Pesquisando provas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<ProvaInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Provas',
      pathTitulo: '/',
      pathTituloAnterior: '/Prova'
    })
    irPara('/')
  }

  const btBuscaCep = () => {
    if (!prova.cep || prova.cep.length < 10) {
      setMensagemState({
        titulo: "Erro...",
        exibir: true,
        mensagem: 'CEP inválido para pesquisa',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    } else {
      clsCrud.verificaCEP({ CEP: prova.cep, setMensagemState: setMensagemState })
        .then((temCep) => {
          if (temCep) {
            prova.endereco = clsCrud.tmp_eCEP.logradouro
            prova.bairro = clsCrud.tmp_eCEP.bairro
            prova.cidade = clsCrud.tmp_eCEP.localidade
            prova.uf = clsCrud.tmp_eCEP.uf
          }
          else {
            prova.endereco = ''
            prova.bairro = ''
            prova.cidade = ''
            prova.uf = ''
          }
        }).catch((e) => {
          setMensagemState({
            titulo: "Erro...",
            exibir: true,
            mensagem: 'Erro na conexão com o servidor de cep!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        })
    }
  }
  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Campeonato",
        criterio: {
          nome: "%".concat("%"),
        },
        camposLike: ["nome"],
      })
      .then((rs: Array<CampeonatoInterface>) => {
        setRsCampeonato(rs)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])
  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
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
                    onAcionador: (rs: ProvaInterface) =>
                      onEditar(rs.idProva as string),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProvaInterface) =>
                      onExcluir(rs.idProva as string),
                    toolTip: "Excluir",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Prova"
                tipo="text"
                dados={prova}
                field="nomeProva"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="CEP"
                mask='cep'
                dados={prova}
                field="cep"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btBuscaCep()}
                mapKeyPress={[{ key: 'Enter', onKey: btBuscaCep }]}
              />
            </Grid>
            <Grid item xs={12} md={9} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Endereço"
                tipo="text"
                dados={prova}
                field="endereco"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={100}
              />
            </Grid>
            <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Número"
                tipo="number"
                type='tel'
                dados={prova}
                field="numero"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={9} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Bairro"
                tipo="text"
                dados={prova}
                field="bairro"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
              />
            </Grid>
            <Grid item xs={12} md={5} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Cidade"
                tipo="text"
                dados={prova}
                field="cidade"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={60}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="UF"
                tipo="text"
                dados={prova}
                field="uf"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={2}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Data e Hora da Prova"
                setState={setProva}
                dados={prova}
                field="dataHoraProva"
                erros={erros}
                type="tel"
                tipo='dateTime'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Valor da Prova"
                tipo="currency"
                type='currency'
                dados={prova}
                field="valorProva"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Valor da Prova até 12(anos)"
                tipo="currency"
                type='currency'
                dados={prova}
                field="valorProvaAte12"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Telefone"
                setState={setProva}
                dados={prova}
                field="telefone"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="WhatsApp"
                setState={setProva}
                dados={prova}
                field="whatsapp"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="E-mail"
                setState={setProva}
                dados={prova}
                field="email"
                erros={erros}
                type="email"
                tipo="text"
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <ComboBox
                opcoes={[
                  { "piso": 'Areia', "valor": 'A' },
                  { "piso": 'Grama', "valor": 'G' },
                  { "piso": 'Grama_sintetica', "valor": 'GS' },
                ]}
                campoDescricao="piso"
                campoID="valor"
                dados={prova}
                mensagemPadraoCampoEmBranco="Escolha um piso"
                field="piso"
                label="Piso"
                erros={erros}
                setState={setProva}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <ComboBox
                opcoes={[
                  { "prova": 'Recebendo Inscrições', "valor": 'Recebendo Inscrições' },
                  { "prova": 'Inscrições Encerradas', "valor": 'Inscrições Encerradas' },
                  { "prova": 'Em Andamento', "valor": 'Em Andamento' },
                  { "prova": 'Concluída', "valor": 'Concluída' },
                ]}
                campoDescricao="prova"
                campoID="prova"
                dados={prova}
                mensagemPadraoCampoEmBranco="Escolha um status"
                field="status"
                label="Status"
                erros={erros}
                setState={setProva}
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <ComboBox
                opcoes={rsCampeonato}
                campoDescricao="nome"
                campoID="idCampeonato"
                dados={prova}
                mensagemPadraoCampoEmBranco="Escolha um campeonato"
                field="idCampeonato"
                label="Campeonato"
                erros={erros}
                setState={setProva}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Latitude"
                tipo="text"
                dados={prova}
                field="lat"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={10}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Longitude"
                tipo="text"
                dados={prova}
                field="long"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={10}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Aceite"
                tipo="text"
                dados={prova}
                field="termoAceite"
                setState={setProva}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Foto"
                tipo="checkbox"
                dados={prova}
                field="foto"
                setState={setProva}
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
      </Paper >
      {/* {JSON.stringify(prova)} */}
    </Container >
  )
}

{/* <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
      <InputMultiline
        label="Dados adicionais..."
        setState={setProva}
        dados={prova}
        field="adicionais"
        disabled={localState.action === 'excluindo' ? true : false}
      />
    </Grid> */}