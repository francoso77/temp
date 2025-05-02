import { Lancamento } from '../types/Lancamento';

export const calcularSaldo = (lancamentos: Lancamento[]): number => {
  return lancamentos.reduce((acc, l) => {
    const valor = typeof l.valor === 'string' ? parseFloat(l.valor) : l.valor;
    return l.tipo === 'entrada' ? acc + valor : acc - valor;
  }, 0);
};
