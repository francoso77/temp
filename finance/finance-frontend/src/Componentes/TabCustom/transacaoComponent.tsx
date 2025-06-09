const TransacaoComponent = ({ filtro }: { filtro: { status: string } }) => (
  <div style={{ color: '#fff' }}>Filtro: {filtro.status}</div>
);

export default TransacaoComponent;
