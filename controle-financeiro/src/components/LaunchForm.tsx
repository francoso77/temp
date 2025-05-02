import { useState, useEffect } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { Lancamento } from '@/types/Lancamento';

interface LancamentoFormData {
  descricao: string;
  tipo: 'entrada' | 'saída';
  valor: number;
  categoria: string;
  data: string;
}

interface LaunchFormProps {
  onSalvar: (lancamento: LancamentoFormData) => void;
  lancamento?: Lancamento | null;
}

export default function LaunchForm({ onSalvar, lancamento }: LaunchFormProps) {
  const [form, setForm] = useState<LancamentoFormData>({
    descricao: '',
    tipo: 'saída',
    valor: 0,
    categoria: '',
    data: '',
  });

  useEffect(() => {
    if (lancamento) {
      const { descricao, tipo, valor, categoria, data } = lancamento;
      setForm({
        descricao,
        tipo,
        valor: Number(valor),
        categoria,
        data,
      });
    }
  }, [lancamento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    onSalvar(form);
    setForm({
      descricao: '',
      tipo: 'saída',
      valor: 0,
      categoria: '',
      data: '',
    });
  };

  return (
    <>
      <TextField label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Tipo" name="tipo" select value={form.tipo} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="entrada">Entrada</MenuItem>
        <MenuItem value="saída">Saída</MenuItem>
      </TextField>
      <TextField
        label="Valor"
        name="valor"
        type="number"
        value={form.valor}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField label="Categoria" name="categoria" value={form.categoria} onChange={handleChange} fullWidth margin="normal" />
      <TextField
        label="Data"
        name="data"
        type="date"
        value={form.data}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
    </>
  );
}
