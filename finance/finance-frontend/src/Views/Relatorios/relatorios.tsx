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
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import CustomButton from '../../Componentes/Button';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import ButtonMenu from '../../Componentes/ButtonMenu';
import InfoCard from '../../Componentes/InfoCard';
import FinancialChart from '../Dashboard/FinancialChart';
import CustomTabs from '../../Componentes/TabCustom';

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
  const [activeTab, setActiveTab] = useState("overview")

  const OverviewComponent = ({ user }: { user: string }) => <div>Olá, {user}!</div>;
  const ReceitaComponent = ({ data }: { data: any[] }) => <div>Receitas: {data.length}</div>;
  const DespesaComponent = ({ total }: { total: number }) => <div>Total gasto: R$ {total}</div>;
  const CategoriaComponent = ({ categorias }: { categorias: string[] }) => <div>Categorias: {categorias.join(', ')}</div>;
  const TransacaoComponent = ({ lista }: { lista: any[] }) => <div>Transações: {lista.length}</div>;

  const tabComponents: Record<string, () => React.ReactNode> = {
    overview: () => <OverviewComponent user="Frank Alves" />,
    receita: () => <ReceitaComponent data={dataPoints} />,
    despesa: () => <DespesaComponent total={1234.56} />,
    categoria: () => <CategoriaComponent categorias={['Alimentação', 'Transporte']} />,
    transacao: () => <TransacaoComponent lista={rsPesquisa} />,
  };

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
      })
      return
    }

    const contentToPrint = printRef.current

    if (!contentToPrint) {
      printWindow.close()
      return
    }

    const currentDate = new Date().toLocaleDateString("pt-BR")

    printWindow.document.write(`
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
        <body>
          <div class="header">
            <h1>Relatório Financeiro</h1>
            <p>Gerado em ${currentDate}</p>
          </div>
          
          <div class="account-info">
            <h2>Conta: ${rsPesquisa[0].account.name}</h2>
            <p>Saldo Inicial: ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      //currency: selectedAccount.currency,
    }).format(rsPesquisa[0].account.initialBalance)}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <h3>Saldo</h3>
              <p class="balance">${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      //currency: selectedAccount.currency,
    }).format(dadosCard.saldo)}</p>
            </div>
            <div class="summary-item">
              <h3>Receitas</h3>
              <p class="income">${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      //currency: selectedAccount.currency,
    }).format(dadosCard.receitas)}</p>
            </div>
            <div class="summary-item">
              <h3>Despesas</h3>
              <p class="expense">${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      //currency: selectedAccount.currency,
    }).format(dadosCard.despesas)}</p>
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
              ${rsPesquisa
        .map((t) => {
          const date = new Date(t.date).toLocaleDateString("pt-BR")
          const category = categorys.find((c) => c.id === t.category.id)?.name || "Sem categoria"
          const type = t.type === "Receita" ? "Receita" : "Despesa"
          const amount = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            //currency: selectedAccount.currency,
          }).format(t.amount)
          const amountClass = t.type === "Receita" ? "Receita" : "Despesa"

          return `
                    <tr>
                      <td>${date}</td>
                      <td>${t.description}</td>
                      <td>${category}</td>
                      <td>${type}</td>
                      <td class="${amountClass}">${amount}</td>
                    </tr>
                  `
        })
        .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>FinanceControl - Sistema de Gestão Financeira</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for resources to load then print
    setTimeout(() => {
      printWindow.print()
      // Close the window after printing (optional)
      // printWindow.close()
    }, 500)
  }

  // Handle export to CSV
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add headers
    csvContent += "Data,Descrição,Empresa,Categoria,Tipo,Valor\n"

    // Add data rows
    rsPesquisa.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR")
      const description = t.description.replace(/,/g, ";") // Replace commas to avoid CSV issues
      const company = companys.find((c) => c.id === t.company.id)?.name || "Sem empresa"
      const category = categorys.find((c) => c.id === t.category.id)?.name || "Sem categoria"
      const type = t.type === "Receita" ? "Receita" : "Despesa"
      const amount = t.amount.toString().replace(".", ",") // Use comma as decimal separator for Excel

      csvContent += `${date},"${description}","${company}","${category}",${type},${amount}\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `relatorio-financeiro-${rsPesquisa[0].account.name}-${new Date().toISOString().split("T")[0]}.csv`,
    )
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    // toast({
    //   title: "Exportação concluída",
    //   description: "O relatório foi exportado com sucesso no formato CSV.",
    // })
  }

  // Handle export to Excel
  const handleExportExcel = () => {
    // This is a simplified Excel export that uses CSV with specific formatting
    // For a more robust Excel export, you would use a library like xlsx

    // Create CSV content with Excel formatting
    let csvContent = "data:application/vnd.ms-excel;charset=utf-8,"

    // Add headers with Excel formatting
    csvContent +=
      "<table><tr><th>Data</th><th>Descrição</th><th>Empresa</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Conta</th></tr>"

    // Add data rows
    rsPesquisa.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR")
      const description = t.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      const company = (companys.find((c) => c.id === t.company.id)?.name || "Sem empresa")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      const category = (categorys.find((c) => c.id === t.category.id)?.name || "Sem categoria")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      const type = t.type === "Receita" ? "Receita" : "Despesa"
      const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        //currency: selectedAccount.currency,
      }).format(t.amount)
      const account = accounts.find((acc) => acc.id === t.account.id)?.name || "Conta Desconhecida"

      csvContent += `<tr><td>${date}</td><td>${description}</td><td>${company}</td><td>${category}</td><td>${type}</td><td>${amount}</td><td>${account}</td></tr>`
    })

    csvContent += "</table>"

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `relatorio-financeiro-${rsPesquisa[0].account.name}-${new Date().toISOString().split("T")[0]}.xls`,
    )
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    // toast({
    //   title: "Exportação concluída",
    //   description: "O relatório foi exportado com sucesso no formato Excel.",
    // })
  }


  // Handle export to PDF
  const handleExportPDF = () => {
    // toast({
    //   title: "Exportação para PDF",
    //   description: "Para exportar como PDF, utilize a função de impressão e selecione 'Salvar como PDF'.",
    // })

    // Trigger the print function which can be saved as PDF
    handlePrint()
  }
  return (
    <>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ m: 2, textAlign: 'left' }}>Relatórios</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomButton
              onClick={handlePrint}
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
                { label: 'Exportar como PDF', icon: <ArchiveTwoToneIcon />, onClick: handleExportPDF },
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
            titleOverview='Visão Geral'
            dataOverview={dataPoints}
          />
        </Grid>
      </Grid>
    </>
  )
}