import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
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
import InputText from '../../Componentes/InputText';
import ComboBox from '../../Componentes/ComboBox';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { StatusPedidoItemType } from '../../types/statusPedidoItemTypes';
import InputCalc from '../../Componentes/InputCalc';
import { EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { DetalhePedidoInterface, PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { DetalheProgramacaoDublagemInterface, ProgramacaoDublagemInterface } from '../../../../jb_backend/src/interfaces/programacaoDublagemInterface';
import { StatusPedidoType, StatusPedidoTypes } from '../../types/statusPedidoTypes';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import GerenciadorPedido from './Gerenciador';
import ClsApi from '../../Utils/ClsApi';


interface PropsInterface {
  rsMaster: ProgramacaoDublagemInterface
  setRsMaster: React.Dispatch<React.SetStateAction<ProgramacaoDublagemInterface>>,
  masterLocalState: ActionInterface,
}


export default function DetalheProgramacaoDublagem({ rsMaster, setRsMaster, masterLocalState }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()

  const ResetDados: DetalheProgramacaoDublagemInterface = {

    idProgramacaoDublagem: null,
    idPedido: 0,
    pedido: {
      dataPedido: '',
      observacao: '',
      idPessoa_cliente: 0,
      idPessoa_vendedor: 0,
      idPrazoEntrega: 0,
      statusPedido: StatusPedidoType.aberto,
      detalhePedidos: []
    }

  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [erros, setErros] = useState({});
  const [detalheProgramacaoDublagem, setDetalheProgramacaoDublagem] = useState<DetalheProgramacaoDublagemInterface>(ResetDados);
  const [rsPedido, setRsPedido] = useState<Array<PedidoInterface>>([]);
  const [rsPessoa, setRsPessoa] = useState<Array<PessoaInterface>>([]);
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([]);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Pedido',
      alinhamento: 'center',
      campo: 'idPedido',
      largura: 15,
      format: (v) => clsFormatacao.numeroPadrao(v)
    },
    {
      cabecalho: 'Data',
      alinhamento: 'center',
      campo: 'dataPedido',
      // format: (data) => clsFormatacao.dataISOtoUser(data)
      format: (_v, rs: any) => {
        const pedido = rsPedido.find(v => v.idPedido === rs.idPedido);
        return pedido ? clsFormatacao.dataISOtoUser(pedido.dataPedido) : '';
      }
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      campo: 'idPessoa_cliente',
      format: (_v, rs: any) => rsPessoa.find(v => v.idPessoa === rsPedido.find(v => v.idPedido === rs.idPedido)?.idPessoa_cliente)?.nome
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      campo: 'idPessoa_vendedor',
      format: (_v, rs: any) => rsPessoa.find(v => v.idPessoa === rsPedido.find(v => v.idPedido === rs.idPedido)?.idPessoa_vendedor)?.nome
    },
    {
      cabecalho: 'Status',
      alinhamento: 'center',
      campo: 'statusPedido',
      format: (_v, rs: any) => StatusPedidoTypes.find(v => v.idStatusPedido === rsPedido.find(v => v.idPedido === rs.idPedido)?.statusPedido)?.descricao
    }

  ]

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idPedido', detalheProgramacaoDublagem, erros, retorno, '')

    setErros(erros)
    return retorno
  }

  const AlterandoStatusProducao = async (pedidos: Array<number>) => {
    await clsApi.execute<Array<PedidoInterface>>({
      url: 'produzirPedidos',
      method: 'post',
      pedidos,
      tipoProducao: 'A',
      mensagem: 'Alterando status dos pedidos ...',
      setMensagemState: setMensagemState
    })
  }
  const onExcluir = (rs: DetalheProgramacaoDublagemInterface) => {

    const pedido: number[] = [rs.idPedido]
    let tmpDetalhe: Array<DetalheProgramacaoDublagemInterface> = []
    rsMaster.detalheProgramacaoDublagens.forEach(det => {
      if (det.idPedido !== rs.idPedido) {
        tmpDetalhe.push(det)
      }
    })
    setRsMaster({ ...rsMaster, detalheProgramacaoDublagens: tmpDetalhe })
    AlterandoStatusProducao(pedido)
  }

  const btIncluir = () => {
    if (rsMaster.dataProgramacao !== "") {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalheProgramacaoDublagem(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe a data da Programação!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalheProgramacaoDublagem(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }


  // const podeIncluirDetalhe = (): boolean => {
  //   const indice = rsMaster.detalhePedidos.findIndex(
  //     (v, i) => v.idProduto === detalhePedido.idProduto && i !== indiceEdicao
  //   )

  //   if (indice >= 0) {
  //     setMensagemState({
  //       titulo: 'Aviso',
  //       exibir: true,
  //       mensagem: 'Produto já cadastrado!',
  //       tipo: MensagemTipo.Error,
  //       exibirBotao: true,
  //       cb: null
  //     })
  //   }
  //   return indice < 0;
  // }

  // const temEstrutura = async (id: number): Promise<boolean> => {
  //   try {
  //     const estrutura: EstruturaInterface[] = await clsCrud.pesquisar({
  //       entidade: "Estrutura",
  //       criterio: { idProduto: id },
  //     })
  //     if (estrutura.length === 0) {
  //       setMensagemState({
  //         titulo: 'Erro',
  //         exibir: true,
  //         mensagem: 'Produto sem Estrutura definida!',
  //         tipo: MensagemTipo.Error,
  //         exibirBotao: true,
  //         cb: null
  //       })
  //       return false
  //     }
  //     return estrutura.length > 0;
  //   } catch (error) {
  //     console.error("Erro ao buscar estrutura:", error)
  //     return false; // ou throw error;
  //   }
  // }
  // const btConfirmaInclusao = async () => {
  //   if (validarDados()) {
  //     let tmpDetalhe: Array<DetalheProgramacaoDublagemInterface> = [...rsMaster.detalheProgramacaoDublagens]
  //     tmpDetalhe.push({
  //       idProgramacaoDublagem: rsMaster.idProgramacaoDublagem as number,
  //       idPedido: detalheProgramacaoDublagem.idPedido,
  //       pedido: { ...rsPedido[rsPedido.findIndex(v => v.idPedido === detalheProgramacaoDublagem.idPedido)] },
  //     })
  //     setRsMaster({
  //       ...rsMaster, detalheProgramacaoDublagens:
  //         [
  //           ...rsMaster.detalheProgramacaoDublagens,

  //           {
  //             idProgramacaoDublagem: rsMaster.idProgramacaoDublagem as number,
  //             idPedido: detalheProgramacaoDublagem.idPedido,
  //             pedido: { ...rsPedido[rsPedido.findIndex(v => v.idPedido === detalheProgramacaoDublagem.idPedido)] },
  //           }
  //         ]
  //     })
  //     setLocalState({ action: actionTypes.pesquisando })
  //     setDetalheProgramacaoDublagem(ResetDados)
  //     setOpen(false)
  //   }
  // }

  const btConfirmaAlteracao = () => {

    // if (validarDados() && podeIncluirDetalhe()) {

    //   let tmpDetalhe: Array<DetalheProgramacaoDublagemInterface> = [...rsMaster.detalhePedidos]
    //   tmpDetalhe[indiceEdicao] = { ...detalhePedido, produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalhePedido.idProduto)] } }

    //   setRsMaster({
    //     ...rsMaster,
    //     detalhePedidos: [...tmpDetalhe]
    //   })
    //   setLocalState({ action: actionTypes.pesquisando })
    //   setDetalheProgramacaoDublagem(ResetDados)
    //   setOpen(false)
    //   AtualizaSomatorio(tmpDetalhe)
    // }
  }

  // const AtualizaSomatorio = (rs: Array<DetalheProgramacaoDublagemInterface>) => {

  //   let totalQtd: number = 0
  //   let total: number = 0

  //   if (rs) {
  //     rs.forEach((detalhe) => {
  //       totalQtd = totalQtd + detalhe.qtdPedida
  //       total = total + (detalhe.qtdPedida * detalhe.vrUnitario)
  //     })
  //     setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
  //   }
  // }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Pedido",
        relations: [
          "detalhePedidos",
        ],
      })
      .then((rsPedidos: Array<PedidoInterface>) => {
        setRsPedido(rsPedidos)
      })

    clsCrud
      .pesquisar({
        entidade: "Pessoa",
        campoOrder: ["nome"],
      })
      .then((rsPessoas: Array<PessoaInterface>) => {
        setRsPessoa(rsPessoas)
      })

    clsCrud
      .pesquisar({
        entidade: "ProgramacaoDublagem",
        relations: [
          "detalheProgramacaoDublagens",
          "detalheProgramacaoDublagens.pedido",
        ]
      })
      .then((rsProgramacaoDublagem: Array<any>) => {
        setRsPesquisa(rsProgramacaoDublagem)
      })
  }

  useEffect(() => {
    BuscarDados()
  })

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <GerenciadorPedido detalhe={rsMaster.detalheProgramacaoDublagens} setOpenDetalhe={setOpen} />

        {/* <Paper variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            m: 1,
            p: 1.5,
            backgroundColor: '#3c486b'
          }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'white' }}>
              Item do Pedido
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={detalhePedido}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalhePedido}
                    disabled={localState.action === 'excluindo' ? true : false}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Qtd"
                    dados={detalhePedido}
                    field="qtdPedida"
                    setState={setDetalhePedido}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 2)}
                    textAlign='right'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Vr Unitário"
                    dados={detalhePedido}
                    field="vrUnitario"
                    setState={setDetalhePedido}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                    textAlign='right'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sx={{ mt: 2, pl: { md: 1 } }}>

                <InputCalc
                  label='Total Item'
                  tipo='currency'
                  scale={4}
                  disabled={true}
                  value={(detalhePedido.qtdPedida * detalhePedido.vrUnitario).toString()}
                  textAlign='right'

                />
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
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
                        onClick={localState.action === actionTypes.incluindo ?
                          () => btConfirmaInclusao() : () => btConfirmaAlteracao()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional> */}
      </Dialog >
      <Paper sx={{ m: 0, p: 1 }}>
        <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Condicional condicao={masterLocalState.action !== actionTypes.excluindo}>
            <Tooltip title={'Incluir'}>
              <IconButton
                color="secondary"
                sx={{ mt: -1, ml: { xs: 1, md: 0.5 } }}
                onClick={() => btIncluir()}
              >
                <AddCircleIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Condicional>
        </Grid>
        <Grid item xs={12}>
          <DataTable
            cabecalho={cabecalhoForm}
            dados={rsMaster.detalheProgramacaoDublagens}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "delete",
                  onAcionador: (rs: DetalheProgramacaoDublagemInterface) =>
                    onExcluir(rs),
                  toolTip: "Excluir",
                },
              ]}
          />
        </Grid>
      </Paper>
    </>
  )
}