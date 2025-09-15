import { Box, Chip, Dialog, Grid, IconButton, Paper, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
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
import { ProdutoInterface } from '../../Interfaces/produtoInterface';
import { TipoProdutoType } from '../../types/tipoProdutoypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import InputCalc from '../../Componentes/InputCalc';
import { PedidoBackInterface, SomatorioPedidoInterface } from './Pedido';
import { EstruturaInterface } from '../../Interfaces/estruturaInterface';
import { DetalhePedidoInterface } from '../../Interfaces/pedidoInterface';
import { CorInterface } from '../../Interfaces/corInteface';
import { StatusType, StatusTypes } from '../../types/statusTypes';


interface PropsInterface {
  rsMaster: PedidoBackInterface
  setRsMaster: React.Dispatch<React.SetStateAction<PedidoBackInterface>>,
  masterLocalState: ActionInterface,
  setRsSomatorio: React.Dispatch<React.SetStateAction<SomatorioPedidoInterface>>,
}


export default function DetalhePedido({ rsMaster, setRsMaster, masterLocalState, setRsSomatorio }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()
  const clsFormatacao = new ClsFormatacao()

  const ResetDados: DetalhePedidoInterface = {
    idPedido: null,
    idProduto: 0,
    produto: {
      nome: '',
      idUnidade: 0,
      localizacao: '',
      largura: 0,
      gm2: 0,
      ativo: false,
      tipoProduto: TipoProdutoType.tecidoTinto
    },
    idCor: null,
    cor: {
      nome: '',
      nivel: 0
    },
    qtdPedida: 0,
    vrUnitario: 0,
    qtdAtendida: 0,
    statusItem: StatusType.aberto,
  }

  const [indiceEdicao, setIndiceEdicao] = useState<number>(-1)
  const [open, setOpen] = useState(false);
  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [erros, setErros] = useState({});
  const [detalhePedido, setDetalhePedido] = useState<DetalhePedidoInterface>(ResetDados);
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([]);
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([]);
  const [tipo, setTipo] = useState<TipoProdutoType>()

  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'idProduto',
      format: (_v, rs: any) => rsProduto.find(x => x.idProduto === rs.idProduto)?.nome
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'idCor',
      format: (_v, rs: any) => rsCor.find(x => x.idCor === rs.idCor)?.nome
      //format: (_v, rs: any) => rs ? rs.cor.nome : ""
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'right',
      campo: 'qtdPedida',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Vr Unitário',
      alinhamento: 'right',
      campo: 'vrUnitario',
      format: (qtd) => clsFormatacao.currency(qtd)
    },
    {
      cabecalho: 'Total Item',
      alinhamento: 'right',
      campo: 'qtdPedida',
      format: (_v, rs: any) => rs.qtdPedida ?
        clsFormatacao.currency(rs.qtdPedida * rs.vrUnitario) : ""
    },
    {
      cabecalho: 'Status Item',
      alinhamento: 'center',
      campo: 'statusItem',
      render: (_valor: any, row: any) => {


        const statusInfo = StatusTypes.find(
          (status) => status.idStatus === row.statusItem
        );

        const descricaoStatus = statusInfo ? statusInfo.descricao : 'Desconhecido';

        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        switch (row.statusItem) {
          case StatusType.aberto:
            color = 'success'; // Exemplo: azul para aberto
            break;
          case StatusType.producao:
            color = 'info'; // Exemplo: roxo para produção
            break;
          case StatusType.parcial:
            color = 'warning'; // Exemplo: laranja para parcial
            break;
          case StatusType.finalizado:
            color = 'error'; // Exemplo: verde para finalizado
            break;
          default:
            color = 'default'; // Cor padrão para qualquer outro caso
            break;
        }

        // 4. Retornar o componente Chip
        return (
          <Chip
            label={descricaoStatus}
            color={color}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    },
  ]

  const pegaTipo = () => {
    const auxTipo = rsProduto.find(produto => produto.idProduto === detalhePedido.idProduto)?.tipoProduto;
    if (auxTipo !== undefined) {
      setTipo(auxTipo);
    }
  }
  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalhePedido, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('qtdPedida', detalhePedido, erros, retorno, 'Valor maior que 0')
    retorno = validaCampo.naoVazio('vrUnitario', detalhePedido, erros, retorno, 'Valor maior que 0')

    setErros(erros)
    return retorno
  }

  const onEditar = (rs: DetalhePedidoInterface, indice: number) => {

    if (rs.statusItem === StatusType.aberto) {
      setLocalState({ action: actionTypes.editando })
      setIndiceEdicao(indice)
      setDetalhePedido(rs)
      setOpen(true)
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Item em produção, não pode ser alterado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const onExcluir = (rs: DetalhePedidoInterface) => {
    if (rs.statusItem === StatusType.aberto) {

      let tmpDetalhe: Array<DetalhePedidoInterface> = []
      rsMaster.detalhePedidos.forEach(det => {
        if (det.idDetalhePedido !== rs.idDetalhePedido) {
          tmpDetalhe.push(det)
        }
      })
      setRsMaster({ ...rsMaster, detalhePedidos: tmpDetalhe })
      AtualizaSomatorio(tmpDetalhe)
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Item em produção, não pode ser excluído!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btIncluir = () => {
    if (
      rsMaster.dataPedido !== "" &&
      rsMaster.idPrazoEntrega !== 0 &&
      rsMaster.idPessoa_cliente !== 0 &&
      rsMaster.idPessoa_vendedor !== 0
    ) {
      setIndiceEdicao(-1)
      setOpen(true)
      BuscarDados()
      setDetalhePedido(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados do Pedido!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }

  const btCancelar = () => {
    setOpen(false)
    setErros({})
    setDetalhePedido(ResetDados)
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

  const podeIncluirDetalhe = (): boolean => {
    const indice = rsMaster.detalhePedidos.findIndex(
      (v, i) => v.idProduto === detalhePedido.idProduto && i !== indiceEdicao
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Produto já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
    return indice < 0;
  }

  const temEstrutura = async (id: number): Promise<boolean> => {
    try {
      const produtosComEstrutura: ProdutoInterface[] = await clsCrud.pesquisar({
        entidade: "Produto",
        criterio: {
          idProduto: id
        },
        camposLike: ['idProduto']
      })

      if (produtosComEstrutura) {
        const liberado = produtosComEstrutura.find(v => v.tipoProduto === 7 || v.tipoProduto === 8)?.idProduto

        const estrutura: EstruturaInterface[] = await clsCrud.pesquisar({
          entidade: "Estrutura",
          criterio: { idProduto: liberado },
        })
        if (estrutura.length === 0) {
          setMensagemState({
            titulo: 'Erro',
            exibir: true,
            mensagem: 'Produto sem Estrutura definida! Vá ao cadastro de estruturas e crie uma estutura para o produto.',
            tipo: MensagemTipo.Error,
            exibirBotao: true,
            cb: null
          })
          return false
        }
        return estrutura.length > 0;
      } else {
        return true
      }

    } catch (error) {
      console.error("Erro ao buscar estrutura:", error)
      return false; // ou throw error;
    }
  }
  const btConfirmaInclusao = async () => {

    const estrutura = await temEstrutura(detalhePedido.idProduto)
    if (validarDados() && podeIncluirDetalhe() && estrutura) {
      let tmpDetalhe: Array<DetalhePedidoInterface> = [...rsMaster.detalhePedidos]
      tmpDetalhe.push({
        idPedido: rsMaster.idPedido as number,
        idProduto: detalhePedido.idProduto,
        idCor: detalhePedido.idCor,
        qtdPedida: detalhePedido.qtdPedida,
        qtdAtendida: 0,
        vrUnitario: detalhePedido.vrUnitario,
        statusItem: StatusType.aberto,
        produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalhePedido.idProduto)] },
        cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalhePedido.idCor)] },
      })
      setRsMaster({
        ...rsMaster, detalhePedidos:
          [
            ...rsMaster.detalhePedidos,

            {
              idPedido: rsMaster.idPedido as number,
              idCor: detalhePedido.idCor,
              idProduto: detalhePedido.idProduto,
              qtdPedida: detalhePedido.qtdPedida,
              qtdAtendida: 0,
              vrUnitario: detalhePedido.vrUnitario,
              statusItem: StatusType.aberto,
              produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalhePedido.idProduto)] },
              cor: { ...rsCor[rsCor.findIndex(v => v.idCor === detalhePedido.idCor)] },
            }
          ]
      })
      AtualizaSomatorio(tmpDetalhe)
      setLocalState({ action: actionTypes.pesquisando })
      setDetalhePedido(ResetDados)
      setOpen(false)
    }
  }

  const btConfirmaAlteracao = () => {

    if (validarDados() && podeIncluirDetalhe()) {

      let tmpDetalhe: Array<DetalhePedidoInterface> = [...rsMaster.detalhePedidos]
      tmpDetalhe[indiceEdicao] = { ...detalhePedido, produto: { ...rsProduto[rsProduto.findIndex(v => v.idProduto === detalhePedido.idProduto)] } }

      setRsMaster({
        ...rsMaster,
        detalhePedidos: [...tmpDetalhe]
      })
      setLocalState({ action: actionTypes.pesquisando })
      setDetalhePedido(ResetDados)
      setOpen(false)
      AtualizaSomatorio(tmpDetalhe)
    }
  }

  const AtualizaSomatorio = (rs: Array<DetalhePedidoInterface>) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs) {
      rs.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPedida
        total = total + (detalhe.qtdPedida * detalhe.vrUnitario)
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const BuscarDados = () => {
    clsCrud
      .pesquisar({
        entidade: "Produto",
        campoOrder: ["nome"],
        comparador: 'I',
        criterio: {
          tipoProduto: [
            TipoProdutoType.cola,
            TipoProdutoType.espuma,
            TipoProdutoType.eva,
            TipoProdutoType.filme,
            TipoProdutoType.forro,
            TipoProdutoType.nylon,
            TipoProdutoType.palmilha,
            TipoProdutoType.tecidoTinto
          ]
        },
        camposLike: ['tipoProduto'],
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    clsCrud
      .pesquisar({
        entidade: "Cor",
        campoOrder: ["nome"],
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })
  }

  useEffect(() => {
    BuscarDados()
  }, [])

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'>
        <Paper variant="outlined"
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
              <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
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
                    onSelect={pegaTipo}
                    onKeyDown={(event: any) => btPulaCampo(event, 1)}
                  />
                </Box>
              </Grid>
              <Condicional condicao={[2, 3, 6, 10, 11].includes(tipo as number)}>
                <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <ComboBox
                      opcoes={rsCor}
                      campoDescricao="nome"
                      campoID="idCor"
                      dados={detalhePedido}
                      mensagemPadraoCampoEmBranco="Qual cor"
                      field="idCor"
                      label="Cores"
                      erros={erros}
                      setState={setDetalhePedido}
                      disabled={localState.action === 'excluindo' ? true : false}
                      onFocus={(e) => e.target.select()}
                      onSelect={pegaTipo}
                      onKeyDown={(event) => btPulaCampo(event, 2)}
                    />
                  </Box>
                </Grid>
              </Condicional>

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
              <Grid item xs={12} md={2} sx={{ mt: 2, pl: { md: 1 } }}>

                <InputCalc
                  label='Total Item'
                  tipo='currency'
                  scale={2}
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
        </Condicional>
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
            dados={rsMaster.detalhePedidos}
            acoes={masterLocalState.action === actionTypes.excluindo ? [] :
              [
                {
                  icone: "edit",
                  onAcionador: (rs: DetalhePedidoInterface, indice: number) =>
                    onEditar(rs, indice),
                  toolTip: "Editar",
                },
                {
                  icone: "delete",
                  onAcionador: (rs: DetalhePedidoInterface) =>
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