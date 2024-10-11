import { Box, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import { ProducaoDublagemInterface } from '../../../../jb_backend/src/interfaces/producaoDublagemInterface';
import { TipoColagemType, TipoColagemTypes } from '../../types/tipoColagemTypes';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import DetalheProducaoDubalgem from './DetalheProducaoDubalgem';
import { StatusPedidoType } from '../../types/statusPedidoTypes';
import { StatusPedidoItemType } from '../../types/statusPedidoItemTypes';

export interface SomatorioProducaoDublagemInterface {
  total: string
}

export default function ProducaoDublagem() {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()

  const ResetDados: ProducaoDublagemInterface = {
    dataProducao: '',
    tipoColagem: TipoColagemType.cola,
    idPedido: 0,
    detalheProducaoDublagens: []
  }

  interface PesquisaInterface {
    itemPesquisa: string
  }

  const SomatorioDados: SomatorioProducaoDublagemInterface = {
    total: '',
  }

  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [producaoDublagem, setProducaoDublagem] = useState<ProducaoDublagemInterface>(ResetDados)
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '' })
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioProducaoDublagemInterface>(SomatorioDados)
  const [rsQtdPedida, setRsQtdPedida] = useState<SomatorioProducaoDublagemInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [

    {
      cabecalho: 'Data',
      alinhamento: 'center',
      campo: 'dataProducao',
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Pedido',
      alinhamento: 'center',
      campo: 'pedido',
      largura: 15,
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'cliente'
      // campo: 'idPessoa_cliente',
      // format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Metros Cortados',
      alinhamento: 'right',
      campo: 'metros',
      format: (v) => clsFormatacao.currency(v)
    },
  ]

  const pesquisarID = async (id: string | number): Promise<ProducaoDublagemInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "ProducaoDublagem",
        relations: [
          "detalheProducaoDublagens"
        ],
        criterio: {
          idDublagem: id,
        },
      })
      .then((rs: Array<ProducaoDublagemInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataProducao)
        return {
          ...rs[0],
          dataProducao: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
        }
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProducaoDublagem(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setProducaoDublagem(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  useEffect(() => {
    if (producaoDublagem) {
      if (localState.action === actionTypes.excluindo || localState.action === actionTypes.editando) {
        alterarStatusItem('Excluir');
      }
    }
  }, [producaoDublagem])

  const btIncluir = () => {
    setRsSomatorio({ total: '0' })
    setRsQtdPedida({ total: '0' })
    setProducaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setProducaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataProducao', producaoDublagem, erros, retorno)
    retorno = validaCampo.naoVazio('idPedido', producaoDublagem, erros, retorno, 'Informe o pedido')
    retorno = validaCampo.naoVazio('tipoColagem', producaoDublagem, erros, retorno, 'Qual o tipo de colagem?')

    setErros(erros)
    return retorno
  }

  const AtualizaSomatorio = (rs: ProducaoDublagemInterface) => {

    // let total: number = 0

    // if (rs.detalheProducaoDublagens) {
    //   rs.detalheProducaoDublagens.forEach((detalhe) => {
    //     total = total + detalhe.metros
    //   })
    //   setRsSomatorio({ total: total.toString() })
    // }

    // btPesquisarQtd(rs.idProduto)

  }

  const pesquisarPedidoItem = async (pedido: number, produto: number): Promise<DetalhePedidoInterface | null> => {
    return await clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        criterio: {
          idPedido: pedido,
          idProduto: produto,
        },
      })
      .then((rs: Array<DetalhePedidoInterface>) => {

        if (rs.length > 0) {
          return rs[0]
        } else {
          return null
        }
      })
  }

  const verificaStatusPedido = async (pedido: number, tipo: "Incluir" | "Excluir") => {
    await clsCrud.pesquisar({
      entidade: "Pedido",
      relations: [
        "detalhePedidos",
      ],
      criterio: {
        idPedido: pedido
      }
    })
      .then((ped: Array<PedidoInterface>) => {

        if (ped.length > 0) {
          let tmpPedido: PedidoInterface = ped[0]
          let tmpDetalhe: Array<DetalhePedidoInterface> = ped[0].detalhePedidos
          if (tipo === "Incluir") {

            let temPedidoAberto = tmpDetalhe.findIndex((rs: any) => rs.statusItem !== StatusPedidoItemType.finalizado)

            if (temPedidoAberto < 0) {

              tmpPedido = { ...tmpPedido, statusPedido: StatusPedidoType.finalizado }
              clsCrud.incluir({
                entidade: "Pedido",
                criterio: tmpPedido,
              })
            }
          } else {
            tmpPedido = { ...tmpPedido, statusPedido: StatusPedidoType.producao }
            clsCrud.incluir({
              entidade: "Pedido",
              criterio: tmpPedido,
            })
          }
        }
      })
  }

  const alterarStatusItem = async (tp: "Incluir" | "Excluir") => {

    // await pesquisarPedidoItem(producaoDublagem.idPedido, 0)
    //   .then((rs: DetalhePedidoInterface | null) => {
    //     let qtdAtendida: number = parseFloat(rsSomatorio.total) > 0 ? parseFloat(rsSomatorio.total) : 0
    //     let statusItem: StatusPedidoItemType = StatusPedidoItemType.finalizado

    //     if (rs) {

    //       let tmpDetalhe: DetalhePedidoInterface = rs
    //       if (tp === "Excluir") {
    //         statusItem = StatusPedidoItemType.producao
    //         qtdAtendida = 0
    //       }

    //       tmpDetalhe = { ...tmpDetalhe, qtdAtendida: qtdAtendida, statusItem: statusItem }

    //       clsCrud.incluir({
    //         entidade: "DetalhePedido",
    //         criterio: tmpDetalhe,
    //       }).then((rsPed) => {
    //         if (!rsPed.ok) {
    //           setMensagemState({
    //             titulo: 'Erro...',
    //             exibir: true,
    //             mensagem: 'Status não foi atualizado - consulte o suporte',
    //             tipo: MensagemTipo.Error,
    //             exibirBotao: true,
    //             cb: null,
    //           })
    //         }
    //       })
    //     }
    //   })

    // await verificaStatusPedido(producaoDublagem.idPedido, tp)
  }

  const btConfirmar = () => {
    if (validarDados()) {
      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "ProducaoDublagem",
          criterio: producaoDublagem,
          localState: localState,
          cb: () => btPesquisar(),
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            if (rs.ok) {
              setLocalState({ action: actionTypes.pesquisando })
              alterarStatusItem("Incluir")
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
          entidade: "ProducaoDublagem",
          criterio: {
            idDublagem: producaoDublagem.idDublagem
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

    const campo = validaCampo.isValidDate(clsFormatacao.dataISOtoDatetime(pesquisa.itemPesquisa)) ? 'data' : 'nome'
    const itemPesquisa = campo === 'data'
      ? clsFormatacao.dataISOtoDatetime(pesquisa.itemPesquisa)
      : pesquisa.itemPesquisa

    clsApi.execute<Array<ProducaoDublagemInterface>>({
      url: 'corteProducaoDublagem',
      method: 'post',
      itemPesquisa,
      campo,
      mensagem: 'Pesquisando produção dublagem ...',
      setMensagemState: setMensagemState
    })
      .then((rs) => {
        setRsPesquisa(rs)
      })
  }

  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      titulo: '',
      tituloAnterior: 'Produção Dublagem',
      pathTitulo: '/',
      pathTituloAnterior: '/ProducaoDublagem'
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
  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Pedido",
        campoOrder: ["idPedido"],
        relations: ["detalhePedidos"],
        criterio: {
          statusPedido: 'C'
        },
        camposLike: ['statusPedido'],
        select: ['idPedido', 'statusPedido']
      })
      .then((rsPedidos: Array<PedidoInterface>) => {
        setRsPedido(rsPedidos)
      })


    // clsCrud
    //   .pesquisar({
    //     entidade: "Produto",
    //     campoOrder: ['nome'],
    //     criterio: {
    //       tipoProduto: [7],
    //     },
    //     camposLike: ['tipoProduto'],
    //   })
    //   .then((rsProdutos: Array<ProdutoInterface>) => {
    //     setRsProduto(rsProdutos)
    //   })

  }

  const btPesquisarQtd = (pedido: number) => {
    clsCrud
      .pesquisar({
        entidade: "DetalhePedido",
        relations: [
          "produto",
        ],
        criterio: {
          idPedido: pedido,
        },
        camposLike: ['idPedido'],
      })
      .then((rs: Array<DetalhePedidoInterface>) => {
        if (rs.length > 0) {
          let total: number = 0
          rs.forEach((detalhe) => {
            total = total + detalhe.qtdPedida
          })
          setRsQtdPedida({ total: total.toString() })
        }
      })
  }
  useEffect(() => {
    BuscarDados()
    btPesquisar()
    setLayoutState({
      titulo: 'Produção Dublagem',
      tituloAnterior: '',
      pathTitulo: '/ProducaoDublagem',
      pathTituloAnterior: '/'
    })
  }, [])

  return (

    <Container maxWidth="md" sx={{ mt: 2 }}>
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
                label="Pesquise por data ou cliente"
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
                    icone: "edit",
                    onAcionador: (rs: ProducaoDublagemInterface) =>
                      onEditar(rs.idDublagem as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: ProducaoDublagemInterface) =>
                      onExcluir(rs.idDublagem as number),
                    toolTip: "Excluir",
                  },
                ]}
              />
            </Grid>
          </Condicional>
          <Condicional condicao={['incluindo', 'editando', 'excluindo'].includes(localState.action)}>
            <Grid item xs={12} md={4} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                <InputText
                  type='tel'
                  tipo="date"
                  label="Data"
                  labelAlign='center'
                  textAlign='center'
                  dados={producaoDublagem}
                  field="dataProducao"
                  setState={setProducaoDublagem}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  autoFocus
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                <ComboBox
                  opcoes={rsPedido}
                  campoDescricao="idPedido"
                  campoID="idPedido"
                  dados={producaoDublagem}
                  mensagemPadraoCampoEmBranco="Escolha um pedido"
                  field="idPedido"
                  label="Pedido"
                  labelAlign='center'
                  textAlign='center'
                  erros={erros}
                  setState={setProducaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                  onBlur={() => btPesquisarQtd(producaoDublagem.idPedido)}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={rsProduto}
                  campoDescricao="nome"
                  campoID="idProduto"
                  dados={producaoDublagem}
                  mensagemPadraoCampoEmBranco="Escolha um item"
                  field="idProduto"
                  label="Item do Pedido"
                  labelAlign='center'
                  textAlign='center'
                  erros={erros}
                  setState={setProducaoDublagem}
                  disabled={['editando', 'excluindo'].includes(localState.action) ? true : false}
                  onFocus={() => btPesquisarItem(producaoDublagem.idPedido)}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                  onSelect={() => btPesquisarQtd(producaoDublagem.idProduto)}
                />
              </Box>
            </Grid> */}
            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <ComboBox
                  opcoes={TipoColagemTypes}
                  campoDescricao="descricao"
                  campoID="idTipoColagem"
                  dados={producaoDublagem}
                  mensagemPadraoCampoEmBranco="Defina um tipo"
                  field="tipoColagem"
                  label="Tipo de Colagem"
                  labelAlign='center'
                  textAlign='center'
                  erros={erros}
                  setState={setProducaoDublagem}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd Pedida"
                labelAlign='center'
                dados={rsQtdPedida}
                field="total"
                setState={setRsQtdPedida}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Qtd Cortado"
                labelAlign='center'
                dados={rsSomatorio}
                field="total"
                setState={setRsSomatorio}
                disabled={true}
                textAlign='center'
                tamanhoFonte={30}
              />
            </Grid>

            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalheProducaoDubalgem
                rsMaster={producaoDublagem}
                setRsMaster={setProducaoDublagem}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Tooltip title={'Cancelar'}>
                <IconButton
                  color="secondary"
                  sx={{ mt: 3, ml: 2 }}
                  onClick={() => btCancelar()}
                // onClick={producaoDublagem.idPedido !== 0 ? () => btConfirmar() :
                //   () => btCancelar()}
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
