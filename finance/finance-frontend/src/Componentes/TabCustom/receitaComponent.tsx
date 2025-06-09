const ReceitaComponent = ({ data }: { data: string[] }) => (
  <ul style={{ color: '#fff' }}>{data.map((item, i) => <li key={i}>{item}</li>)}</ul>
);

export default ReceitaComponent;
