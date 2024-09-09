import { useContext, useEffect, useRef, useState } from 'react'
import { TinturariaInterface } from '../../../../jb_backend/src/interfaces/tinturariaInterface'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import ClsCrud from '../../Utils/ClsCrudApi'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsValidacao from '../../Utils/ClsValidacao'
import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material'
import InputText from '../../Componentes/InputText'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import Condicional from '../../Componentes/Condicional/Condicional'
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable'
import ComboBox from '../../Componentes/ComboBox'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import DetalheTinturaria from './DetalheTinturaria'
import { MensagemTipo } from '../../ContextoGlobal/MensagemState'
import { ProducaoMalhariaInterface } from '../../../../jb_backend/src/interfaces/producaoMalhariaInterface'



export function Tinturaria() {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const validaCampo = new ClsValidacao()

  const ResetDados: TinturariaInterface = {
    dataTinturaria: '',
    idPessoa_cliente: 0,
    idPessoa_fornecedor: 0,
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [tinturaria, setTinturaria] = useState<TinturariaInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsFornecedor, setRsFornecedor] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])
  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Romaneio',
      alinhamento: 'left',
      campo: 'idTinturaria',
    },
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataTinturaria',
      format: (data) => clsFormatacao.dataISOtoUser(data),
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'center',
      campo: 'idPessoa_cliente',
      format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Tinturaria',
      alinhamento: 'left',
      campo: 'idPessoa_fornecedor',
      format: (_v, rs: any) => rs.fornecedor.nome
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property);
  }

  const pesquisarID = (id: string | number): Promise<TinturariaInterface> => {

    return clsCrud
      .pesquisar({
        entidade: "Tinturaria",
        criterio: {
          idTinturaria: id,
        },
        select: ['idTinturaria', 'idPessoa_cliente', 'idPessoa_fornecedor', 'dataTinturaria']
      })
      .then((rs: Array<TinturariaInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataTinturaria)
        return {
          ...rs[0],
          dataTinturaria: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const onDetalhes = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTinturaria(rs)
      setLocalState({ action: actionTypes.detalhes })
    })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTinturaria(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTinturaria(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setTinturaria(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setTinturaria(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          tipoPessoa: ['J', 'C']
        },
        notOrLike: 'I',
        camposLike: ['tipoPessoa']
      }).then((rsClientes: Array<PessoaInterface>) => {
        if (rsClientes.length > 0) {
          setRsCliente(rsClientes)
        }
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        criterio: {
          tipoPessoa: ['F']
        },
        camposLike: ['tipoPessoa']
      }).then((rsFornecedores: Array<PessoaInterface>) => {
        if (rsFornecedores.length > 0) {
          setRsFornecedor(rsFornecedores)
        }
      })
  }

  const IrPara = useNavigate();
  const btFechar = () => {
    setLayoutState(prevState => {
      const newState = {
        titulo: '',
        tituloAnterior: 'Tinturaria',
        pathTitulo: '/',
        pathTituloAnterior: '/Tinturaria'
      };
      IrPara(newState.pathTitulo)
      return newState
    })
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

  const btPesquisar = () => {

    let dadosPesquisa = {}
    const temNumero = /\d/.test(pesquisa.itemPesquisa)
    if (temNumero) {
      dadosPesquisa = {
        campoOrder: ['dataTinturaria'],
        entidade: "Tinturaria",
        relations: [
          "cliente",
          "fornecedor",
          "detalheTinturarias",
          "detalheTinturarias.malharia",
        ],
        criterio: {
          dataTinturaria: "%".concat(pesquisa.itemPesquisa).concat("%"),
        },
        camposLike: ['dataTinturaria'],

        msg: 'Pesquisando notas ...',
        setMensagemState: setMensagemState
      }
    } else {

      const idsCli = rsCliente.filter(cliente =>
        cliente.nome.includes(pesquisa.itemPesquisa)
      ).map(cliente => cliente.idPessoa)

      dadosPesquisa = {
        campoOrder: ['dataTinturaria'],
        entidade: "Tinturaria",
        relations: [
          "cliente",
          "fornecedor",
          "detalheTinturarias",
          "detalheTinturarias.malharia",
        ],
        notOrLike: 'I',
        criterio: {
          idPessoa_cliente: idsCli,
        },
        camposLike: ['idPessoa_cliente'],
        msg: 'Pesquisando notas ...',
        setMensagemState: setMensagemState
      }
    }
    clsCrud
      .pesquisar(dadosPesquisa)
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataTinturaria', tinturaria, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_cliente', tinturaria, erros, retorno, 'Informe um cliente')
    retorno = validaCampo.naoVazio('idPessoa_fornecedor', tinturaria, erros, retorno, 'Informe um fornecedor')

    setErros(erros)
    return retorno
  }

  const AtualizaProducao = async (id: number): Promise<boolean> => {
    try {
      let tmpProducao: Array<ProducaoMalhariaInterface> = await clsCrud.pesquisar({
        entidade: 'ProducaoMalharia',
        criterio: { idTinturaria: id },
      });

      if (tmpProducao.length > 0) {
        tmpProducao.forEach((producao) => {
          producao.dataFechado = "";
          producao.fechado = false;
          producao.idTinturaria = null;
        });
      }

      const rs = await clsCrud.incluir({
        entidade: 'ProducaoMalharia',
        criterio: tmpProducao,
      });

      if (!rs.ok) {
        setMensagemState({
          titulo: 'Erro...',
          exibir: true,
          mensagem: 'Não foi possível alterar os items da produção - Consulte Suporte',
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null,
        });
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log('sem produtos para alteração!');
      return false;
    }
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (['incluindo', 'editando'].includes(localState.action)) {

        clsCrud
          .incluir({
            entidade: 'Tinturaria',
            criterio: tinturaria,
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
      } else {

        AtualizaProducao(tinturaria.idTinturaria as number).then((v) => {
          if (v) {
            clsCrud
              .excluir({
                entidade: "DetalheTinturaria",
                criterio: { idTinturaria: tinturaria.idTinturaria }
              }).then((rs) => {
                if (!rs.ok) {
                  console.log('Não foi possível excluir os detalhes da tinturaria')
                  console.log(rs.mensagem)
                } else {
                  clsCrud
                    .excluir({
                      entidade: 'Tinturaria',
                      criterio: tinturaria,
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
                }
              })
          }
        })
      }
    }
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (
    <>
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt:-1.5, mr:-5, mb:-5}}>
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
                      icone: 'edit',
                      onAcionador: (rs: TinturariaInterface) =>
                        onEditar(rs.idTinturaria as number),
                      toolTip: "Editar",
                    },
                    {
                      icone: "delete",
                      onAcionador: (rs: TinturariaInterface) =>
                        onExcluir(rs.idTinturaria as number),
                      toolTip: "Excluir",
                    },
                    {
                      icone: "assignment_turned_in_two_tone",
                      onAcionador: (rs: TinturariaInterface) =>
                        onDetalhes(rs.idTinturaria as number),
                      toolTip: "Romaneio",
                    },
                  ]}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
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
                    dados={tinturaria}
                    field="dataTinturaria"
                    setState={setTinturaria}
                    disabled={['excluindo'].includes(localState.action) ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                    autoFocus
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <ComboBox
                    opcoes={rsCliente}
                    campoDescricao="nome"
                    campoID="idPessoa"
                    dados={tinturaria}
                    mensagemPadraoCampoEmBranco="Escolha um cliente"
                    field="idPessoa_cliente"
                    label="Cliente"
                    disabled={['excluindo'].includes(localState.action) ? true : false}
                    erros={erros}
                    setState={setTinturaria}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 2)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <ComboBox
                    opcoes={rsFornecedor}
                    campoDescricao="nome"
                    campoID="idPessoa"
                    dados={tinturaria}
                    mensagemPadraoCampoEmBranco="Escolha uma tinturaria"
                    field="idPessoa_fornecedor"
                    label="Tinturaria"
                    disabled={['excluindo'].includes(localState.action) ? true : false}
                    erros={erros}
                    setState={setTinturaria}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event) => btPulaCampo(event, 3)}
                  />
                </Box>
              </Grid>
            </Condicional>
            <Condicional condicao={['detalhes', 'excluindo'].includes(localState.action)}>
              <Grid item xs={12}>
                <DetalheTinturaria
                  rsMaster={tinturaria}
                  setMasterLocalState={setLocalState}
                  masterLocalState={localState}
                />
              </Grid>
            </Condicional>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Condicional condicao={!['pesquisando', 'detalhes'].includes(localState.action)}>
                <Tooltip title={'Cancelar'}>
                  <IconButton
                    color="secondary"
                    sx={{ mt: 3, ml: 2 }}
                    onClick={() => btCancelar()}
                  >
                    <CancelRoundedIcon sx={{ fontSize: 50 }} />
                  </IconButton>
                </Tooltip>
              </Condicional>
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
          </Grid>
        </Paper >
      </Container >
    </>
  )
}