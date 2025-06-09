const CategoriaComponent = ({ categorias }: { categorias: string[] }) => (
  <div style={{ color: '#fff' }}>
    Categorias:
    <ul>{categorias.map((cat, i) => <li key={i}>{cat}</li>)}</ul>
  </div>
);

export default CategoriaComponent;
