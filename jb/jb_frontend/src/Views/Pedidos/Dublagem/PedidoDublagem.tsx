import { Box, Chip, Container, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../../Interfaces/ActionInterface';
import Condicional from '../../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface } from '../../../Componentes/DataTable';
import { MensagemTipo } from '../../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../../Componentes/InputText';
import ComboBox from '../../../Componentes/ComboBox';
import { PessoaInterface } from '../../../Interfaces/pessoaInterface';
import { PrazoEntregaInterface } from '../../../Interfaces/prazoEntregaInterface';
import ClsFormatacao from '../../../Utils/ClsFormatacao';
import { DetalhePedidoDublagemInterface, PedidoDublagemInterface } from '../../../Interfaces/pedidoDublagemInterface';
import DetalhePedido from './DetalhePedidoDublagem';
import { UsuarioType } from '../../../types/usuarioTypes';
import { StatusType, StatusTypes } from '../../../types/statusTypes';
import ClsApi from '../../../Utils/ClsApi';
import { NotificationInterface } from '../../../Interfaces/sistema/notificationInterface';

export interface SomatorioPedidoInterface {
  total: string
  totalQtd: string
}

export interface PedidoBackInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_vendedor: number
  idPrazoEntrega: number
  statusPedido: StatusType
  detalhePedidos: DetalhePedidoDublagemInterface[]
}

