import React, { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { CategoryDataPoint, DataPoint } from '../../types/graficoTypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { CategoryInterface } from '../../../../finance-backend/src/interfaces/category';
import ClsCrud from '../../Utils/ClsCrudApi';
import { CompanyInterface } from '../../../../finance-backend/src/interfaces/company';
import { AccountInterface } from '../../../../finance-backend/src/interfaces/account';
import { Box, Grid, Typography } from '@mui/material';
import CustomButton from '../../Componentes/Button';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import ButtonMenu from '../../Componentes/ButtonMenu';
import InfoCard from '../../Componentes/InfoCard';
import CustomTabs from '../../Componentes/TabCustom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


interface DadosCardInterface {
  saldo: number;
  receitas: number;
  despesas: number;
}

export interface TransactionSelectInterface {
  id: number;
  date: string | Date; // Pode ser string se vier do banco como ISO ou Date se já for convertido
  amount: number;
  setor: string;
  type: string;
  description: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  account: {
    id: string;
    name: string;
    initialBalance: number;
  };
  company: {
    id: string;
    name: string;
  };
}

export function Relatorios() {

  const printRef = useRef<HTMLDivElement>(null);
  const clsFormatacao: ClsFormatacao = new ClsFormatacao();
  const clsApi: ClsApi = new ClsApi();
  const clsCrud: ClsCrud = new ClsCrud();

  const { setMensagemState, mensagemState, usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [dadosCard, setDadosCard] = useState<DadosCardInterface>({ saldo: 0, receitas: 0, despesas: 0 });
  const [dataPoints, setDataPoints] = useState<Array<DataPoint>>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface;
  const [rsPesquisa, setRsPesquisa] = useState<Array<TransactionSelectInterface>>([]);
  const [categorys, setCategorys] = useState<Array<CategoryInterface>>([]);
  const [companys, setCompanys] = useState<Array<CompanyInterface>>([]);
  const [accounts, setAccounts] = useState<Array<AccountInterface>>([]);

  const buscarDados = async () => {

    const dtInicial = layoutState.dataInicio ? clsFormatacao.dataISOtoDatetime(layoutState.dataInicio) : undefined
    const dtFinal = layoutState.dataFim ? clsFormatacao.dataISOtoDatetime(layoutState.dataFim) : undefined
    const conta = layoutState.contaPadrao ? layoutState.contaPadrao : undefined
    const categoria = layoutState.categoryId ? layoutState.categoryId : undefined
    const setor = layoutState.setor ? layoutState.setor : undefined
    const tipo = layoutState.type ? layoutState.type : undefined
    const groupedLinCol = new Map<string, DataPoint>()
    const groupedCategory = new Map<string, CategoryDataPoint>()

    setDadosCard({ saldo: 0, receitas: 0, despesas: 0 })

    await clsApi.execute<Array<TransactionSelectInterface>>({
      url: 'selecaoTransacoes',
      method: 'post',
      token: usuarioState.token,
      dtInicial,
      dtFinal,
      conta,
      categoria,
      setor,
      tipo
    }).then((rs: Array<TransactionSelectInterface>) => {
      if (rs.length > 0) {
        let somaReceitas = 0;
        let somaDespesas = 0;

        rs.forEach((x) => {
          const amount = x.amount ?? 0;
          const type = x.type ?? '';

          if (type === 'Receita') {
            somaReceitas += amount;
          } else if (type === 'Despesa') {
            somaDespesas += amount;
          }
        });

        const saldoInicial = rs[0]?.account?.initialBalance ?? 0;

        setDadosCard({
          saldo: saldoInicial + somaReceitas - somaDespesas,
          receitas: somaReceitas,
          despesas: somaDespesas,
        });

        if (rs[0].amount !== null) {
          setRsPesquisa(rs)
        }
      } else {

        setDadosCard({ saldo: 0, receitas: 0, despesas: 0 });
      }

      rs.forEach((x) => {
        const amount = x.amount ?? 0;
        const type = x.type;
        const category = x.category;
        const date = x.date;

        if (!type || !category || !date) return; // pula itens inválidos

        const month = new Date(date).toISOString().slice(0, 7);

        if (!groupedLinCol.has(month)) {
          groupedLinCol.set(month, { date: month, receitas: 0, despesas: 0 });
        }

        const currentLinCol = groupedLinCol.get(month)!;
        if (type === 'Receita') {
          currentLinCol.receitas += amount;
        } else if (type === 'Despesa') {
          currentLinCol.despesas += amount;
        }
        groupedLinCol.set(month, currentLinCol);

        const key = `${category.name}-${type}`;
        if (!groupedCategory.has(key)) {
          groupedCategory.set(key, {
            name: category.name ?? 'Sem nome',
            value: 0,
            color: category.color ?? '#000000',
            type: type.toLowerCase() as 'receita' | 'despesa',
          });
        }

        const current = groupedCategory.get(key)!;
        current.value += amount;
        groupedCategory.set(key, current);
      });

      const resultData: DataPoint[] = Array.from(groupedLinCol.values());
      const resultCategory: CategoryDataPoint[] = Array.from(groupedCategory.values());
      setDataPoints(resultData);
      setCategoryData(resultCategory);
    });

    const rsCategorys = await clsCrud.pesquisar({
      entidade: 'Category',
      campoOrder: ['name'],
    })

    setCategorys(rsCategorys)

    const rsCompanys = await clsCrud.pesquisar({
      entidade: 'Company',
      campoOrder: ['name'],
    })

    setCompanys(rsCompanys)

    const rsAccounts = await clsCrud.pesquisar({
      entidade: 'Account',
      campoOrder: ['name'],
    })

    setAccounts(rsAccounts)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (layoutState.contaPadrao !== "") {
      buscarDados()
    }
  }, [layoutState])


  const handleClose = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("pt-BR");

    const formatCurrency = (valor: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Relatório Financeiro", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 105, 22, { align: "center" });

    // Informações da conta
    const conta = rsPesquisa[0]?.account?.name || "N/A";
    const saldoInicial = formatCurrency(rsPesquisa[0]?.account?.initialBalance || 0);

    doc.setFontSize(11);
    doc.text(`Conta: ${conta}`, 14, 32);
    doc.text(`Saldo Inicial: ${saldoInicial}`, 14, 38);

    // Cartões resumo
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246); // Azul
    doc.text(`Saldo: ${formatCurrency(dadosCard.saldo)}`, 14, 50);

    doc.setTextColor(34, 197, 94); // Verde
    doc.text(`Receitas: ${formatCurrency(dadosCard.receitas)}`, 75, 50);

    doc.setTextColor(239, 68, 68); // Vermelho
    doc.text(`Despesas: ${formatCurrency(dadosCard.despesas)}`, 150, 50);

    doc.setTextColor(0, 0, 0); // Volta ao padrão

    // Tabela
    const rows = rsPesquisa.map((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR");
      const category = categorys.find((c) => c.id === t.category.id)?.name || "Sem categoria";
      const type = t.type;
      const valor = formatCurrency(t.amount);
      return [date, t.description, category, type, valor];
    });

    autoTable(doc, {
      startY: 60,
      head: [["Data", "Descrição", "Categoria", "Tipo", "Valor"]],
      body: rows,
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        4: { halign: "right" },
      },
    });

    // Rodapé
    doc.setFontSize(10);
    doc.text("FinanceControl - Sistema de Gestão Financeira", 105, doc.internal.pageSize.height - 10, {
      align: "center",
    });

    // Geração do PDF em blob
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    // Abre em nova aba (melhor para dispositivos móveis)
    window.open(blobUrl, "_blank");

    // Libera o objeto após alguns segundos para evitar erro ao clicar "voltar"
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);
  };


  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      setMensagemState({
        titulo: 'Erro',
        exibir: true,
        mensagem: 'Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: handleClose
      });
      return;
    }

    const contentToPrint = printRef.current;
    if (!contentToPrint || !rsPesquisa.length) {
      printWindow.close();
      return;
    }

    const currentDate = new Date().toLocaleDateString("pt-BR");

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

    const buildTableRows = () =>
      rsPesquisa.map((t) => {
        const date = new Date(t.date).toLocaleDateString("pt-BR");
        const category = categorys.find((c) => c.id === t.category.id)?.name || "Sem categoria";
        const type = t.type === "Receita" ? "Receita" : "Despesa";
        const amount = formatCurrency(t.amount);
        const amountClass = t.type === "Receita" ? "income" : "expense";

        return `
        <tr>
          <td>${date}</td>
          <td>${t.description}</td>
          <td>${category}</td>
          <td>${type}</td>
          <td class="${amountClass}">${amount}</td>
        </tr>`;
      }).join("");

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Relatório Financeiro - ${currentDate}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          .account-info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .summary-item {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            width: 30%;
          }
          .summary-item h3 {
            margin-top: 0;
            font-size: 16px;
            color: #666;
          }
          .summary-item p {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0 5px;
          }
          .income { color: #22c55e; }
          .expense { color: #ef4444; }
          .balance { color: #3b82f6; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { print-color-adjust: exact; }
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="header">
          <h1>Relatório Financeiro</h1>
          <p>Gerado em ${currentDate}</p>
        </div>

        <div class="account-info">
          <h2>Conta: ${rsPesquisa[0].account.name}</h2>
          <p>Saldo Inicial: ${formatCurrency(rsPesquisa[0].account.initialBalance)}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <h3>Saldo</h3>
            <p class="balance">${formatCurrency(dadosCard.saldo)}</p>
          </div>
          <div class="summary-item">
            <h3>Receitas</h3>
            <p class="income">${formatCurrency(dadosCard.receitas)}</p>
          </div>
          <div class="summary-item">
            <h3>Despesas</h3>
            <p class="expense">${formatCurrency(dadosCard.despesas)}</p>
          </div>
        </div>

        <h2>Transações</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${buildTableRows()}
          </tbody>
        </table>

        <div class="footer">
          <p>FinanceControl - Sistema de Gestão Financeira</p>
        </div>
      </body>
    </html>
  `;

    // Escreve o HTML completo e força a renderização + impressão
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    const headers = ["Data", "Descrição", "Empresa", "Categoria", "Tipo", "Valor", "Conta"];

    const rows = rsPesquisa.map((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR");
      const description = (t.description || "").replace(/"/g, '""');
      const company = (companys.find((c) => c.id === t.company?.id)?.name || "Sem empresa").replace(/"/g, '""');
      const category = (categorys.find((c) => c.id === t.category?.id)?.name || "Sem categoria").replace(/"/g, '""');
      const type = t.type === "Receita" ? "Receita" : "Despesa";
      const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(t.amount);
      const account = accounts.find((acc) => acc.id === t.account?.id)?.name || "Conta Desconhecida";

      return [
        date,
        description,
        company,
        category,
        type,
        amount,
        account,
      ].map((val) => `"${val}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-financeiro-${rsPesquisa[0]?.account?.name || "sem-conta"}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const headers = ["Data", "Descrição", "Empresa", "Categoria", "Tipo", "Valor", "Conta"];

    const tableRows = rsPesquisa.map((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR");
      const description = (t.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const company = (companys.find((c) => c.id === t.company?.id)?.name || "Sem empresa")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const category = (categorys.find((c) => c.id === t.category?.id)?.name || "Sem categoria")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const type = t.type === "Receita" ? "Receita" : "Despesa";
      const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(t.amount);
      const account = accounts.find((acc) => acc.id === t.account?.id)?.name || "Conta Desconhecida";

      return `<tr>
      <td>${date}</td>
      <td>${description}</td>
      <td>${company}</td>
      <td>${category}</td>
      <td>${type}</td>
      <td>${amount}</td>
      <td>${account}</td>
    </tr>`;
    });

    const htmlTable = `
    <table border="1">
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${tableRows.join("")}</tbody>
    </table>`;

    const blob = new Blob([htmlTable], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-financeiro-${rsPesquisa[0]?.account?.name || "sem-conta"}-${new Date().toISOString().split("T")[0]}.xls`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ m: 2, textAlign: 'left' }}>Relatórios</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomButton
              onClick={handleGeneratePDF}
              bgColor='transparent'
              textColor='#fff'
              sx={{ border: '1px solid #3a3a3a', mr: 2 }}
              iconPosition='start'
              icon={<LocalPrintshopIcon />}
            >
              Imprimir
            </CustomButton>
            <ButtonMenu
              nameButton="Exportar"
              menuItems={[
                { label: 'Exportar como CSV', icon: <DescriptionTwoToneIcon />, onClick: handleExportCSV },
                { label: 'Exportar como Excel', icon: <DescriptionTwoToneIcon />, onClick: handleExportExcel },
              ]}

            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ p: 1 }}>
          <InfoCard
            titulo="Saldo no Período"
            valor={dadosCard.saldo}
            formatoValor="moeda"
            corFundo="#1309aa"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ p: 1 }}>
          <InfoCard
            titulo="Receitas no Período"
            valor={dadosCard.receitas}
            formatoValor="moeda"
            corFundo="#05880c"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ p: 1 }}>
          <InfoCard
            titulo="Despesas no Período"
            valor={dadosCard.despesas}
            formatoValor="moeda"
            corFundo="#860505"
            corBorda="#3a3a3a"
            espessuraBorda={2}
          />
        </Grid>
        <Grid item xs={12} sx={{ p: 1 }}>
          <CustomTabs
            dataOverview={dataPoints}
            dataCategoria={categoryData}
            dataTransacao={rsPesquisa}
          />
        </Grid>
      </Grid>
    </>
  )
}