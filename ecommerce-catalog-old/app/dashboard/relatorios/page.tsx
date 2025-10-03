"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Product } from '@/lib/types';

export default function DashboardRelatoriosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      // Espera endpoint GET /produtos que retorna array de produtos
      const res = await api.get('/produtos').then(r => r.data).catch(() => []);
      setProducts(res || []);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'promo') return Boolean((p as any).promocao);
    if (filter === 'active') return Boolean(p.ativo);
    return true;
  });

  function generateCatalogPdf() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text('Catálogo de Produtos', pageWidth / 2, 14, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Filtro: ${filter}`, 14, 22);

    const rows = filtered.map((p) => [
      p.nome || '',
      p.descricao || '',
      //(typeof p.preco === 'number' ? 'R$ ' + p.preco.toFixed(2) : p.preco || ''),
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [['Nome', 'Descrição', 'Preço']],
      body: rows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [30, 30, 30] }
    });

    doc.save('catalogo-produtos.pdf');
  }

  function generateSalesReportPdf() {
    api.get('/reports/sales-by-month').then(r => {
      const data = r.data || [];
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(16);
      doc.text('Relatório - Vendas por Mês', 14, 16);
      const rows = data.map((d: any) => [new Date(d.mes).toLocaleDateString(), Number(d.total).toFixed(2), d.pedidos]);
      // @ts-ignore
      doc.autoTable({
        head: [['Mês', 'Total (R$)', 'Pedidos']],
        body: rows,
        startY: 24,
        styles: { fontSize: 10 }
      });
      doc.save('vendas-por-mes.pdf');
    }).catch(err => {
      console.error('Erro ao buscar relatório', err);
      alert('Erro ao gerar relatório de vendas.');
    });
  }

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold'>Relatórios</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-3'>Gerar Catálogo de Produtos (PDF)</h3>
          <div className='mb-4'>
            <Select onValueChange={(v) => setFilter(v || 'all')}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Filtro' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='active'>Ativos</SelectItem>
                <SelectItem value='promo'>Em Promoção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button onClick={generateCatalogPdf}>Gerar PDF do Catálogo</Button>
            <Button variant='outline' onClick={loadProducts}>Atualizar Produtos</Button>
          </div>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-3'>Relatórios de Vendas</h3>
          <div className='flex gap-2'>
            <Button onClick={generateSalesReportPdf}>Vendas por Mês (PDF)</Button>
          </div>
        </div>
      </div>

      <div className='mt-6 bg-white p-4 rounded shadow'>
        <h4 className='font-medium mb-3'>Amostra de Produtos ({filtered.length})</h4>
        {loading ? <p>Carregando...</p> : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {filtered.slice(0, 12).map(p => (
              <div key={p.id} className='border rounded p-2'>
                <div className='font-semibold'>{p.nome}</div>
                <div className='text-sm text-muted-foreground'>{p.descricao}</div>
                <div className='mt-2'>R$ {(p.preco as any)?.toFixed?.(2) ?? p.preco}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
