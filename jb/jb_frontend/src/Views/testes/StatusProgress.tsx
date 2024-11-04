import { Card, CardContent, Typography, Avatar } from '@mui/material';


interface PedidoStatusProps {
  numeroPedido: string;
  status: 'aberto' | 'em produção' | 'fechado';
  dataPedido: string;
  nomeCliente: string;
}


const PedidoStatus: React.FC<PedidoStatusProps> = ({ numeroPedido, status, dataPedido, nomeCliente }) => {
  const getStatusAvatar = () => {
    switch (status) {
      case 'aberto':
        return <Avatar style={{ backgroundColor: '#2196F3' }}><i className="fas fa-hourglass-start"></i></Avatar>;
      case 'em produção':
        return <Avatar style={{ backgroundColor: '#FFC107' }}><i className="fas fa-cog"></i></Avatar>;
      case 'fechado':
        return <Avatar style={{ backgroundColor: '#4CAF50' }}><i className="fas fa-check-circle"></i></Avatar>;
      default:
        return <Avatar style={{ backgroundColor: '#9E9E9E' }}><i className="fas fa-question-circle"></i></Avatar>;
    }
  };


  const getStatusColor = () => {
    switch (status) {
      case 'aberto':
        return '#2196F3';
      case 'em produção':
        return '#FFC107';
      case 'fechado':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };


  return (
    <Card>
      <CardContent>
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
          {getStatusAvatar()}
          <span style={{ marginLeft: 16, color: getStatusColor() }}>{numeroPedido}</span>
        </Typography>
        <Typography variant="body1" style={{ color: getStatusColor() }}>
          {status}
        </Typography>
        <Typography variant="body2" style={{ color: '#666' }}>
          Data do pedido: {dataPedido}
        </Typography>
        <Typography variant="body2" style={{ color: '#666' }}>
          Cliente: {nomeCliente}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PedidoStatus;