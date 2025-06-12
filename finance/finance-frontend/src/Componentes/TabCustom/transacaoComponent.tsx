import { Box, Chip, Typography } from '@mui/material';
import DataTable, { DataTableCabecalhoInterface } from '../DataTable';
import ClsFormatacao from '../../Utils/ClsFormatacao';
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
