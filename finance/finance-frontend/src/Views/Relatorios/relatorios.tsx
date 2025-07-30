import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { CategoryDataPoint, DataPoint } from '../../types/graficoTypes';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import ClsApi from '../../Utils/ClsApi';
import ClsCrud from '../../Utils/ClsCrudApi';
import { Box, Grid, Typography } from '@mui/material';
import CustomButton from '../../Componentes/Button';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ButtonMenu from '../../Componentes/ButtonMenu';
import InfoCard from '../../Componentes/InfoCard';
import CustomTabs from '../../Componentes/TabCustom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CompanyInterface } from '../../Interfaces/company';
import { AccountInterface } from '../../Interfaces/account';
import { CategoryInterface } from '../../Interfaces/category';
import { SectorInterface } from '../../Interfaces/sector';


interface DadosCardInterface {
  saldo: number;
  receitas: number;
  despesas: number;
}

export interface TransactionSelectInterface {
  date: string | Date; // Pode ser string se vier do banco como ISO ou Date se já for convertido
  amount: number;
  qtd: number;
  description: string;
  userId: string;
  category: {
    id: string;
    name: string;
    color: string;
    type: string;
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
  sector: {
    id: string;
    name: string;
  };
}

export function Relatorios() {

  const clsFormatacao: ClsFormatacao = new ClsFormatacao();
  const clsApi: ClsApi = new ClsApi();
  const clsCrud: ClsCrud = new ClsCrud();

  const { usuarioState } = useContext(GlobalContext) as GlobalContextInterface;
  const [dadosCard, setDadosCard] = useState<DadosCardInterface>({ saldo: 0, receitas: 0, despesas: 0 });
  const [dataPoints, setDataPoints] = useState<Array<DataPoint>>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const { layoutState } = useContext(GlobalContext) as GlobalContextInterface;
  const [rsPesquisa, setRsPesquisa] = useState<Array<TransactionSelectInterface>>([]);
  const [categorys, setCategorys] = useState<Array<CategoryInterface>>([]);
  const [companys, setCompanys] = useState<Array<CompanyInterface>>([]);
  const [accounts, setAccounts] = useState<Array<AccountInterface>>([]);
  const [sectors, setSectors] = useState<Array<SectorInterface>>([]);

  const buscarDados = async () => {

    const dtInicial = layoutState.dataInicio ? clsFormatacao.dataISOtoDatetime(layoutState.dataInicio) : undefined
    const dtFinal = layoutState.dataFim ? clsFormatacao.dataISOtoDatetime(layoutState.dataFim) : undefined
    const conta = layoutState.contaPadrao ? layoutState.contaPadrao : undefined
    const categoria = layoutState.categoryId ? layoutState.categoryId : undefined
    const tipo = layoutState.type ? layoutState.type : undefined
    const empresa = layoutState.companyId ? layoutState.companyId : undefined
    const setor = layoutState.sectorId ? layoutState.sectorId : undefined
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
      tipo,
      empresa,
      setor,
      idUsuario: usuarioState.idUsuario
    }).then((rs: Array<TransactionSelectInterface>) => {
      if (rs.length > 0) {
        let somaReceitas = 0;
        let somaDespesas = 0;

        rs.forEach((x) => {
          const amount = Number(x.amount) || 0;
          const type = x.category?.type ?? '';

          if (type === 'Receita') {
            somaReceitas += amount;
          } else if (type === 'Despesa') {
            somaDespesas += amount;
          }
        });

        const saldoInicial = Number(rs[0]?.account?.initialBalance) || 0;

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
        const amount = Number(x.amount) || 0;
        const qtd = Number(x.qtd) || 0;
        const type = x.category?.type;
        const category = x.category;
        const date = x.date;

        if (!type || !category || !date) return; // pula itens inválidos

        const month = new Date(date).toISOString().slice(0, 7);

        if (!groupedLinCol.has(month)) {
          groupedLinCol.set(month, { date: month, receitas: 0, despesas: 0, qtd: 0 });
        }

        const currentLinCol = groupedLinCol.get(month)!;
        if (type === 'Receita') {
          currentLinCol.receitas += amount;
          currentLinCol.qtd += qtd;
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

      const resultData: DataPoint[] = Array.from(groupedLinCol.values()).sort((a, b) => a.date.localeCompare(b.date));
      const resultCategory: CategoryDataPoint[] = Array.from(groupedCategory.values()).sort((a, b) => a.name.localeCompare(b.name));
      setDataPoints(resultData);
      setCategoryData(resultCategory);
    });

    const rsSectors = await clsCrud.pesquisar({
      entidade: 'Sector',
      criterio: {
        userId: usuarioState.idUsuario
      },
      campoOrder: ['name'],
    })

    setSectors(rsSectors)

    const rsCategorys = await clsCrud.pesquisar({
      entidade: 'Category',
      criterio: {
        userId: usuarioState.idUsuario
      },
      campoOrder: ['name'],
    })

    setCategorys(rsCategorys)

    const rsCompanys = await clsCrud.pesquisar({
      entidade: 'Company',
      criterio: {
        userId: usuarioState.idUsuario
      },
      campoOrder: ['name'],
    })

    setCompanys(rsCompanys)

    const rsAccounts = await clsCrud.pesquisar({
      entidade: 'Account',
      criterio: {
        userId: usuarioState.idUsuario
      },
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
      const sector = sectors.find((c) => c.id === t.sector.id)?.name || "Sem setor";
      const type = t.category?.type;
      const valor = formatCurrency(t.amount);
      return [date, t.description, sector, category, type, valor];
    });

    autoTable(doc, {
      startY: 60,
      head: [["Data", "Descrição", "Setor", "Categoria", "Tipo", "Valor"]],
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

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);
  };

  const handleExportCSV = () => {
    const headers = ["Data", "Descrição", "Empresa", "Categoria", "Tipo", "Valor", "Conta"];

    const rows = rsPesquisa.map((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR");
      const description = (t.description || "").replace(/"/g, '""');
      const company = (companys.find((c) => c.id === t.company?.id)?.name || "Sem empresa").replace(/"/g, '""');
      const category = (categorys.find((c) => c.id === t.category?.id)?.name || "Sem categoria").replace(/"/g, '""');
      const type = t.category?.type === "Receita" ? "Receita" : "Despesa";
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
      const type = t.category?.type === "Receita" ? "Receita" : "Despesa";
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