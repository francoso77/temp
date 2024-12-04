import { useContext, useEffect, useRef, useState } from 'react';
import { ProgramacaoInterface } from '../../../../jb_backend/src/interfaces/programacaoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import InputText from '../../Componentes/InputText';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import ComboBox from '../../Componentes/ComboBox';
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom';
import ClsValidacao from '../../Utils/ClsValidacao';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import DetalheProgramacao from './DetalheProgramacao';



export interface SomatorioProgramacaoInterface {
  total: string
  totalQtd: string
}

export default function ProgramacaoTinturaria() {

  const ResetDados: ProgramacaoInterface = {
    dataProgramacao: '',
    notaFiscal: '',
    idTinturaria: 0,
    msg: '',
    idPessoa_cliente: 0,
    detalheProgramacoes: [],
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioProgramacaoInterface = {
    total: '',
    totalQtd: ''
  }

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()
  const clsFormatacao: ClsFormatacao = new ClsFormatacao()

  const { setMensagemState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [programacao, setProgramacao] = useState<ProgramacaoInterface>(ResetDados)
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsTinturaria, setRsTinturaria] = useState<Array<TinturariaInterface>>([])
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioProgramacaoInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataProgramacao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Nota Fiscal',
      alinhamento: 'center',
      campo: 'notaFiscal',
      format: (nota) => clsFormatacao.notaFiscal(nota)
    },
    {
      cabecalho: 'Romaneio',
      alinhamento: 'left',
      campo: 'idTinturaria',
      //format: (_v, rs: any) => rs.clientes.nome
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'idPessoa',
      format: (_v, rs: any) => rs.cliente.nome
    },
  ]

  const pesquisarID = async (id: string | number): Promise<ProgramacaoInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: "Programacao",
        relations: [
          "cliente",
          "romaneio",
          "detalheProgramacoes",
          "detalheProgramacoes.produto",
          "detalheProgramacoes.cor",
        ],
        criterio: {
          idProgramacao: id,
        },
      });
    let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProgramacao);
    return {
      ...rs[0],
      dataProgramacao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
    };
  }
  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProgramacao(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProgramacao(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setProgramacao(ResetDados)
    setRsSomatorio({ total: "", totalQtd: "" })
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setProgramacao(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataProgramacao', programacao, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_cliente', programacao, erros, retorno, 'Informe um fornecedor')
    retorno = validaCampo.naoVazio('idTinturaria', programacao, erros, retorno, 'Informe o Romaneio')

    setErros(erros)
    return retorno
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

  const BuscarDados = () => {

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ['nome'],
        comparador: 'I',
        criterio: {
          tipoPessoa: ['J', 'C', 'F'],
        },
        camposLike: ['tipoPessoa'],
      })
      .then((rsClientes: Array<PessoaInterface>) => {
        setRsCliente(rsClientes)
      })

    clsCrud
      .pesquisar({
        entidade: "Tinturaria",
      })
      .then((rsTinturarias: Array<TinturariaInterface>) => {
        setRsTinturaria(rsTinturarias)
      })
  }

  const formatDateTimeForMySQL = (dateString: string): string => {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day} 00:00:00`
  }

  const formatNumber = (numString: string): string => {
    const paddedNum = numString.padStart(9, '0')
    return paddedNum.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }

  const btPesquisar = () => {
    const relations = [
      "cliente",
      "romaneio",
      "detalheProgramacoes",
      "detalheProgramacoes.produto",
      "detalheProgramacoes.cor",
    ];

    const msg = 'Pesquisando programações ...'
    const setMensagem = setMensagemState
    const idsClientes = rsCliente
      .filter(clientes => clientes.nome.includes(pesquisa.itemPesquisa))
      .map(clientes => clientes.idPessoa)

    let dadosPesquisa = {}
    let criterio = {}
    let camposLike = []
    let comparador = "L"
    const temNumero = /\d/.test(pesquisa.itemPesquisa)

    if (temNumero && pesquisa.itemPesquisa.includes('/')) {
      const formattedDateTime = formatDateTimeForMySQL(pesquisa.itemPesquisa)
      criterio = {
        dataProgramacao: formattedDateTime
      }
      camposLike = ['dataProgramacao']
    } else if (temNumero) {

      const formattedNumber = formatNumber(pesquisa.itemPesquisa);
      criterio = {
        notaFiscal: formattedNumber
      }
      camposLike = ['notaFiscal']
    } else {
      criterio = {
        idPessoa_cliente: idsClientes,
      }
      camposLike = ['idPessoa_cliente']
      comparador = 'I'
    }

    dadosPesquisa = {
      entidade: "Programacao",
      relations,
      comparador,
      criterio,
      camposLike,
      msg,
      setMensagemState: setMensagem
    }

    clsCrud
      .pesquisar(dadosPesquisa)
      .then((rs: Array<any>) => {
        console.log(rs)
        setRsPesquisa(rs);
      });
  }

  const AtualizaSomatorio = (rs: ProgramacaoInterface) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs.detalheProgramacoes) {
      rs.detalheProgramacoes.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPeca
        total = total + detalhe.peso
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }
  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo) {
        clsCrud.incluir({
          entidade: "Programacao",
          criterio: programacao,
          cb: () => btPesquisar(),
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
          entidade: "Programacao",
          criterio: {
            idProgramacao: programacao.idProgramacao
          },
          cb: () => btPesquisar(),
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
      tituloAnterior: 'Programação de Tinturaria',
      pathTitulo: '/',
      pathTituloAnterior: '/ProgramacaoTinturaria'
    })
    irPara('/')
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (
    <Container maxWidth="md" sx={{ mt: 0 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10} md={11}>
              <InputText
                label="Pesquisa"
                tipo="uppercase"
                dados={pesquisa}
                field="itemPesquisa"
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
                    icone: "find_in_page_two_tone",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onEditar(rs.idProgramacao as number),
                    toolTip: "Visualizar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProgramacaoInterface) =>
                      onExcluir(rs.idProgramacao as number),
                    toolTip: "Excluir",
                  },
                ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={programacao}
                  field="dataProgramacao"
                  setState={setProgramacao}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>

                <ComboBox
                  opcoes={rsCliente}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={programacao}
                  mensagemPadraoCampoEmBranco="Escolha um Cliente"
                  field="idPessoa_cliente"
                  label="Cliente"
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  setState={setProgramacao}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>

                <ComboBox
                  opcoes={rsTinturaria}
                  campoDescricao="idTinturaria"
                  campoID="idTinturaria"
                  dados={programacao}
                  mensagemPadraoCampoEmBranco="Escolha um Romaneio"
                  field="idTinturaria"
                  label="Romaneio"
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  setState={setProgramacao}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  type='text'
                  mask='nf'
                  tipo='mac'
                  label="Nota Fiscal"
                  dados={programacao}
                  field="notaFiscal"
                  setState={setProgramacao}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 0 }}>
              <Box ref={(el: any) => (fieldRefs.current[4] = el)}>
                <InputText
                  type='text'
                  tipo='uppercase'
                  label="Mensagem"
                  dados={programacao}
                  field="msg"
                  setState={setProgramacao}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalheProgramacao
                rsMaster={programacao}
                setRsMaster={setProgramacao}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd"
                labelAlign='center'
                dados={rsSomatorio}
                field="totalQtd"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Total"
                labelAlign='center'
                dados={rsSomatorio}
                field="total"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
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
              <Condicional condicao={['incluindo'].includes(localState.action)}>
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