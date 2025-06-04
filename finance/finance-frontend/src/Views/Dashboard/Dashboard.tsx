import { Grid, Paper } from '@mui/material';
import react from 'react';
import InfoCard from '../../Componentes/InfoCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import FinancialChart from './FinancialChart';
import { CategoryDataPoint, DataPoint } from '../../types/graficoTypes';
import CategoryPieChart from './CategoryPieChart';


export default function Dashboard() {

  const sampleData: DataPoint[] = [
    { date: '2024-01', receitas: 4000, despesas: 2400 },
    { date: '2024-02', receitas: 3000, despesas: 1398 },
    { date: '2024-03', receitas: 2000, despesas: 9800 },
    { date: '2024-04', receitas: 2780, despesas: 3908 },
    { date: '2024-05', receitas: 1890, despesas: 4800 },
    { date: '2024-06', receitas: 2390, despesas: 3800 },
    { date: '2024-07', receitas: 3490, despesas: 4300 },
  ];

  const sampleCategoryData: CategoryDataPoint[] = [
    // Despesas
    { name: 'Alimentação', value: 450.75, color: '#FF6384', type: 'despesa' },
    { name: 'Transporte', value: 120.00, color: '#36A2EB', type: 'despesa' },
    { name: 'Moradia', value: 850.00, color: '#FFCE56', type: 'despesa' },
    { name: 'Lazer', value: 200.50, color: '#4BC0C0', type: 'despesa' },
    { name: 'Outros (D)', value: 95.20, color: '#9966FF', type: 'despesa' },
    // Receitas
    { name: 'Salário', value: 3500.00, color: '#8BC34A', type: 'receita' },
    { name: 'Freelance', value: 750.00, color: '#CDDC39', type: 'receita' },
    { name: 'Investimentos', value: 300.00, color: '#FF9800', type: 'receita' },
    { name: 'Outros (R)', value: 50.00, color: '#00BCD4', type: 'receita' },
  ];

  return (
    <div>
      <Grid container sx={{ p: 2 }}>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Saldo Atual"
            icone={<AttachMoneyIcon />}
            valor={56801.5}
            formatoValor="moeda"
            texto="Atualizado em tempo real"
            corFundo="#1309aa"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={3} sx={{ p: 1 }}>
          <InfoCard
            titulo="Receitas"
            icone={<TrendingUpIcon />}
            valor={184161.31}
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
            valor={132360.11}
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
            valor={87}
            formatoValor="numero"
            texto="Total de transações no período"
            corFundo='#010108'
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ p: 2 }}>
        <Grid item xs={12} sm={6} sx={{ p: 1 }}>
          <Paper sx={{ padding: 2, marginTop: 2 }}>
            <FinancialChart
              data={sampleData}
              backgroundColor="transparent" // Exemplo: fundo azul claro
              borderColor="#3a3a3a"    // Exemplo: borda cinza
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ p: 1 }}>
          <Paper sx={{ padding: 2, marginTop: 2 }}>
            <CategoryPieChart data={sampleCategoryData} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}