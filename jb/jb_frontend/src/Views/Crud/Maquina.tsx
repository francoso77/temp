import { Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MaquinaInterface } from '../../../../jb_backend/src/interfaces/maquinaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ClsFormatacao from '../../Utils/ClsFormatacao';


export default function Maquina() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: MaquinaInterface = {
    nome: '',
    marca: '',
    tipoTear: '',
    kitElastano: false,
    modelo: '',
    serie: '',
    qtdAgulhas: 0,
    qtdAlimentadores: 0,
    diametro: 0,
    espessura: 0,
    platina: '',
    correia: '',
    agulha: '',
    dataPreventiva: '',
    ativo: true,
  }
  interface PesquisaInterface {
    nome: string
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<MaquinaInterface>>([])
  const [erros, setErros] = useState({})
  const [maquina, setMaquina] = useState<MaquinaInterface>(ResetDados)
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
      cabecalho: 'Tear',
      alinhamento: 'left',
      campo: 'tipoTear'
    },

    {
      cabecalho: 'Modelo',
      alinhamento: 'left',
      campo: 'modelo'
    },
    {
      cabecalho: 'Próxima Preventiva',
      alinhamento: 'left',
      campo: 'dataPreventiva',
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

  const pesquisarID = (id: string | number): Promise<MaquinaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Maquina",
        criterio: {
          idMaquina: id,
        },
      })
      .then((rs: Array<MaquinaInterface>) => {
        return rs[0]
      })
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setMaquina(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setMaquina(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setMaquina(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }
  const btCancelar = () => {
    setErros({})
    setMaquina(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('nome', maquina, erros, retorno, 'Nome ds máquina não pode ser vázio')
    retorno = validaCampo.naoVazio('marca', maquina, erros, retorno, 'Informe a marca do tear')
    retorno = validaCampo.naoVazio('tipoTear', maquina, erros, retorno, 'Qual o tipo do tear')
    retorno = validaCampo.naoVazio('modelo', maquina, erros, retorno, 'Informe o modelo do tear')
    retorno = validaCampo.naoVazio('serie', maquina, erros, retorno, 'Informe o número de série')
    retorno = validaCampo.naoVazio('qtdAgulhas', maquina, erros, retorno, 'Deve ser maior que zero')
    retorno = validaCampo.naoVazio('qtdAlimentadores', maquina, erros, retorno, 'Deve ser maior que zero')
    retorno = validaCampo.naoVazio('diametro', maquina, erros, retorno, 'Deve ser maior que zero')
    retorno = validaCampo.naoVazio('espessura', maquina, erros, retorno, 'Deve ser maior que zero')
    retorno = validaCampo.naoVazio('platina', maquina, erros, retorno, 'Qual o tipo de platina')
    retorno = validaCampo.naoVazio('correia', maquina, erros, retorno, 'Qual o tipo de correia')
    retorno = validaCampo.naoVazio('agulha', maquina, erros, retorno, 'Qual o tipo de agulha')
    retorno = validaCampo.eData('dataPreventiva', maquina, erros, retorno,)

    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    clsCrud
      .pesquisar({
        entidade: "Maquina",
        criterio: {
          nome: "%".concat(maquina.nome).concat("%"),
        },
        camposLike: ["nome"],
        select: ["nome"],
        msg: 'Pesquisando máquinas ...',
        setMensagemState: setMensagemState
      })
      .then((rs) => {
        if (rs.length > 0 && localState.action === actionTypes.incluindo) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Item já cadastrado!',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
        } else {

          if (validarDados()) {

            if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
              clsCrud.incluir({
                entidade: "Maquina",
                criterio: maquina,
                localState: localState,
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
                entidade: "Maquina",
                criterio: {
                  idMaquina: maquina.idMaquina
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
      })
  }

  const btPesquisar = () => {
    clsCrud
      .pesquisar({
        entidade: "Maquina",
        criterio: {
          nome: "%".concat(pesquisa.nome).concat("%"),
        },
        camposLike: ["nome"],
        // select: [
        //   "idMaquina",
        //   "nome",
        //   "marca",
        //   "tipoTear",
        //   "kitElastano",
        //   "modelo",
        //   "serie",
        //   "qtdAgulhas",
        //   "qtdAlimentadores",
        //   "diametro",
        //   "espessura",
        //   "platina",
        //   "correia",
        //   "agulha",
        //   "dataPreventiva",
        //   "ativo",
        // ],
        msg: 'Pesquisando máquinas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<MaquinaInterface>) => {
        setRsPesquisa(rs)
      })
  }
  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Cadastro de Máquinas',
      pathTitulo: '/',
      pathTituloAnterior: '/Maquina'
    })
    irPara('/')
  }

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
              <InputText
                label="Pesquisa"
                tipo="uppercase"
                dados={pesquisa}
                field="nome"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
                autoFocus
              />
            </Grid>
            <Grid item xs={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 4, ml: { xs: 0, md: 2 } }}
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
                    onAcionador: (rs: MaquinaInterface) =>
                      onEditar(rs.idMaquina as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: MaquinaInterface) =>
                      onExcluir(rs.idMaquina as number),
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
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <InputText
                label="Ativo"
                tipo="checkbox"
                dados={maquina}
                field="ativo"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Nome"
                tipo="uppercase"
                dados={maquina}
                field="nome"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={35}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Marca"
                tipo="uppercase"
                dados={maquina}
                field="marca"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Tipo Tear"
                tipo="uppercase"
                dados={maquina}
                field="tipoTear"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Modelo"
                tipo="uppercase"
                dados={maquina}
                field="modelo"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Série"
                tipo="uppercase"
                dados={maquina}
                field="serie"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Próxima Preventiva"
                setState={setMaquina}
                dados={maquina}
                field="dataPreventiva"
                erros={erros}
                type="tel"
                tipo='date'
                disabled={localState.action === 'excluindo' ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Platina"
                tipo="uppercase"
                dados={maquina}
                field="platina"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Correia"
                tipo="uppercase"
                dados={maquina}
                field="correia"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Agulha"
                tipo="uppercase"
                dados={maquina}
                field="agulha"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                maxLength={15}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Qtd Agulhas"
                tipo="number"
                dados={maquina}
                field="qtdAgulhas"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Qtd Alimentadores"
                tipo="number"
                dados={maquina}
                field="qtdAlimentadores"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Diâmetro"
                tipo="currency"
                dados={maquina}
                field="diametro"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                scale={2}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                label="Espessura"
                tipo="currency"
                dados={maquina}
                field="espessura"
                setState={setMaquina}
                disabled={localState.action === 'excluindo' ? true : false}
                erros={erros}
                scale={2}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} sx={{ textAlign: 'left' }}>
              <InputText
                label="Kit Elastano?"
                tipo="checkbox"
                dados={maquina}
                field="kitElastano"
                setState={setMaquina}
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
        </Grid>
      </Paper >
    </Container >
  )
}