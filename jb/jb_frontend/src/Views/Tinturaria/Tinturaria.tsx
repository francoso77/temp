import { useContext, useEffect, useRef, useState } from 'react'
import { TinturariaInterface } from '../../Interfaces/tinturariaInterface'
import { PessoaInterface } from '../../Interfaces/pessoaInterface'
import ClsCrud from '../../Utils/ClsCrudApi'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsValidacao from '../../Utils/ClsValidacao'
import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material'
import InputText from '../../Componentes/InputText'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import Condicional from '../../Componentes/Condicional/Condicional'
import { DataTableCabecalhoInterface, ItemSpeedDial } from '../../Componentes/DataTable'
import ComboBox from '../../Componentes/ComboBox'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import DetalheTinturaria from './DetalheTinturaria'
import { MensagemTipo } from '../../ContextoGlobal/MensagemState'
import { ProducaoMalhariaInterface } from '../../Interfaces/producaoMalhariaInterface'
import { DetalheEstruturaInterface } from '../../Interfaces/estruturaInterface'
import { EstoqueInterface } from '../../Interfaces/estoqueInterface'
import TableSelect from '../../Componentes/DataTable/tableSelect'
import ClsRelatorioProgramacao from '../../Utils/ClsRelatorioProgramacao'
import { UsuarioType } from '../../types/usuarioTypes'



