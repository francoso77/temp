'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { supabase } from '@/lib/supabaseClient';
import LaunchForm from '@/components/LaunchForm';
import { Lancamento } from '@/types/Lancamento';
import { buscarLancamentos, excluirLancamento, salvarLancamento } from '@/services/lancamentosService';

interface LancamentoFormData {
  descricao: string;
  tipo: 'entrada' | 'saída';
  valor: number;
  categoria: string;
  data: string;
}

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [editing, setEditing] = useState<Lancamento | null>(null);

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const dados = await buscarLancamentos(user.id);
        setLancamentos(dados);
      }
    };
    void carregar();
  }, []);

  const handleSalvar = async (form: LancamentoFormData) => {
    const lancamentoFinal = editing
      ? { ...editing, ...form }
      : { ...form };

    await salvarLancamento(lancamentoFinal);

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const dados = await buscarLancamentos(user.id);
      setLancamentos(dados);
    }

    setEditing(null);
  };

  const handleExcluir = async (id: string) => {
    await excluirLancamento(id);
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const dados = await buscarLancamentos(user.id);
      setLancamentos(dados);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Lançamentos</Typography>
      <LaunchForm onSalvar={handleSalvar} lancamento={editing} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Descrição</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lancamentos.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.descricao}</TableCell>
              <TableCell>{l.tipo}</TableCell>
              <TableCell>{l.valor}</TableCell>
              <TableCell>{l.categoria}</TableCell>
              <TableCell>{new Date(l.data).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button onClick={() => setEditing(l)}>Editar</Button>
                <Button color="error" onClick={() => void handleExcluir(l.id ? l.id : 'none')}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