export default function PedidoDublagem() {

  const { setMensagemState, setLayoutState, layoutState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud: ClsCrud = new ClsCrud()
  const clsFormatacao: ClsFormatacao = new ClsFormatacao()
  const clsApi: ClsApi = new ClsApi()

  const ResetDados: PedidoBackInterface = {
    dataPedido: '',
    observacao: '',
    idPessoa_cliente: 0,
    idPessoa_vendedor: usuarioState.tipoUsuario === UsuarioType.vendedor ? usuarioState.idVendedor : 0,
    idPrazoEntrega: 0,
    statusPedido: StatusType.aberto,
    detalhePedidos: []
  }

  interface PesquisaInterface {
    itemPesquisa: string
    idVendedor: number
    status: StatusType | number
  }

  const SomatorioDados: SomatorioPedidoInterface = {
    total: '',
    totalQtd: ''
  }

  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando })
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})
  const [pedido, setPedido] = useState<PedidoBackInterface>(ResetDados)
  const [pedidosAll, setPedidosAll] = useState<any[]>([])
  const [rsPrazo, setRsPrazo] = useState<Array<PrazoEntregaInterface>>([])
  const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
  const [rsVendedor, setRsVendedor] = useState<Array<PessoaInterface>>([])
  const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ itemPesquisa: '', idVendedor: 0, status: StatusType.todos })
  const [rsSomatorio, setRsSomatorio] = useState<SomatorioPedidoInterface>(SomatorioDados)
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])


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
      format: (data) => clsFormatacao.dataISOtoUser(data)
    },
    {
      cabecalho: 'Cliente',
      alinhamento: 'left',
      //campo: 'nomeCliente'
      campo: 'idPessoa_cliente',
      format: (_v, rs: any) => rs.cliente.nome
    },
    {
      cabecalho: 'Vendedor',
      alinhamento: 'left',
      //campo: 'nomeVendedor'
      campo: 'idPessoa_vendedor',
      format: (_v, rs: any) => rs.vendedor.nome
    },
    {
      cabecalho: 'Status',
      alinhamento: 'center',
      campo: 'statusPedido', // O 'campo' ainda pode apontar para onde o status *deveria* estar para identificação
      render: (_valor: any, row: any) => { // O _valor aqui seria o que 'campo' aponta, mas não usaremos diretamente
        // 1. Encontrar o statusPedido real dentro de rsPedido
        const pedidoCorrespondente = rsPesquisa.find((p: any) => p.idPedido === row.idPedido);
        const statusCode = pedidoCorrespondente ? pedidoCorrespondente.statusPedido : undefined;

        // 2. Encontrar as informações completas do status (descrição e id)
        const statusInfo = StatusTypes.find(
          (status) => status.idStatus === statusCode
        );

        const descricaoStatus = statusInfo ? statusInfo.descricao : 'Desconhecido';

        // 3. Definir a cor do Chip com base no statusCode

        // Define a cor com base no tipo de status. Você pode ajustar as cores conforme sua necessidade.
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        switch (statusCode) {
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

  const pesquisarID = async (id: string | number): Promise<PedidoDublagemInterface | null> => {
    const rs = await clsCrud
      .pesquisar({
        entidade: "Pedido",
        relations: [
          "cliente",
          "vendedor",
          "prazoEntrega",
          "detalhePedidos",
          "detalhePedidos.produto",
          "detalhePedidos.cor",
        ],
        criterio: {
          idPedido: id,
        },
      })

    if (rs[0].statusPedido === StatusType.aberto) {

      let dt: string = clsFormatacao.dataISOtoUser(rs[0].dataPedido)
      return {
        ...rs[0],
        dataPedido: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3")
      };
    } else {
      setMensagemState({
        titulo: "Atenção",
        mensagem: "Pedido finalizado ou em produção, impossibilitando edição.",
        tipo: MensagemTipo.Error,
        exibir: true,
        exibirBotao: true,
        cb: null
      })
      return null
    }
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      if (rs === null) return
      setPedido(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }

  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      if (rs === null) return
      setPedido(rs)
      AtualizaSomatorio(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }

  const btIncluir = () => {
    setRsSomatorio({ total: '0', totalQtd: '0' })
    setPedido(ResetDados)
    setLocalState({ action: actionTypes.incluindo })
  }

  const btCancelar = () => {
    setErros({})
    setPedido(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.eData('dataPedido', pedido, erros, retorno)
    retorno = validaCampo.naoVazio('idPessoa_cliente', pedido, erros, retorno, 'Informe um cliente')
    retorno = validaCampo.naoVazio('idPessoa_vendedor', pedido, erros, retorno, 'Informe um vendedor')
    retorno = validaCampo.naoVazio('idPrazoEntrega', pedido, erros, retorno, 'Defina um prazo')

    setErros(erros)
    return retorno
  }

  const AtualizaSomatorio = (rs: PedidoDublagemInterface) => {

    let totalQtd: number = 0
    let total: number = 0

    if (rs.detalhePedidos) {
      rs.detalhePedidos.forEach((detalhe) => {
        totalQtd = totalQtd + detalhe.qtdPedida
        total = total + (detalhe.qtdPedida * detalhe.vrUnitario)
      })
      setRsSomatorio({ total: total.toString(), totalQtd: totalQtd.toString() })
    }
  }

  const criarNotification = async (cli: string, ped: string, ven: string, pedido: any) => {

    const noti: NotificationInterface = {
      color: 'info',
      title: 'Novo Pedido',
      //message: 'Pedido: ' + `${ped}` + ' - Cliente: ' + `${cli}` + ' - Vendedor: ' + `${ven}`,
      message: `Data: ${clsFormatacao.dataISOtoUser(pedido.dataPedido)}   -   Pedido: ${ped}\nCliente: ${cli}\nVendedor: ${ven}`,
      type: 'gerenciador',
      read: false,
      details: [pedido],
      idUsuario: 0
    }

    const notifications = await clsApi.execute<NotificationInterface[]>({
      method: 'post',
      url: 'notifications/',
      dados: noti,
      token: usuarioState.token
    })
    // if (notifications) {
    //   console.log(notifications)
    // }
  }

  const btConfirmar = () => {
    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "Pedido",
          criterio: pedido,
          localState: localState,
          token: usuarioState.token,
          cb: () => btPesquisar(),
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            const cli = rsCliente.find(c => c.idPessoa === pedido.idPessoa_cliente)?.nome || 'CLIENTE NÃO ENCONTRADO';
            const ven = rsVendedor.find(c => c.idPessoa === pedido.idPessoa_vendedor)?.nome || 'VENDEDOR NÃO ENCONTRADO';

            if (rs.ok) {
              setLocalState({ action: actionTypes.pesquisando })
              criarNotification(cli, String(rs.dados.idPedido), ven, rs.dados)
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
          }).catch((erro) => {
            setMensagemState({
              titulo: 'Erro...',
              exibir: true,
              mensagem: 'Usuário sem permissão - Consulte Suporte',
              tipo: MensagemTipo.Error,
              exibirBotao: true,
              cb: null
            })
          })
      } else if (localState.action === actionTypes.excluindo) {
        clsCrud.excluir({
          entidade: "Pedido",
          criterio: {
            idPedido: pedido.idPedido
          },
          token: usuarioState.token,
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

    const termo = pesquisa.itemPesquisa.trim().toUpperCase();
    let filtrados = [...pedidosAll];

    // 🔎 Filtro por termo digitado
    if (termo !== '') {
      const temNumero = /\d/.test(termo);

      filtrados = filtrados.filter(pedido => {
        if (temNumero && termo.includes('/')) {
          // Data formatada (dd/mm/yyyy)
          const dataFormatada = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
          return dataFormatada.includes(termo);
        } else if (temNumero) {
          return pedido.idPedido.toString().includes(termo);
        } else {
          // Pesquisa pelo nome do cliente
          return pedido.cliente?.nome?.toUpperCase().includes(termo);
        }
      });
    }

    // 👔 Filtro por vendedor
    if (pesquisa.idVendedor && pesquisa.idVendedor > 0) {
      filtrados = filtrados.filter(
        (pedido) => pedido.idPessoa_vendedor === pesquisa.idVendedor
      );
    } else if (usuarioState.tipoUsuario === UsuarioType.vendedor) {
      filtrados = filtrados.filter(
        (pedido) => pedido.idPessoa_vendedor === usuarioState.idVendedor
      );
    }

    // 📦 Filtro por status
    if (pesquisa.status && pesquisa.status !== StatusType.todos) {
      filtrados = filtrados.filter(
        (pedido) => pedido.statusPedido === pesquisa.status
      );
    }

    setRsPesquisa(filtrados);
  };


  const irPara = useNavigate()
  const btFechar = () => {
    setLayoutState({
      ...layoutState,
      titulo: '',
      tituloAnterior: 'Cadastro de Pedidos',
      pathTitulo: '/',
      pathTituloAnterior: '/Pedido'
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
  const loadDados = async () => {

    try {

      setMensagemState({
        titulo: 'Carregando dados...',
        exibir: true,
        mensagem: '',
        tipo: MensagemTipo.Loading,
        exibirBotao: false,
        cb: null
      })

      const [prazos, clientes, vendedores, pedidos] = await Promise.all([
        clsCrud
          .pesquisar({
            entidade: "PrazoEntrega",
            campoOrder: ["nome"],
            tipoOrder: "ASC",
          }),

        clsCrud
          .pesquisar({
            entidade: "Pessoa",
            campoOrder: ['nome'],
            tipoOrder: "ASC",
            comparador: 'I',
            criterio: {
              tipoPessoa: ['J', 'C'],
            },
            camposLike: ['tipoPessoa'],
          }),

        clsCrud
          .pesquisar({
            entidade: "Pessoa",
            campoOrder: ['nome'],
            tipoOrder: "ASC",
            criterio: {
              tipoPessoa: "V",
            },
            camposLike: ["tipoPessoa"],
          }),

        clsCrud.pesquisar({
          entidade: "Pedido",
          relations: [
            "cliente",
            "vendedor",
            "prazoEntrega",
            "detalhePedidos",
            "detalhePedidos.produto",
            "detalhePedidos.cor"
          ],
          campoOrder: ["dataPedido"],
          tipoOrder: "DESC",
        })
      ]);

      if (usuarioState.tipoUsuario === UsuarioType.vendedor) {

        const usuario = await clsCrud.pesquisar({
          entidade: "Usuario",
          criterio: { idUsuario: usuarioState.idUsuario },
          camposLike: ["idUsuario"],
          token: usuarioState.token
        })

        const idVendedor = usuario.filter((item) => item.idPessoa_vendedor)[0].idPessoa_vendedor
        const vendedor = vendedores.filter((item) => item.idPessoa === idVendedor)

        setRsVendedor(vendedor);
      } else {
        setRsVendedor(vendedores);
      }
      setRsPrazo(prazos);
      setRsCliente(clientes);
      setPedidosAll(pedidos);
      setRsPesquisa(pedidos);

      setMensagemState({ titulo: '', exibir: false, mensagem: '', tipo: MensagemTipo.Loading, exibirBotao: false, cb: null });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setMensagemState({ titulo: 'Error', exibir: true, mensagem: 'Erro ao buscar dados, ' + error, tipo: MensagemTipo.Error, exibirBotao: true, cb: null });
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      await loadDados()
    }
    carregarDados()
  }, [])

  useEffect(() => {
    if (pedidosAll.length > 0) btPesquisar();
  }, [pesquisa, pedidosAll]);

  return (

    <Container maxWidth="xl" sx={{ mt: 0 }}>
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
            <Grid item xs={12} md={4}>
              <InputText
                label="Buscar por pedido, data ou cliente"
                tipo="uppercase"
                dados={pesquisa}
                field="itemPesquisa"
                setState={setPesquisa}
                iconeEnd='searchicon'
                onClickIconeEnd={() => btPesquisar()}
                mapKeyPress={[{ key: 'Enter', onKey: btPesquisar }]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ComboBox
                opcoes={rsVendedor}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Escolha um Vendedor"
                field="idVendedor"
                label="Vendedor"
                erros={erros}
                setState={setPesquisa}
                disabled={localState.action === 'excluindo' || usuarioState.tipoUsuario === UsuarioType.vendedor ? true : false}
              />
            </Grid>
            <Grid item xs={10} md={3}>
              <ComboBox
                opcoes={StatusTypes}
                campoDescricao="descricao"
                campoID="idStatus"
                dados={pesquisa}
                mensagemPadraoCampoEmBranco="Todos os status"
                field="status"
                label="Status do Pedido"
                erros={erros}
                setState={setPesquisa}
              />
            </Grid>
            <Grid item xs={2} md={1}>
              <Tooltip title={'Novo pedido'}>
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
                acoes={usuarioState.tipoUsuario === UsuarioType.admin ? [
                  {
                    icone: "edit",
                    onAcionador: (rs: PedidoBackInterface) =>
                      onEditar(rs.idPedido as number),
                    toolTip: "Editar",
                  },
                  {
                    icone: "delete",
                    onAcionador: (rs: PedidoBackInterface) =>
                      onExcluir(rs.idPedido as number),
                    toolTip: "Excluir",
                  },
                ] : [
                  {
                    icone: "edit",
                    onAcionador: (rs: PedidoBackInterface) =>
                      onEditar(rs.idPedido as number),
                    toolTip: "Editar",
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
                  dados={pedido}
                  field="dataPedido"
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
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
                  dados={pedido}
                  mensagemPadraoCampoEmBranco="Escolha um cliente"
                  field="idPessoa_cliente"
                  label="Cliente"
                  erros={erros}
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 2)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={5} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                <ComboBox
                  opcoes={rsVendedor}
                  campoDescricao="nome"
                  campoID="idPessoa"
                  dados={pedido}
                  mensagemPadraoCampoEmBranco="Escolha um Vendedor"
                  field="idPessoa_vendedor"
                  label="Vendedor"
                  erros={erros}
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' || usuarioState.tipoUsuario === UsuarioType.vendedor ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 3)}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <ComboBox
                  opcoes={rsPrazo}
                  campoDescricao="nome"
                  campoID="idPrazoEntrega"
                  dados={pedido}
                  mensagemPadraoCampoEmBranco="Prazo de entrega"
                  field="idPrazoEntrega"
                  label="Prazo de entrega"
                  erros={erros}
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 4)}
                />
              </Box>
            </Grid> */}
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
                <InputText
                  type='text'
                  tipo='uppercase'
                  label="Observação"
                  dados={pedido}
                  field="observacao"
                  setState={setPedido}
                  disabled={localState.action === 'excluindo' ? true : false}
                  erros={erros}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(event: any) => btPulaCampo(event, 0)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 2, pl: { md: 1 } }}>
              <DetalhePedido
                rsMaster={pedido}
                setRsMaster={setPedido}
                masterLocalState={localState}
                setRsSomatorio={setRsSomatorio}
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mt: 2, pl: { md: 1 } }}>
              <InputText
                tipo='currency'
                scale={2}
                label="Metros Total"
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
                label="Valor Total Pedido"
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
