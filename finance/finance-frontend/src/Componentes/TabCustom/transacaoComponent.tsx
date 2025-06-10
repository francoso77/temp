import { Box, Typography } from '@mui/material';
import DataTable, { DataTableCabecalhoInterface } from '../DataTable';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { TransactionInterface } from '../../../../finance-backend/src/interfaces/transaction';
import { TransactionSelectInterface } from '../../Views/Relatorios/relatorios';

const clsFormatacao: ClsFormatacao = new ClsFormatacao();

const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
  {
    cabecalho: 'Data',
    alinhamento: 'left',
    campo: 'date',
    format: (data) => clsFormatacao.dataISOtoUser(data)
  },
  {
    cabecalho: 'Descrição',
    alinhamento: 'left',
    campo: 'description',
  },
  {
    cabecalho: 'Setor',
    alinhamento: 'center',
    campo: 'setor',
  },
  {
    cabecalho: 'Empresa',
    alinhamento: 'center',
    campo: 'company',
    format: (_v, rs: any) => rs.company.name
  },
  {
    cabecalho: 'Categoria',
    alinhamento: 'center',
    campo: 'category',
    format: (_v, rs: any) => rs.category.name
  },
  {
    campo: 'type',
    cabecalho: 'Tipo',
    alinhamento: 'center',
    chipColor: (valor) => {
      switch (valor) {
        case 'Receita': return 'success';
        case 'Despesa': return 'error';
        default: return 'default';
      }
    },
  },
  {
    campo: 'amount',
    cabecalho: 'Valor',
    alinhamento: 'right',
    render: (valor: number, row: TransactionInterface) => {
      const isReceita = row.type === 'Receita'
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

const TransacaoComponent = ({ data }: { data: TransactionSelectInterface[] }) => (

  <div style={{ color: '#fff' }}>
    <Box sx={{ bgcolor: 'transparent', p: 1, border: '1px solid #3a3a3a', borderRadius: '4px' }} >
      <Typography variant="h6" sx={{ mb: 2 }}>Lista de transações</Typography>
      <DataTable
        backgroundColor='#050516'
        cabecalho={cabecalhoForm}
        dados={data}
        acoes={[]}
      />
    </Box>

  </div>
);

export default TransacaoComponent;
