import { useContext, useEffect, useState } from 'react';
import { Box, Paper, Grid, Container, Stack, Typography, useTheme, useMediaQuery, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Collapse, IconButton, ButtonGroup, Button, Chip } from '@mui/material';
import {
  AttachMoney, BarChart, CheckCircle, FilterList, Inventory,
} from '@mui/icons-material';
import CardDash from '../../Componentes/CardDash';
import { Schedule } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import Grafico from '../../Componentes/Grafico';
import Rankings from '../../Componentes/Rankings';
import Comparation from '../../Componentes/Comparation';
import ClsApi from '../../Utils/ClsApi';
import ClsCrud from '../../Utils/ClsCrudApi';
import { PessoaInterface } from '../../Interfaces/pessoaInterface';
import ComboBox from '../../Componentes/ComboBox';
import { MiniTipoProdutoTypes } from '../../types/tipoProdutoypes';
import { PeriodoTypes } from '../../types/periodoTypes';
import { PedidoInterface } from '../../Interfaces/pedidoInterface';
import { StatusType } from '../../types/statusTypes';
import ClsValidacao, { ProductionData, ResultadoPeriodo, TopCliente, TopProduto } from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { UsuarioType } from '../../types/usuarioTypes';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)


interface CriteriosInterface {
  idCliente: number;
  idVendedor: number;
  idTipoProduto: number;
  idPeriodo: number;
  qtdPedidosAberto: number;
  qtdPedidosEmProducao: number;
  qtdPedidosFechado: number;
  vrTotalAtual: number;
  vrTicketAtual: number;
  vrTotalAnterior: number;
  vrTicketAnterior: number;
  grafico: ProductionData[];
  topClientes: TopCliente[];
  topProdutos: TopProduto[];
  totalPedidos: number;
  totalPedidosAnterior: number;
}

interface SmartAlert {
  id: string
  type: "warning" | "info" | "success"
  title: string
  message: string
  action: string
  priority: "high" | "medium" | "low"
  details?: any
}

