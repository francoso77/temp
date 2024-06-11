import React from 'react';
import * as Styled from './styles';

interface CurrencyProps {
  value: number;
}

const Currency: React.FC<CurrencyProps> = ({ value }) => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return <>{formattedValue}</>
};

export default Currency;