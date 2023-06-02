import { Outlet, useParams, useSearchParams } from 'react-router-dom';
import './style.css';

export const Posts = () => {
  const params = useParams();
  console.log(params);
  const { id } = params;
  const [qs] = useSearchParams();
  return (
    <div>
      <h1>
        Posts {`Params: ${id}`}  {`QS: ${qs.get('page')}`}
      </h1>
      <Outlet />
    </div>
  );
};