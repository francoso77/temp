'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Corrigido para o App Router
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Container, Typography } from '@mui/material';
import { supabase } from '@/lib/supabaseClient';
import { calcularSaldo } from '@/utils/calcularSaldo';
import { buscarLancamentos } from '@/services/lancamentosService';

export default function Dashboard() {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [saldo, setSaldo] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      const dados = await buscarLancamentos(user.id);
      setLancamentos(dados);
      setSaldo(calcularSaldo(dados));
    };
    fetchData();
  }, []);

  const categorias = Array.from(new Set(lancamentos.map((l: any) => l.categoria)));
  const dadosPizza = categorias.map(cat => ({
    name: cat,
    value: lancamentos
      .filter((l: any) => l.categoria === cat && l.tipo === 'saída')
      .reduce((acc: number, l: any) => acc + parseFloat(l.valor), 0)
  }));

  const dadosLinha = lancamentos.reduce((acc: any, l: any) => {
    const mes = new Date(l.data).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    if (!acc[mes]) acc[mes] = 0;
    if (l.tipo === 'saída') acc[mes] += parseFloat(l.valor);
    return acc;
  }, {});

  const dadosGraficoLinha = Object.entries(dadosLinha).map(([mes, valor]) => ({ mes, valor }));

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Saldo Atual: R$ {saldo.toFixed(2)}</Typography>

      <Typography variant="h6">Gastos por Categoria</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={dadosPizza} dataKey="value" nameKey="name" outerRadius={100}>
            {dadosPizza.map((_, index) => (
              <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Typography variant="h6">Evolução dos Gastos</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosGraficoLinha}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="valor" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}
