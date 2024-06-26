import { Container, Grid, IconButton, Paper, Avatar, Tooltip } from '@mui/material';
import Text from '../../Componentes/Text';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { AtletaInterface } from '../../../../tambordog-backend/src/interfaces/atletaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import Cao from './Cao';



const ResetDados: AtletaInterface = {
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  whatsapp: '',
  ativo: true,
  avatar: ''
}
interface PesquisaInterface {
  nome: string
}

export default function Atleta() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<AtletaInterface>>([])
  const [erros, setErros] = useState({})
  const [atleta, setAtleta] = useState<AtletaInterface>(ResetDados)
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
      cabecalho: 'CPF',
      alinhamento: 'left',
      campo: 'cpf'
    },

    {
      cabecalho: 'WhatsApp',
      alinhamento: 'left',
      campo: 'whatsapp'
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

  const pesquisarID = (id: string | number): Promise<AtletaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Atleta",
        criterio: {
          idAtleta: id,
        },
      })
      .then((rsAtleta: Array<AtletaInterface>) => {
        return rsAtleta[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rsAtleta) => {
      setAtleta(rsAtleta)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rsAtleta) => {
      setAtleta(rsAtleta)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const onCaes = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setAtleta(rs)
      setLocalState({ action: actionTypes.detalhes })
    })
    setLayoutState({
      titulo: 'Cães',
      tituloAnterior: 'Atletas',
      pathTitulo: '/Cao',
      pathTituloAnterior: '/Atleta'
    })
  }
  const btIncluir = () => {
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

    retorno = validaCampo.naoVazio('nome', atleta, erros, retorno, 'Nome do Atleta não pode ser vázio')
    retorno = validaCampo.eCPF('cpf', atleta, erros, retorno, false)
    retorno = validaCampo.eData('dataNascimento', atleta, erros, retorno, false)
    retorno = validaCampo.eTelefone('telefone', atleta, erros, retorno, false)
    retorno = validaCampo.eTelefone('whatsapp', atleta, erros, retorno, false)
    retorno = validaCampo.naoVazio('senha', atleta, erros, retorno, 'A senha não pode ser vázio')
    retorno = validaCampo.eEmail('email', atleta, erros, retorno, false)
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Atleta",
          criterio: atleta,
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
          entidade: "Atleta",
          criterio: {
            idAtleta: atleta.idAtleta
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
        entidade: "Atleta",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["idAtleta", "nome", "dataNascimento", "ativo", "telefone", "whatsapp", "cpf", "senha", "email"],
        msg: 'Pesquisando atletas ...',
        setMensagemState: setMensagemState
      })
      .then((rsAtletas: Array<AtletaInterface>) => {
        setRsPesquisa(rsAtletas)
      })
  }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Atleta',
      pathTitulo: '/',
      pathTituloAnterior: '/Atleta'
    })
    irPara('/')
  }

  useEffect(() => {
    if (layoutState.titulo === "") {
      setLocalState({ action: actionTypes.pesquisando })
      setLayoutState({
        titulo: 'Atleta',
        tituloAnterior: 'Cães',
        pathTitulo: '/Atleta',
        pathTituloAnterior: '/Atleta'
      })
    }
  },)
  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>

        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            {/* <Typography component="h5" variant="h5" align="left">
              Informe aqui os dados cadastrais do Atleta
              <Typography variant="body2" gutterBottom>
                Informe aqui os dados cadastrais do Atleta
              </Typography>
            </Typography> */}

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
                    onAcionador: (rs: AtletaInterface) =>
                      onEditar(rs.idAtleta as string),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: AtletaInterface) =>
                      onExcluir(rs.idAtleta as string),
                    toolTip: "Excluir",
                  },
                  {
                    icone: "pets",
                    onAcionador: (rs: AtletaInterface) =>
                      onCaes(rs.idAtleta as string),
                    toolTip: "Cães",
                  },
                ]}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Grid>
          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <Text
                label="Ativo"
                tipo="checkbox"
                dados={atleta}
                field="ativo"
                setState={setAtleta}
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
                alt={atleta.nome}
                src={atleta.avatar}
                sx={{ width: 88, height: 88 }}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ mt: 2 }}>
              <InputText
                label="CPF"
                mask="cpf"
                setState={setAtleta}
                dados={atleta}
                field="cpf"
                erros={erros}
                type='tel'
                disabled={localState.action === 'excluindo' ? true : false}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={8} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Nome"
                tipo="text"
                dados={atleta}
                field="nome"
                setState={setAtleta}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={50}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Data de Nascimento"
                setState={setAtleta}
                dados={atleta}
                field="dataNascimento"
                erros={erros}
                type="tel"
                tipo='date'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Telefone"
                setState={setAtleta}
                dados={atleta}
                field="telefone"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="WhatsApp"
                setState={setAtleta}
                dados={atleta}
                field="whatsapp"
                erros={erros}
                type="tel"
                mask='tel'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2 }}>
              <Text
                field="senha"
                label="Senha"
                dados={atleta}
                setState={setAtleta}
                tipo='pass'
                erros={erros}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={8} sx={{ mt: 2, pl: { md: 1 } }}>
              <Text
                label="E-mail"
                setState={setAtleta}
                dados={atleta}
                field="email"
                erros={erros}
                type="email"
                disabled={localState.action === 'excluindo' ? true : false}
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
          <Condicional condicao={localState.action === 'detalhes'}>
            <Grid item xs={12}>
              <Cao rsAtleta={atleta} />
            </Grid>
          </Condicional>
        </Grid>
      </Paper >
    </Container >
  )
}