const Dashboard: React.FC = () => {

  const { usuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const clsCrud: ClsCrud = new ClsCrud();
  const clsValidacao: ClsValidacao = new ClsValidacao();

  const [criterios, setCriterios] = useState<CriteriosInterface>({
    idCliente: 0,
    idVendedor: usuarioState.tipoUsuario === UsuarioType.vendedor ? usuarioState.idVendedor : 0,
    idTipoProduto: 0,
    idPeriodo: 5,
    qtdPedidosAberto: 0,
    qtdPedidosEmProducao: 0,
    qtdPedidosFechado: 0,
    vrTotalAtual: 0,
    vrTicketAtual: 0,
    vrTotalAnterior: 0,
    vrTicketAnterior: 0,
    grafico: [],
    topClientes: [],
    topProdutos: [],
    totalPedidos: 0,
    totalPedidosAnterior: 0
  });

  // State
  const [selectedClient, setSelectedClient] = useState<PessoaInterface[]>([])
  const [selectedVendedor, setSelectedVendedor] = useState<PessoaInterface[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
  const [selectedAlert, setSelectedAlert] = useState<SmartAlert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const buscarDados = async () => {
    const clientes = await clsCrud.pesquisar(
      {
        entidade: "Pessoa",
        campoOrder: ['nome'],
        comparador: 'I',
        criterio: {
          tipoPessoa: ['J', 'C', 'F'],
        },
        camposLike: ['tipoPessoa']
      }

    )
    if (clientes) {
      setSelectedClient(clientes)
    }

    if (usuarioState.tipoUsuario === UsuarioType.vendedor) {

      const vendedores = await clsCrud.pesquisar(
        {
          entidade: "Pessoa",
          criterio: {
            idPessoa: usuarioState.idVendedor
          },
          camposLike: ['idPessoa']
        }
      )

      if (vendedores) {
        setSelectedVendedor(vendedores)
      }
    } else {
      const vendedores = await clsCrud.pesquisar(
        {
          entidade: "Pessoa",
          campoOrder: ['nome'],
          comparador: 'I',
          criterio: {
            tipoPessoa: ['V'],
          },
          camposLike: ['tipoPessoa']
        }
      )
      if (vendedores) {
        setSelectedVendedor(vendedores)
      }

    }

    const pedidos: PedidoInterface[] = await clsCrud.pesquisar({
      entidade: "Pedido",
      relations: [
        "cliente",
        "detalhePedidos",
        "detalhePedidos.produto",
        "detalhePedidos.cor",
      ],
    })

    if (pedidos && criterios) {

      let vrTicketAtual = 0
      let vrTicketAnterior = 0

      let pedidosFiltrados: ResultadoPeriodo

      if (usuarioState.tipoUsuario === UsuarioType.vendedor) {

        pedidosFiltrados = clsValidacao.filtraPedidosPorPeriodo(pedidos, criterios.idPeriodo, criterios.idTipoProduto, criterios.idCliente, usuarioState.idVendedor);
      } else {
        pedidosFiltrados = clsValidacao.filtraPedidosPorPeriodo(pedidos, criterios.idPeriodo, criterios.idTipoProduto, criterios.idCliente, criterios.idVendedor);
      }

      const qtdPedidosAberto = pedidosFiltrados.pedidosAtual.filter((pedido: any) => pedido.statusPedido === StatusType.aberto).length
      const qtdPedidosEmProducao = pedidosFiltrados.pedidosAtual.filter((pedido: any) => pedido.statusPedido === StatusType.producao && pedido.status === StatusType.parcial).length
      const qtdPedidosFechado = pedidosFiltrados.pedidosAtual.filter((pedido: any) => pedido.statusPedido === StatusType.finalizado).length

      const totalPedidosAtual = pedidosFiltrados.pedidosAtual.reduce((total, pedido) => total + pedido.detalhePedidos.reduce((totalDetalhe, detalhe) => totalDetalhe + detalhe.qtdPedida, 0), 0)
      const vrTotalAtual = pedidosFiltrados.pedidosAtual.reduce((total, pedido) => total + pedido.detalhePedidos.reduce((totalDetalhe, detalhe) => totalDetalhe + detalhe.qtdPedida * detalhe.vrUnitario, 0), 0)

      const totalPedidosAnterior = pedidosFiltrados.pedidosAnterior.reduce((total, pedido) => total + pedido.detalhePedidos.reduce((totalDetalhe, detalhe) => totalDetalhe + detalhe.qtdPedida, 0), 0)
      const vrTotalAnterior = pedidosFiltrados.pedidosAnterior.reduce((total, pedido) => total + pedido.detalhePedidos.reduce((totalDetalhe, detalhe) => totalDetalhe + detalhe.qtdPedida * detalhe.vrUnitario, 0), 0)

      vrTicketAtual = totalPedidosAtual === 0 ? 0 : vrTotalAtual / totalPedidosAtual
      vrTicketAnterior = totalPedidosAnterior === 0 ? 0 : vrTotalAnterior / totalPedidosAnterior

      setCriterios({
        ...criterios,
        qtdPedidosAberto: qtdPedidosAberto,
        qtdPedidosEmProducao: qtdPedidosEmProducao,
        qtdPedidosFechado: qtdPedidosFechado,
        vrTotalAtual: vrTotalAtual,
        vrTicketAtual: vrTicketAtual,
        vrTotalAnterior: vrTotalAnterior,
        vrTicketAnterior: vrTicketAnterior,
        grafico: pedidosFiltrados.productionData,
        topClientes: pedidosFiltrados.topClientes,
        topProdutos: pedidosFiltrados.topProdutos,
        totalPedidos: totalPedidosAtual,
        totalPedidosAnterior: totalPedidosAnterior
      })
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      await buscarDados()
    }
    carregarDados()
  }, [criterios.idCliente, criterios.idVendedor, criterios.idPeriodo, criterios.idTipoProduto]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>

          <Box>
            <Typography variant={isMobile ? "h6" : "h2"} component="h1" gutterBottom>
              Dashboard de Vendas
            </Typography>
            <Typography variant={isMobile ? "subtitle2" : "h6"} color="text.secondary">
              Acompanhe seus pedidos e performance em tempo real
            </Typography>
          </Box>

          {/* Filters */}

          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => setShowFilters((prev) => !prev)}>
                    <FilterList color='warning' />
                  </IconButton>
                  <Typography variant="h5">Filtros de Análise</Typography>
                </Box>
                <Collapse in={showFilters}>
                  <Grid container spacing={2} >
                    <Grid item xs={12} md={3}>
                      <ComboBox
                        opcoes={PeriodoTypes}
                        campoDescricao="descricao"
                        campoID="idPeriodo"
                        dados={criterios}
                        mensagemPadraoCampoEmBranco="Selecione um Período"
                        field="idPeriodo"
                        label="Período"
                        setState={setCriterios}
                        onFocus={(e) => e.target.select()}
                        onChange={(v: any) => setCriterios({ ...criterios, idPeriodo: v?.idPeriodo || 0 })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <ComboBox
                        opcoes={selectedClient}
                        campoDescricao="nome"
                        campoID="idPessoa"
                        dados={criterios}
                        mensagemPadraoCampoEmBranco="Selecione um Cliente"
                        field="idCliente"
                        label="Cliente"
                        setState={setCriterios}
                        onFocus={(e) => e.target.select()}
                        onChange={(v: any) => setCriterios({ ...criterios, idCliente: v?.idPessoa || 0 })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <ComboBox
                        opcoes={MiniTipoProdutoTypes}
                        campoDescricao="descricao"
                        campoID="idTipoProduto"
                        dados={criterios}
                        mensagemPadraoCampoEmBranco="Selecione um Tipo de Produto"
                        field="idTipoProduto"
                        label="Tipo de Produto"
                        setState={setCriterios}
                        onFocus={(e) => e.target.select()}
                        onChange={(v: any) => setCriterios({ ...criterios, idTipoProduto: v?.idTipoProduto || 0 })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <ComboBox
                        opcoes={selectedVendedor}
                        campoDescricao="nome"
                        campoID="idPessoa"
                        dados={criterios}
                        mensagemPadraoCampoEmBranco="Selecione um Vendedor"
                        field="idVendedor"
                        label="Vendedor"
                        setState={setCriterios}
                        onFocus={(e) => e.target.select()}
                        onChange={(v: any) => setCriterios({ ...criterios, idVendedor: v?.idVendedor || 0 })}
                        disabled={usuarioState.tipoUsuario !== UsuarioType.admin}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Stack>
            </CardContent>
          </Card>
          {/* KPI Cards */}
          <Grid container >
            <Grid item xs={12} sm={6} md={4}>
              <CardDash
                titulo="Pedidos em Aberto"
                vrAtual={criterios.qtdPedidosAberto}
                chip='Aguardando'
                IconePrinicipal={Schedule}
                corIcone='warning'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardDash
                titulo="Pedidos em Produção"
                vrAtual={criterios.qtdPedidosEmProducao}
                chip='Em Andamento'
                IconePrinicipal={Inventory}
                corIcone='primary'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardDash
                titulo="Pedidos Finalizados"
                vrAtual={criterios.qtdPedidosFechado}
                chip='Concluidos'
                IconePrinicipal={CheckCircle}
                corIcone='success'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CardDash
                titulo="Valor Total do Período"
                vrAtual={criterios.vrTotalAtual}
                vrAnterior={criterios.vrTotalAnterior}
                chip=''
                IconePrinicipal={AttachMoney}
                IconeSecundario={true}
                corIcone='primary'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CardDash
                titulo="Ticket Médio do Período"
                vrAtual={criterios.vrTicketAtual}
                vrAnterior={criterios.vrTicketAnterior}
                chip=''
                IconePrinicipal={BarChart}
                IconeSecundario={true}
                corIcone='secondary'
              />
            </Grid>

          </Grid>
          <Paper sx={{ padding: 2, marginTop: 2 }}>
            {/* Charts Section */}
            <Grafico
              monthlyProductionData={criterios.grafico}
            />
          </Paper>

          <Paper sx={{ padding: 2, marginTop: 2 }}>
            {/* Rankings Section */}
            <Rankings
              topProducts={criterios.topProdutos}
              topClients={criterios.topClientes}
            />
          </Paper>


          <Paper sx={{ padding: 2, marginTop: 2 }}>
            {/* Comparation Section */}
            <Comparation
              idPeriodo={criterios.idPeriodo}
              totalVendas={criterios.vrTotalAtual}
              totalVendasAnterior={criterios.vrTotalAnterior}
              ticket={criterios.vrTicketAtual}
              ticketAnterior={criterios.vrTicketAnterior}
              totalPedidos={criterios.totalPedidos}
              totalPedidosAnterior={criterios.totalPedidosAnterior}
            />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
