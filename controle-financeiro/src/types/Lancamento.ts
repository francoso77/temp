export interface Lancamento {
    id?: string;
    descricao: string;
    tipo: 'entrada' | 'saída';
    valor: number | string;
    categoria: string;
    data: string;
    user_id?: string;
  }
  