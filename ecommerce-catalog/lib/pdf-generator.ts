"use client"
import { categoriaService } from '@/services/api'
import type { Product, Cliente, Pedido, Vendedor, Categoria } from "./types"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

// Utilitário para carregar imagem (base64 ou URL)
const loadImage = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

// Função auxiliar para rodapé
const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount} - Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
      105,
      285,
      { align: "center" }
    )
  }
}

// export const generateCatalogoPDF = async (produtos: Product[], vendedor: Vendedor) => {
//   const doc = new jsPDF()

//   // Cabeçalho
//   doc.setFontSize(20)
//   doc.text("Catálogo de Produtos", 105, 20, { align: "center" })
//   doc.setFontSize(12)
//   doc.text(vendedor.nome, 105, 30, { align: "center" })
//   doc.setFontSize(10)
//   doc.text(`CNPJ: ${vendedor.cnpj}`, 105, 36, { align: "center" })
//   doc.text(`WhatsApp: ${vendedor.whatsapp}`, 105, 42, { align: "center" })

//   // Linha separadora
//   doc.setLineWidth(0.5)
//   doc.line(20, 48, 190, 48)

//   // Tabela de produtos
//   const tableData = produtos.map((produto) => [
//     produto.nome,
//     categorias.find((c) => c.id === produto.idCategoria)?.nome || "Sem categoria",
//     produto.preco,
//     produto.desconto || "-",
//     produto.promocao ? "Sim" : "Não",
//   ])

//   autoTable(doc, {
//     startY: 55,
//     head: [["Produto", "Categoria", "Preço", "Desconto", "Promoção"]],
//     body: tableData,
//     theme: "grid",
//     headStyles: {
//       fillColor: [59, 130, 246],
//       textColor: 255,
//       fontStyle: "bold",
//     },
//     styles: { fontSize: 9, cellPadding: 3 },
//     columnStyles: {
//       0: { cellWidth: 60 },
//       1: { cellWidth: 45 },
//       2: { cellWidth: 30 },
//       3: { cellWidth: 25 },
//       4: { cellWidth: 25 },
//     },
//   })

//   addFooter(doc)
//   doc.save(`catalogo-produtos-${Date.now()}.pdf`)
// }
export const generateCatalogoPDF = async (produtos: Product[], vendedor: Vendedor, categorias: Categoria[]) => {
  const doc = new jsPDF("p", "mm", "a4")

  // Ordena produtos em ordem alfabética pelo nome
  const produtosOrdenados = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome))

  // Função síncrona para buscar nome da categoria de uma lista já carregada
  // Função síncrona para buscar nome da categoria de uma lista já carregada
  // Agora espera receber categorias como argumento
  const nomeCat = (id: string) => {
    const cat = categorias.find((c) => c.id === id)
    return cat?.nome || "N/A"
  }

  // Cabeçalho
  doc.setFontSize(20)
  doc.text("Catálogo de Produtos", 105, 15, { align: "center" })
  doc.setFontSize(12)
  doc.text(vendedor.nome, 105, 23, { align: "center" })
  doc.setFontSize(10)
  doc.text(`CNPJ: ${vendedor.cnpj}`, 105, 29, { align: "center" })
  doc.text(`WhatsApp: ${vendedor.whatsapp}`, 105, 35, { align: "center" })

  // Configurações da grade (3 colunas x 3 linhas)
  const cols = 3
  const rows = 3
  const cellWidth = 60
  const cellHeight = 80
  const marginX = 15
  const marginY = 45
  const padding = 5

  for (let i = 0; i < produtos.length; i++) {
    if (i > 0 && i % (cols * rows) === 0) {
      doc.addPage()
    }

    const pageIndex = Math.floor(i / (cols * rows))
    const posIndex = i % (cols * rows)
    const col = posIndex % cols
    const row = Math.floor(posIndex / cols)

    const x = marginX + col * cellWidth
    const y = marginY + row * cellHeight

    const produto = produtos[i]

    // Borda da célula
    doc.setDrawColor(200)
    doc.rect(x, y, cellWidth, cellHeight)

    // Imagem do produto (se tiver)
    if (produto.imagem) {
      try {
        const imgData = await loadImage(produto.imagem)
        doc.addImage(imgData, "JPEG", x + padding, y + padding, cellWidth - 2 * padding, 30)
      } catch {
        doc.setFontSize(8)
        doc.text("Imagem não disponível", x + cellWidth / 2, y + 20, { align: "center" })
      }
    }

    // Dados do produto
    let textY = y + 45
    doc.setFontSize(9)
    doc.text(produto.nome, x + padding, textY)
    textY += 5
    doc.text(`Categoria: ${nomeCat(produto.idCategoria || "")}`, x + padding, textY)
    textY += 5
    doc.text(`Preço: ${produto.preco}`, x + padding, textY)
    textY += 5
    doc.text(`Desconto: ${produto.desconto || "-"}`, x + padding, textY)
    textY += 5
    doc.text(`Promoção: ${produto.promocao ? "Sim" : "Não"}`, x + padding, textY)
  }

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount} - Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
      105,
      290,
      { align: "center" }
    )
  }

  doc.save(`catalogo-produtos-${Date.now()}.pdf`)
}

