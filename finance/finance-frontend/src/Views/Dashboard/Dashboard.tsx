import { Box, Chip, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import InfoCard from '../../Componentes/InfoCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import FinancialChart from './FinancialChart';
import { CategoryDataPoint, DataPoint } from '../../types/graficoTypes';
import CategoryPieChart from './CategoryPieChart';
import DataTable, { DataTableCabecalhoInterface } from '../../Componentes/DataTable';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { TransactionInterface } from '../../Interfaces/transaction';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import ClsApi from '../../Utils/ClsApi';
import Condicional from '../../Componentes/Condicional/Condicional';
import { TransacoesFicha } from '../Transacoes/transacoesFicha';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';



interface DadosCardInterface {
  saldo: number;
  receitas: number;
  despesas: number;
  transacoes: number;
}


export default function Dashboard() {


  const clsFormatacao = useMemo(() => new ClsFormatacao(), []);
  const clsCrud = useMemo(() => new ClsCrud(), []);
  const clsApi = useMemo(() => new ClsApi(), []);

  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface

  const ResetTransaction: TransactionInterface = {

    date: '',
    amount: 0,
    qtd: 0,
    price: 0,
    description: '',
    userId: '',
    categoryId: '',
    accountId: layoutState.contaPadrao ?? '',
    companyId: '',
    sectorId: '',
  }

  const { setMensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [transacoes, setTransacoes] = useState<TransactionInterface>(ResetTransaction);
  const [rsPesquisa, setRsPesquisa] = useState<Array<TransactionInterface>>([]);
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [dadosCard, setDadosCard] = useState<DadosCardInterface>({ saldo: 0, receitas: 0, despesas: 0, transacoes: 0 });
  const [dataPoints, setDataPoints] = useState<Array<DataPoint>>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [open, setOpen] = useState(false);


  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Data',
      alinhamento: 'left',
      campo: 'date',
      format: (valor: any) => {
        if (!valor) return '';
        const data = new Date(valor);
        return data.toLocaleDateString('pt-BR'); // formato dd/mm/yyyy
      },
    },
    {
      cabecalho: 'Descrição',
      alinhamento: 'center',
      campo: 'description',
    },
    {
      cabecalho: 'Setor',
      alinhamento: 'center',
      campo: 'sector',
      format: (_v, rs: any) => rs.sector.name
    },
    {
      cabecalho: 'Empresa',
      alinhamento: 'center',
      campo: 'companyId',
      format: (_v, rs: any) => rs.company.name
    },
    {
      cabecalho: 'Categoria',
      alinhamento: 'center',
      campo: 'categoryId',
      format: (_v, rs: any) => rs.category.name
    },
    {
      campo: 'categoryId',
      cabecalho: 'Tipo',
      alinhamento: 'center',
      render: (_valor: number, row: any) => {
        const type = row?.category?.type;
        const isReceita = type === 'Receita';

        return (
          <Chip
            label={type}
            color={isReceita ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      },
    },
    {
      campo: 'amount',
      cabecalho: 'Valor',
      alinhamento: 'right',
      render: (valor: number, row: any) => {
        const isReceita = row?.category?.type === 'Receita'
        return (
          <span
            style={{
              color: isReceita ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
            }}
          >
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(valor)}
          </span>
        )
      }
    }
  ]

  const onDuplicar = (id: string | number) => {

    pesquisarID(id).then((rs) => {
      const transacaoConvertida = {
        ...rs,
        amount: Number(rs.amount),
        price: Number(rs.price),
        qtd: Number(rs.qtd),
        description: rs.description.concat(' TRANSAÇÃO DUPLICADA'),
        id: undefined
      };

      setTransacoes(transacaoConvertida);
      setLocalState({ action: actionTypes.duplicando })
      setOpen(true)
    })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      const transacaoConvertida = {
        ...rs,
        amount: Number(rs.amount),
        price: Number(rs.price),
        qtd: Number(rs.qtd),
      };

      setTransacoes(transacaoConvertida);
      setLocalState({ action: actionTypes.editando })
      buscarDados()
    })
    setOpen(true)
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setTransacoes(rs)
      setLocalState({ action: actionTypes.pesquisando })
      setMensagemState({
        titulo: 'Exclusão',
        exibir: true,
        mensagem: 'Deseja realmente excluir essa transação ' + rs.description + '?',
        tipo: 'warning',
        exibirBotao: 'SN',
        cb: (resposta) => {
          if (resposta) {
            clsCrud.excluir({
              entidade: "Transaction",
              criterio: {
                id: id,
                userId: usuarioState.idUsuario
              },
              setMensagemState: setMensagemState,
              token: usuarioState.token,
              msg: 'Excluindo transação ...',
            }).then((rs) => {
              if (rs.ok) {
                buscarDados()
              }
            })
          }
        }
      })
    })
  }

  const pesquisarID = async (id: string | number): Promise<TransactionInterface> => {
    return await clsCrud
      .pesquisar({
        entidade: "Transaction",
        criterio: {
          id: id,
          userId: usuarioState.idUsuario
        },
      })
      .then((rs: Array<TransactionInterface>) => {
        let dt: string = clsFormatacao.dataISOtoUser(rs[0].date)
        let vr: number = rs[0].amount
        return {
          ...rs[0],
          date: dt.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1$2$3"),
          amount: vr
        }
      })
  }


  const buscarDados = async () => {

    const dtInicial = layoutState.dataInicio ? clsFormatacao.dataISOtoDatetime(layoutState.dataInicio) : undefined
    const dtFinal = layoutState.dataFim ? clsFormatacao.dataISOtoDatetime(layoutState.dataFim) : undefined
    const conta = layoutState.contaPadrao ? layoutState.contaPadrao : undefined
    const categoria = layoutState.categoryId ? layoutState.categoryId : undefined
    const empresa = layoutState.companyId ? layoutState.companyId : undefined
    const tipo = layoutState.type ? layoutState.type : undefined
    const setor = layoutState.sectorId ? layoutState.sectorId : undefined
    const groupedLinCol = new Map<string, DataPoint>()
    const groupedCategory = new Map<string, CategoryDataPoint>()

    setDadosCard({ saldo: 0, receitas: 0, despesas: 0, transacoes: 0 })

    await clsApi.execute<Array<TransactionInterface>>({
      url: 'selecaoTransacoes',
      method: 'post',
      token: usuarioState.token,
      dtInicial,
      dtFinal,
      conta,
      categoria,
      tipo,
      setor,
      empresa,
      idUsuario: usuarioState.idUsuario
    }).then((rs: Array<TransactionInterface>) => {

      if (rs.length > 0) {
        let somaReceitas = 0;
        let somaDespesas = 0;
        let somaQtds = 0;

        rs.forEach((x) => {
          const amount = Number(x.amount) || 0;
          const qtd = Number(x.qtd) || 0;
          const type = x.category?.type ?? '';

          if (type === 'Receita') {
            somaReceitas += amount;
            somaQtds += qtd;
          } else if (type === 'Despesa') {
            somaDespesas += amount;
          }
        });

        const quantidadeTransacoes: number = rs[0].amount === null ? 0 : rs.length;
        const saldoInicial = Number(rs[0]?.account?.initialBalance) || 0;
        const saldoFinal = saldoInicial + (somaReceitas - somaDespesas);

        setDadosCard({
          saldo: saldoFinal,
          receitas: somaReceitas,
          despesas: somaDespesas,
          transacoes: quantidadeTransacoes,
        });

        if (rs[0].amount !== null) {
          setRsPesquisa(rs)
        }

      } else {

        setDadosCard({ saldo: 0, receitas: 0, despesas: 0, transacoes: 0 });
      }


      rs.forEach((x) => {
        const amount = Number(x.amount) || 0;
        const qtd = Number(x.qtd) || 0;
        const type = x.category?.type;
        const category = x.category;
        const date = x.date;


        if (!type || !category || !date) return; // pula itens inválidos

        const month = new Date(date).toISOString().slice(0, 7);

        if (!groupedLinCol.has(month)) {
          groupedLinCol.set(month, { date: month, receitas: 0, despesas: 0, qtd: 0 });
        }

        const currentLinCol = groupedLinCol.get(month)!;
        if (type === 'Receita') {
          currentLinCol.receitas += amount;
          currentLinCol.qtd += qtd;
        } else if (type === 'Despesa') {
          currentLinCol.despesas += amount;

        }
        groupedLinCol.set(month, currentLinCol);

        const key = `${category.name}-${type}`;
        if (!groupedCategory.has(key)) {
          groupedCategory.set(key, {
            name: category.name ?? 'Sem nome',
            value: 0,
            color: category.color ?? '#000000',
            type: type.toLowerCase() as 'receita' | 'despesa',
          });
        }

        const current = groupedCategory.get(key)!;
        current.value += amount;
        groupedCategory.set(key, current);
      });

      const resultData: DataPoint[] = Array.from(groupedLinCol.values()).sort((a, b) => a.date.localeCompare(b.date));
      const resultCategory: CategoryDataPoint[] = Array.from(groupedCategory.values()).sort((a, b) => a.name.localeCompare(b.name));

      setDataPoints(resultData);
      setCategoryData(resultCategory);
    });

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (layoutState.contaPadrao !== "") {
      buscarDados()
    }
  }, [layoutState])

  return (
    <div>
      <Grid container sx={{ p: 2 }}>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Saldo Atual"
            icone={<AttachMoneyIcon />}
            valor={Number(dadosCard.saldo)}
            formatoValor="moeda"
            texto="Atualização do saldo em tempo real"
            corFundo="#1309aa"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Receitas"
            icone={<TrendingUpIcon />}
            valor={dadosCard.receitas}
            formatoValor="moeda"
            texto="Total de receitas no período"
            corFundo="#05880c"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Despesas"
            icone={<TrendingDownIcon />}
            valor={dadosCard.despesas}
            formatoValor="moeda"
            texto="Total de despesas no período"
            corFundo="#860505"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Transações"
            icone={<BarChartIcon />}
            valor={dadosCard.transacoes}
            formatoValor="numero"
            texto="Total de transações no período"
            corFundo='#010108'
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ p: 1 }}>
          <FinancialChart
            title='Receitas e Despesas'
            data={dataPoints}
            backgroundColor="transparent" // Exemplo: fundo azul claro
            borderColor="#3a3a3a"    // Exemplo: borda cinza
          />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ p: 1 }}>
          <CategoryPieChart data={categoryData} />
        </Grid>
        <Grid item xs={12} sm={12} sx={{ p: 1 }}>
          <Box sx={{ bgcolor: 'transparent', p: 1, border: '1px solid #3a3a3a', borderRadius: '4px' }} >
            <Typography variant="h6" sx={{ mb: 2 }}>Ultimas transações</Typography>
            <DataTable
              backgroundColor='#050516'
              cabecalho={cabecalhoForm}
              dados={rsPesquisa}
              acoes={[
                {
                  icone: FileCopyTwoToneIcon,
                  corIcone: '#fff',
                  onAcionador: (rs: TransactionInterface) =>
                    onDuplicar(rs.id as string),
                  toolTip: "Duplicar",
                },
                {
                  icone: EditOutlinedIcon,
                  corIcone: '#fff',
                  onAcionador: (rs: TransactionInterface) =>
                    onEditar(rs.id as string),
                  toolTip: "Editar",
                },
                {
                  icone: DeleteTwoToneIcon,
                  corIcone: '#fff',
                  onAcionador: (rs: TransactionInterface) =>
                    onExcluir(rs.id as string),
                  toolTip: "Excluir",
                },
              ]} />
          </Box>
        </Grid>
      </Grid>
      <Condicional condicao={localState.action !== actionTypes.pesquisando}>
        <TransacoesFicha
          open={open}
          setOpen={setOpen}
          //btPesquisar={buscarDados}
          transacao={localState.action !== actionTypes.incluindo ? transacoes : undefined}
          localState={localState}
        />
      </Condicional>
    </div>
  )
}