// src/components/PedidoForm.tsx
import React, { useState, useEffect } from 'react';
// import { createPedidoWithDetails, updatePedido, getPedido, removeDetalhePedido } from '../services/pedidoService';
import { useParams } from 'react-router-dom';

const PedidoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataPedido, setDataPedido] = useState('');
  const [idVendedor, setIdVendedor] = useState('');
  const [idPrazoDeEntrega, setIdPrazoDeEntrega] = useState('');
  const [detalhes, setDetalhes] = useState([{ idProduto: '', qtd: '', vr: '', idDetalhePedido: '' }]);

  // useEffect(() => {
  //   if (id) {
  //     getPedido(parseInt(id)).then(response => {
  //       const pedido = response.data;
  //       setDataPedido(pedido.dataPedido);
  //       setIdVendedor(pedido.idVendedor);
  //       setIdPrazoDeEntrega(pedido.idPrazoDeEntrega);
  //       setDetalhes(pedido.detalhes.map((detalhe: any) => ({ ...detalhe, idDetalhePedido: detalhe.idDetalhePedido })));
  //     });
  //   }
  // }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      // await updatePedido(parseInt(id), 
      //   { dataPedido: new Date(dataPedido), idVendedor: parseInt(idVendedor), idPrazoDeEntrega: parseInt(idPrazoDeEntrega) },
      //   detalhes.map(d => ({ idProduto: parseInt(d.idProduto), qtd: parseInt(d.qtd), vr: parseFloat(d.vr) }))
      // );
    } else {
      // await createPedidoWithDetails(
      //   { dataPedido: new Date(dataPedido), idVendedor: parseInt(idVendedor), idPrazoDeEntrega: parseInt(idPrazoDeEntrega) },
      //   detalhes.map(d => ({ idProduto: parseInt(d.idProduto), qtd: parseInt(d.qtd), vr: parseFloat(d.vr) }))
      // );
    }
  };

  const handleDetailChange = (index: number, field: string, value: string) => {
    const newDetails = [...detalhes];
    // newDetails[index][field] = value;
    setDetalhes(newDetails);
  };

  const addDetail = () => {
    // setDetalhes([...detalhes, { idProduto: '', qtd: '', vr: '' }]);
  };

  const removeDetail = async (index: number) => {
    if (id && detalhes[index].idDetalhePedido) {
      // await removeDetalhePedido(detalhes[index].idDetalhePedido);
    }
    const newDetails = detalhes.filter((_, i) => i !== index);
    setDetalhes(newDetails);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Data do Pedido:</label>
        <input
          type="date"
          value={dataPedido}
          onChange={e => setDataPedido(e.target.value)}
        />
      </div>
      <div>
        <label>ID do Vendedor:</label>
        <input
          type="number"
          value={idVendedor}
          onChange={e => setIdVendedor(e.target.value)}
        />
      </div>
      <div>
        <label>ID do Prazo de Entrega:</label>
        <input
          type="number"
          value={idPrazoDeEntrega}
          onChange={e => setIdPrazoDeEntrega(e.target.value)}
        />
      </div>
      <div>
        <label>Detalhes do Pedido:</label>
        {detalhes.map((detalhe, index) => (
          <div key={index}>
            <input
              type="number"
              placeholder="ID do Produto"
              value={detalhe.idProduto}
              onChange={e => handleDetailChange(index, 'idProduto', e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={detalhe.qtd}
              onChange={e => handleDetailChange(index, 'qtd', e.target.value)}
            />
            <input
              type="number"
              placeholder="Valor"
              value={detalhe.vr}
              onChange={e => handleDetailChange(index, 'vr', e.target.value)}
            />
            <button type="button" onClick={() => removeDetail(index)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={addDetail}>Adicionar Detalhe</button>
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default PedidoForm;
