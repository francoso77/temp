// src/components/LaunchList.tsx
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Lancamento } from '@/types/Lancamento';

interface LaunchListProps {
  lancamentos: Lancamento[];
  onEditar: (lancamento: Lancamento) => void;
  onExcluir: (id: string) => void;
}

export default function LaunchList({ lancamentos, onEditar, onExcluir }: LaunchListProps) {
  return (
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
            <TableCell>
              {typeof l.valor === 'number'
                ? l.valor.toFixed(2)
                : parseFloat(l.valor).toFixed(2)}
            </TableCell>
            <TableCell>{l.categoria}</TableCell>
            <TableCell>{new Date(l.data).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button onClick={() => onEditar(l)}>Editar</Button>
              <Button color="error" onClick={() => onExcluir(l.id!)}>Excluir</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
