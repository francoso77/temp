import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import Condicional from '../../Componentes/Condicional/Condicional'
import ClsValidacao from '../../Utils/ClsValidacao'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import ClsCrud from '../../Utils/ClsCrudApi'
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable'
import { MensagemTipo } from '../../ContextoGlobal/MensagemState'
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import DeleteIcon from '@mui/icons-material/Delete'
import InputText from '../../Componentes/InputText'
import ComboBox from '../../Componentes/ComboBox'
import { EntradaInterface } from '../../../../jb_backend/src/interfaces/entradaInterface'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import DetalhePedido from './DetalheEntrada'
import { EstoqueInterface } from '../../../../jb_backend/src/interfaces/estoqueInterface'

export interface SomatorioEntradaInterface {
  total: string
  totalQtd: string
}

export default function Entrada() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: EntradaInterface = {
    dataEmissao: '',
    observacao: '',
    notaFiscal: '',
    idPessoa_fornecedor: 0,
    detalheEntradas: []
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioEntradaInterface = {
    total: '',
    totalQtd: ''
  }
  const { mensagemState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [entrada, setEntrada] = useState<EntradaInterface>(ResetDados)
  const [rsFornecedor, setRsFornecedor] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome')
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioEntradaInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'dataEmissao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Nota Fiscal',
      alinhamento: 'center',
      campo: 'notaFiscal',
      format: (nota) => clsFormatacao.notaFiscal(nota)
    },
    {
      cabecalho: 'Fornecedor',
      alinhamento: 'left',
      campo: 'idPessoa_fornecedor',
      format: (_v, rs: any) => rs.fornecedor.nome
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

  const pesquisarID = (id: string | number): Promise<EntradaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Entrada",
        relations: [
          "fornecedor",
          "detalheEntradas",
          "detalheEntradas.produto",
          "detalheEntradas.cor",
          "detalheEntradas.revisador",
          "detalheEntradas.romaneio",
        ],
        criterio: {
          idEntrada: id,
        },
      })
      .then((rs: Array<EntradaInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataEmissao)
        return {
          ...rs[0],
          dataEmissao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const pesquisarEstoque = (fornecedor: number, produto: number): Promise<EstoqueInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "Estoque",
        criterio: {
          idProduto: produto,
          idPessoa_fornecedor: fornecedor
        },
      })
      .then((rs: Array<EstoqueInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEntrada(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setEntrada(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setEntrada(ResetDados)
    setRsSomatorio({ total: "", totalQtd: "" })
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setEntrada(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataEmissao', entrada, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_fornecedor', entrada, erros, retorno, 'Informe um fornecedor')
    retorno = validaCampo.naoVazio('notaFiscal', entrada, erros, retorno, 'Deve conter o número da nota fiscal')

    setErros(erros)
    return retorno
  }

  const AtualizaSomatorio = (rs: EntradaInterface) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs.detalheEntradas) {
      rs.detalheEntradas.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtd
        total = total + (detalhe.qtd * detalhe.vrUnitario)
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const MovimentaEstoque = (tp: "Incluir" | "Excluir") => {

    entrada.detalheEntradas.forEach((dadosEstoque) => {
      let novaQtd: number = 0
      pesquisarEstoque(entrada.idPessoa_fornecedor, dadosEstoque.idProduto)
        .then((rs) => {
          let tmpEstoque: EstoqueInterface = rs
          if (rs) {
            if (tp === "Incluir") {
              novaQtd = rs.qtd + dadosEstoque.qtd
            } else {
              novaQtd = rs.qtd - dadosEstoque.qtd
            }
            tmpEstoque = {
              ...tmpEstoque,
              qtd: novaQtd,
            }
          } else {
            tmpEstoque = {
              idProduto: dadosEstoque.idProduto,
              idPessoa_fornecedor: entrada.idPessoa_fornecedor,
              idCor: dadosEstoque.idCor,
              qtd: dadosEstoque.qtd
            }
          }
          clsCrud.incluir({
            entidade: "Estoque",
            criterio: tmpEstoque,
          })
            .then((rs) => {
              if (rs.ok) {
                setMensagemState({
                  titulo: 'Entradas...',
                  exibir: true,
                  mensagem: 'Estoque atualizado com sucesso!',
                  tipo: MensagemTipo.Ok,
                  exibirBotao: true,
                  cb: () => btPesquisar(),
                })
              } else {
                setMensagemState({
                  titulo: 'Erro...',
                  exibir: true,
                  mensagem: 'Estoque não foi atualizado - consulte o suporte',
                  tipo: MensagemTipo.Error,
                  exibirBotao: true,
                  cb: null
                })
              }
            })
        })
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

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo) {
        clsCrud.incluir({
          entidade: "Entrada",
          criterio: entrada,
          cb: () => btPesquisar(),
        })
          .then((rs) => {
            if (rs.ok) {
              MovimentaEstoque('Incluir')
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
          entidade: "Entrada",
          criterio: {
            idEntrada: entrada.idEntrada
          },
          cb: () => btPesquisar(),
        })
          .then((rs) => {
            MovimentaEstoque('Excluir')
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

    let dadosPesquisa = {}
    const temNumero = /\d/.test(pesquisa.itemPesquisa)
    if (temNumero) {
      dadosPesquisa = {
        entidade: "Entrada",
        relations: [
          "fornecedor",
          "detalheEntradas",
          "detalheEntradas.produto",
          "detalheEntradas.cor",
          "detalheEntradas.revisador",
          "detalheEntradas.romaneio",
        ],
        criterio: {
          notaFiscal: "%".concat(pesquisa.itemPesquisa).concat("%"),
        },
        camposLike: ['notaFiscal'],
        msg: 'Pesquisando notas ...',
        setMensagemState: setMensagemState
      }
    } else {

      const idsFor = rsFornecedor.filter(fornecedor =>
        fornecedor.nome.includes(pesquisa.itemPesquisa)
      ).map(fornecedor => fornecedor.idPessoa)
      dadosPesquisa = {
        entidade: "Entrada",
        relations: [
          "fornecedor",
          "detalheEntradas",
          "detalheEntradas.produto",
          "detalheEntradas.cor",
          "detalheEntradas.revisador",
          "detalheEntradas.romaneio",
        ],
        notOrLike: 'I',
        criterio: {
          idPessoa_fornecedor: idsFor,
        },
        camposLike: ['idPessoa_fornecedor'],
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

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Entradas de produtos',
      pathTitulo: '/',
      pathTituloAnterior: '/Entrada'
    })
    irPara('/')
  }

  const BuscarDados = () => {

    let query: string = `
      SELECT 
          p.*
      FROM 
          pessoas p
      WHERE 
          p.tipoPessoa = 'J' OR
          p.tipoPessoa = 'C' OR
          p.tipoPessoa = 'F' 
      ORDER BY
          p.nome ASC;
      `;
    clsCrud
      .query({
        entidade: "Pessoa",
        sql: query,
        setMensagemState: setMensagemState
      })
      .then((rsFornecedores: Array<PessoaInterface>) => {
        setRsFornecedor(rsFornecedores)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  return (

    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: -1.5, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Condicional condicao={localState.action === 'pesquisando'}>
            <Grid item xs={10}>
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
            <Grid item xs={2}>
              <Tooltip title={'Incluir'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 4, ml: 2 }}
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
                    onAcionador: (rs: EntradaInterface) =>
                      onEditar(rs.idEntrada as number),
                    toolTip: "Visualizar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: EntradaInterface) =>
                      onExcluir(rs.idEntrada as number),
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
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  dados={entrada}
                  field="dataEmissao"
                  setState={setEntrada}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>

                <ComboBox
                  opcoes={rsFornecedor}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={entrada}
                  mensagemPadraoCampoEmBranco="Escolha um fornecedor"
                  field="idPessoa_fornecedor"
                  label="Fornecedor"
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  setState={setEntrada}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <InputText
                  type='text'
                  mask='nf'
                  tipo='mac'
                  label="Nota Fiscal"
                  dados={entrada}
                  field="notaFiscal"
                  setState={setEntrada}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  type='text'
                  tipo='uppercase'
                  label="Observação"
                  dados={entrada}
                  field="observacao"
                  setState={setEntrada}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  erros={erros}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalhePedido
                rsMaster={entrada}
                setRsMaster={setEntrada}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd Total"
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
                label="Total Entrada"
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
