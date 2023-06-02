import { useEffect, useRef, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

export const Redirect = () => {

  const [time, setTime] = useState(3);
  const timeout = useRef('0');
  const irPara = useNavigate();

  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000).toString();

    if (time <= 0) {
      irPara('/', {
        state: `Estou enviando aqui o ESTADO: ${Math.random()}`,
      });
    }
    return () => {
      clearTimeout(timeout.current);
    };
  }, [time]);
  return (
    <div>
      <h1>
        Você sairá dessa página em {time}
      </h1>
    </div>
  );
};