export function Tinturaria() {

  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const validaCampo = new ClsValidacao()
  const clsRelatorios = new ClsRelatorioProgramacao()

  const ResetDados: TinturariaInterface = {
    dataTinturaria: '',
    idPessoa_cliente: 0,
    idPessoa_fornecedor: 0,
    programado: false,
    finalizado: false
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const { setLayoutState, layoutState, setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [tinturaria, setTinturaria] = useState<TinturariaInterface>(ResetDados)
  const [erros, setErros] = useState({})
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsFornecedor, setRsFornecedor] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Romaneio',
      alinhamento: 'left',
      campo: 'idTinturaria',
      format: (_v, rs: any) => rs.idTinturaria.toString(),
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

  const actions: Array<ItemSpeedDial> = [
    { icon: <PictureAsPdfRoundedIcon />, name: 'Relação Peças', tipo: "romaneio" },
  ]

  const MensagemErro = (erro: string) => {
    setMensagemState({
      titulo: 'Erro...',
      exibir: true,
      mensagem: erro.concat(' - Consulte Suporte'),
      tipo: MensagemTipo.Error,
      exibirBotao: true,
      cb: null
    })
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

  async function onStatus(
    selecao: any,
    setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>,
    tipo: "etiqueta" | "romaneio"
  ) {

    const tmp: Array<number> = []
    selecao.forEach((sel: any) => {

      tmp.push(rsPesquisa[sel].idTinturaria)

    })
    if (tipo === "romaneio") {
      onRomaneio(tmp)
    }
    setSelected([])
  }
  const onRomaneio = (id: Array<number>) => {
    clsRelatorios.renderTintuaria(id, () => {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Nenhum romaneio foi gerado, verifique as estruturas ou se existem alguma peça lançada.',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
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
        comparador: 'I',
        camposLike: ['tipoPessoa'],
        campoOrder: ['nome'],
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
        camposLike: ['tipoPessoa'],
        campoOrder: ['nome'],
      }).then((rsFornecedores: Array<PessoaInterface>) => {
        if (rsFornecedores.length > 0) {
          setRsFornecedor(rsFornecedores)
        }
      })
  }

  const irPara = useNavigate();
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Tinturaria',
      pathTitulo: '/',
      pathTituloAnterior: '/Tinturaria'
    })
    irPara('/')
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

  const formatDateTimeForMySQL = (dateString: string): string => {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month}-${day} 00:00:00`
  }
  const btPesquisar = () => {

    const relations = [
      "cliente",
      "fornecedor",
      "detalheTinturarias",
      "detalheTinturarias.malharia",
    ];

    const msg = 'Pesquisando dados ...'
    const setMensagem = setMensagemState
    const idsCli = rsCliente
      .filter(cliente => cliente.nome.includes(pesquisa.itemPesquisa))
      .map(cliente => cliente.idPessoa)

    let dadosPesquisa = {}
    let criterio = {}
    let camposLike = []
    let comparador = "L"

    const temNumero = /\d/.test(pesquisa.itemPesquisa)

    if (temNumero && pesquisa.itemPesquisa.includes('/')) {

      const formattedDateTime = formatDateTimeForMySQL(pesquisa.itemPesquisa)
      criterio = {
        dataTinturaria: formattedDateTime
      }
      camposLike = ['dataTinturaria']
    } else if (temNumero) {

      criterio = {
        idTinturaria: pesquisa.itemPesquisa
      }
      camposLike = ['idTinturaria']
    } else {
      criterio = {
        idPessoa_cliente: idsCli,
      }
      camposLike = ['idPessoa_cliente']
      comparador = 'I'
    }

    dadosPesquisa = {
      entidade: "Tinturaria",
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

  const TemEstrutura = async (idProduto: number): Promise<Array<DetalheEstruturaInterface> | null> => {
    try {
      const [estrutura] = await clsCrud.pesquisar({
        entidade: 'Estrutura',
        relations: ['detalheEstruturas'],
        criterio: { idProduto: idProduto },
      })

      // Verifica se existe a estrutura e retorna detalheEstruturas ou um array vazio
      return estrutura?.detalheEstruturas ?? null;
    } catch (error) {
      MensagemErro('Produto sem estrutua definida')
      console.error('Erro ao buscar estrutura:', error)
      return null
    }
  }
  const TemEstoque = async (idProduto: number, cliente: number): Promise<EstoqueInterface> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: 'Estoque',
        criterio: {
          idProduto: idProduto,
          idPessoa_fornecedor: cliente,
        },
      })
    //verifica se o resultado não está vazio e retorna o primeiro item   
    if (rs.length > 0) {
      return rs[0];
    } else {
      // MensagemErro('Produto sem estoque')
      const estoqueZerado: EstoqueInterface = {
        idProduto: idProduto,
        idPessoa_fornecedor: cliente,
        idCor: null,
        qtd: 0
      }
      return estoqueZerado;
    }
  }
  const MovimentaEstoque = async (idTinturaria: number): Promise<boolean> => {
    try {
      const tmpProducao: Array<any> = await clsCrud.consultar({
        entidade: 'ProducaoMalharia',
        criterio: {
          idTinturaria: idTinturaria,
          fechado: true,
        },
        groupBy: 'idProduto',
        select: ['idTinturaria', 'idProduto', 'SUM(peso) AS peso_total', 'fechado'],
      });

      if (tmpProducao.length > 0) {
        for (const producao of tmpProducao) {
          const detalheEstrutura = await TemEstrutura(producao.idProduto);
          if (detalheEstrutura) {
            for (const det of detalheEstrutura) {
              const estoque = await TemEstoque(det.idProduto, tinturaria.idPessoa_cliente);

              if (estoque) {
                estoque.qtd = Number((estoque.qtd + (producao.peso_total * det.qtd)).toFixed(2))

                const rsEstoque = await clsCrud.incluir({
                  entidade: 'Estoque',
                  criterio: estoque,
                });

                if (!rsEstoque.ok) {
                  MensagemErro('Estoque não foi atualizado');
                  return false;
                }
              }
            }
          } else {
            MensagemErro('Produto sem estrutura definida');
            return false;
          }
        }
        return true;
      } else {
        //MensagemErro('Nenhuma produção encontrada para alteração');
        return false;
      }
    } catch (e) {
      console.log('Erro ao alterar o estoque:', e);
      return false;
    }
  };
  const AtualizaProducao = async (idTinturaria: number): Promise<boolean> => {
    try {
      const podeAtualizarProducao = await MovimentaEstoque(idTinturaria)
      if (podeAtualizarProducao) {

        let tmpProducao: Array<ProducaoMalhariaInterface> = await clsCrud.pesquisar({
          entidade: 'ProducaoMalharia',
          criterio: { idTinturaria: idTinturaria },
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
          token: usuarioState.token,
        });

        if (!rs.ok) {
          setMensagemState({
            titulo: 'Erro...',
            exibir: true,
            mensagem: 'Não foi possível alterar os itens da produção - Consulte Suporte',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null,
          });
          return false;
        } else {
          return true;
        }
      } else {
        return false
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
            token: usuarioState.token,

          })
          .then((rs) => {
            if (rs.ok) {
              if (localState.action === actionTypes.incluindo) {

                setTinturaria(rs.dados)
                setLocalState({ action: actionTypes.detalhes })
              } else {
                setLocalState({ action: actionTypes.pesquisando })
              }
              btPesquisar()
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
                criterio: { idTinturaria: tinturaria.idTinturaria },
                token: usuarioState.token,
              }).then((rs) => {
                if (!rs.ok) {
                  console.log('Não foi possível excluir os detalhes da tinturaria')
                  console.log(rs.mensagem)
                }
              })
          }
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
        })
      }
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarDados()
    }
    carregarDados()
  }, [])

  useEffect(() => {
    if (rsCliente.length > 0) {
      btPesquisar()
    }
  }, [rsCliente])


  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 0 }}>
        <Paper variant="outlined" sx={{ padding: 1 }}>
          <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Tooltip title={'Fechar'}>
                <IconButton onClick={() => btFechar()}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Condicional condicao={localState.action === 'pesquisando'}>
              <Grid item xs={10} md={11}>
                <InputText
                  label="Buscar por romaneio, data ou cliente"
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
                <TableSelect
                  ItemSpeed={actions}
                  cabecalho={cabecalhoForm}
                  dados={rsPesquisa}
                  tituloTabela='Romaneios gerados'
                  onStatus={onStatus}
                  acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
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
                    {
                      icone: "picture_as_pdf_rounded_icon",
                      onAcionador: (rs: TinturariaInterface) =>
                        onRomaneio([rs.idTinturaria as number]),
                      toolTip: "Relação Peças",
                    },
                  ] : [
                    {
                      icone: 'edit',
                      onAcionador: (rs: TinturariaInterface) =>
                        onEditar(rs.idTinturaria as number),
                      toolTip: "Editar",
                    },
                    {
                      icone: "assignment_turned_in_two_tone",
                      onAcionador: (rs: TinturariaInterface) =>
                        onDetalhes(rs.idTinturaria as number),
                      toolTip: "Romaneio",
                    },
                    {
                      icone: "picture_as_pdf_rounded_icon",
                      onAcionador: (rs: TinturariaInterface) =>
                        onRomaneio([rs.idTinturaria as number]),
                      toolTip: "Relação Peças",
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