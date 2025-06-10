import { CategoryDataPoint } from '../../types/graficoTypes';
import CategoryPieChart from '../../Views/Dashboard/CategoryPieChart';

const CategoriaComponent = ({ data }: { data: CategoryDataPoint[] }) => (
  <div style={{ color: '#fff' }}>
    <CategoryPieChart data={data} />
  </div>
);

export default CategoriaComponent;