export const generateClientesPDF = async (clientes: Cliente[], vendedor: Vendedor) => {
  const doc = new jsPDF()

  // Cabeçalho
  doc.setFontSize(20)
  doc.text("Relatório de Clientes", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text(vendedor.nome, 105, 30, { align: "center" })
  doc.setFontSize(10)
  doc.text(`Total de Clientes: ${clientes.length}`, 105, 36, { align: "center" })

  // Linha separadora
  doc.setLineWidth(0.5)
  doc.line(20, 42, 190, 42)

  // Tabela de clientes
  const tableData = clientes.map((cliente) => [
    cliente.nome,
    cliente.email,
    cliente.telefone || "-",
    new Date(cliente.dataCadastro).toLocaleDateString("pt-BR"),
  ])

  autoTable(doc, {
    startY: 50,
    head: [["Nome", "Email", "Telefone", "Data Cadastro"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
    },
  })

  addFooter(doc)
  doc.save(`relatorio-clientes-${Date.now()}.pdf`)
}

export const generatePedidosPDF = async (pedidos: Pedido[], vendedor: Vendedor) => {
  const doc = new jsPDF()

  // Cabeçalho
  doc.setFontSize(20)
  doc.text("Relatório de Pedidos", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text(vendedor.nome, 105, 30, { align: "center" })

  // Soma dos valores
  const parseBRL = (valor: string | number) =>
    typeof valor === "string"
      ? Number(valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim())
      : Number(valor)

  const totalVendas = pedidos.reduce((sum, p) => sum + parseBRL(p.total || 0), 0)

  doc.setFontSize(10)
  doc.text(`Total de Pedidos: ${pedidos.length}`, 105, 36, { align: "center" })
  doc.text(
    `Valor Total: ${totalVendas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
    105,
    42,
    { align: "center" }
  )

  // Linha separadora
  doc.setLineWidth(0.5)
  doc.line(20, 48, 190, 48)

  // Labels de status
  const statusLabels: Record<Pedido["status"], string> = {
    pendente: "Pendente",
    em_analise: "Em Análise",
    aprovado: "Aprovado",
    em_separacao: "Em Separação",
    enviado: "Enviado",
    entregue: "Entregue",
    cancelado: "Cancelado",
  }

  // Tabela de pedidos
  const tableData = pedidos.map((pedido) => [
    `#${pedido.id}`,
    pedido.cliente?.nome || "N/A",
    new Date(pedido.data).toLocaleDateString("pt-BR"),
    typeof pedido.total === "string" ? pedido.total : "R$ 0,00", "-",
    statusLabels[pedido.status],
  ])

  autoTable(doc, {
    startY: 55,
    head: [["Pedido", "Cliente", "Data", "Valor", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 40 },
    },
  })

  addFooter(doc)
  doc.save(`relatorio-pedidos-${Date.now()}.pdf`)
}
