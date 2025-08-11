import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MaquinaInterface } from '../../Interfaces/maquinaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
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

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<MaquinaInterface>>([])
  const [erros, setErros] = useState({})
  const [maquina, setMaquina] = useState<MaquinaInterface>(ResetDados)
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

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
  const pesquisarID = (id: string | number): Promise<MaquinaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Maquina",
        criterio: {
          idMaquina: id,
        },
      })
      .then((rs: Array<MaquinaInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataPreventiva)
        return {
          ...rs[0],
          dataPreventiva: clsFormatacao.dataISOtoDatetime(dt)
        }
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

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
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
          nome: maquina.nome,
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
                setMensagemState: setMensagemState,
                token: usuarioState.token
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
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Máquinas',
      pathTitulo: '/',
      pathTituloAnterior: '/Maquina'
    })
    irPara('/')
  }

  return (

    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <Tooltip title={'Fechar'}>
              <IconButton onClick={() => btFechar()}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
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
            <Grid item xs={2} md={1}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 5, ml: { xs: 1, md: 2 } }}
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
              />
            </Grid>
          </Condicional>

          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} sm={12} md={12} sx={{ textAlign: 'left' }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  label="Ativo"
                  tipo="checkbox"
                  dados={maquina}
                  field="ativo"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
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
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <InputText
                  label="Marca"
                  tipo="uppercase"
                  dados={maquina}
                  field="marca"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  label="Tipo Tear"
                  tipo="uppercase"
                  dados={maquina}
                  field="tipoTear"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <InputText
                  label="Modelo"
                  tipo="uppercase"
                  dados={maquina}
                  field="modelo"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 5)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
                <InputText
                  label="Série"
                  tipo="uppercase"
                  dados={maquina}
                  field="serie"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 6)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Próxima Preventiva"
                  dados={maquina}
                  field="dataPreventiva"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 7)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
                <InputText
                  label="Platina"
                  tipo="uppercase"
                  dados={maquina}
                  field="platina"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 8)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
                <InputText
                  label="Correia"
                  tipo="uppercase"
                  dados={maquina}
                  field="correia"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 9)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[9] = el)}>
                <InputText
                  label="Agulha"
                  tipo="uppercase"
                  dados={maquina}
                  field="agulha"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  maxLength={15}
                  onKeyDown={(event: any) => btPulaCampo(event, 10)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[10] = el)}>
                <InputText
                  label="Qtd Agulhas"
                  tipo="number"
                  dados={maquina}
                  field="qtdAgulhas"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 11)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[11] = el)}>
                <InputText
                  label="Qtd Alimentadores"
                  tipo="number"
                  dados={maquina}
                  field="qtdAlimentadores"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 12)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[12] = el)}>
                <InputText
                  label="Diâmetro"
                  tipo="currency"
                  dados={maquina}
                  field="diametro"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  scale={2}
                  onKeyDown={(event: any) => btPulaCampo(event, 13)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[13] = el)}>
                <InputText
                  label="Espessura"
                  tipo="currency"
                  dados={maquina}
                  field="espessura"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  scale={2}
                  onKeyDown={(event: any) => btPulaCampo(event, 14)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} md={3} sx={{ textAlign: 'left' }}>
              <Box ref={(el: any) => (fieldRefs.current[14] = el)}>
                <InputText
                  label="Kit Elastano?"
                  tipo="checkbox"
                  dados={maquina}
                  field="kitElastano"
                  setState={setMaquina}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
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