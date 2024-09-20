import React, { useEffect } from 'react';
import ClsApi from '../../Utils/ClsApi';
import ClsCrud from '../../Utils/ClsCrudApi';

// Função para gerar dinamicamente a tabela
const createDynamicTable = (headers: string[], data: string[][]) => {
  const table = document.getElementById('dynamicTable') as HTMLTableElement;
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  // Limpar qualquer conteúdo existente
  if (thead) thead.innerHTML = '';
  if (tbody) tbody.innerHTML = '';

  // Criar cabeçalho da tabela
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  if (thead) thead.appendChild(headerRow);

  // Criar linhas da tabela com os dados
  data.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    if (tbody) tbody.appendChild(tr);
  });
};

const DynamicTablePage: React.FC = () => {
  const clsApi = new ClsApi();
  const clsCrud = new ClsCrud();

  const [dados, setDados] = React.useState<any[]>([])


  useEffect(() => {
    // Dados da tabela dinâmica
    const tableHeaders = ['Nome', 'Idade', 'Cidade']; // Cabeçalhos das colunas
    const tableData = [
      ['Maria', '30', 'São Paulo'],
      ['João', '25', 'Rio de Janeiro'],
      ['Ana', '28', 'Belo Horizonte']
    ];

    // Chama a função para gerar a tabela
    createDynamicTable(tableHeaders, tableData);


  }, []);

  const pesquisarDados = () => {
    clsCrud.pesquisar({
      entidade: 'Pedido',
      relations: [
        'detalhePedidos',
        'detalhePedidos.produto',
        'detalhePedidos.produto.estrutura',

      ],
    })
  }
  return (
    <div>
      <header style={headerStyle}>
        {/* <div className="logo">
          <img src="logo.png" alt="Logotipo" style={{ width: '50px' }} />
        </div> */}
        <h1>Relação de Produção</h1>
      </header>

      <main style={mainStyle}>
        <section>
          <h2>Ordem de Serviços</h2>
          <table id="dynamicTable" style={tableStyle}>
            <thead>
              {/* Cabeçalho da tabela será gerado dinamicamente */}
            </thead>
            <tbody>
              {/* Conteúdo da tabela será gerado dinamicamente */}
            </tbody>
          </table>
        </section>
      </main>

      <footer style={footerStyle}>
        <p>Rodapé da página</p>
      </footer>
    </div>
  );
};

// Estilos inline (pode ser movido para um arquivo CSS)
const headerStyle: React.CSSProperties = {
  padding: '0 0',
  textAlign: 'center',
  borderBottom: '1px solid #ccc',
};

const mainStyle: React.CSSProperties = {
  padding: '20px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const footerStyle: React.CSSProperties = {
  // backgroundColor: '#333',
  // color: 'white',
  textAlign: 'center',
  padding: '10px',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

export default DynamicTablePage;
