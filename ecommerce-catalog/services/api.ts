import axios from "axios"
import type { Product, Cliente, Pedido, Vendedor, Categoria } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Dados mockados de produtos (escopo global para uso em productService)
const produtos: Product[] = [
  {
    id: "1",
    nome: "Cimento Portland CP II-E-32",
    descricao: "Saco de cimento Portland 50kg, ideal para obras em geral",
    preco: "R$ 28,90",
    idCategoria: "1",
    idVendedor: "1",
    imagem: "/saco-de-cimento-portland.jpg",
    desconto: "15%",
    promocao: true,
    maisVendido: true,
    ativo: true,
    caracteristicas: "Alta resistência\nSecagem rápida",
  },
  {
    id: "2",
    nome: "Tijolo Cerâmico 6 Furos",
    descricao: "Tijolo cerâmico 6 furos 9x14x19cm, alta resistência",
    preco: "R$ 0,85",
    idCategoria: "2",
    idVendedor: "1",
    imagem: "/tijolo-ceramico-6-furos.jpg",
    desconto: "10%",
    promocao: false,
    maisVendido: true,
    ativo: true,
    caracteristicas: "Baixa absorção\nFácil assentamento",
  },
  {
    id: "3",
    nome: "Areia Média Lavada",
    descricao: "Areia média lavada para construção, m³",
    preco: "R$ 145,00",
    idCategoria: "3",
    idVendedor: "1",
    imagem: "/areia-media-construcao.jpg",
    desconto: "5%",
    promocao: true,
    maisVendido: false,
    ativo: true,
    caracteristicas: "Granulometria controlada\nIdeal para concreto",
  },
  {
    id: "4",
    nome: "Brita 1 (19mm)",
    descricao: "Brita 1 graduação 19mm para concreto, m³",
    preco: "R$ 152,00",
    idCategoria: "3",
    idVendedor: "1",
    imagem: "/brita-pedra-construcao.jpg",
    desconto: "8%",
    promocao: false,
    maisVendido: false,
    ativo: true,
    caracteristicas: "Alta resistência\nBaixa umidade",
  },
  {
    id: "5",
    nome: "Ferro 10mm CA-50",
    descricao: "Barra de ferro 10mm CA-50 com 12 metros",
    preco: "R$ 42,50",
    idCategoria: "4",
    idVendedor: "1",
    imagem: "/barra-ferro-aco-construcao.jpg",
    desconto: "0%",
    promocao: false,
    maisVendido: true,
    ativo: true,
    caracteristicas: "Alta ductilidade\nNorma NBR7480",
  },
  {
    id: "6",
    nome: "Telha Cerâmica Portuguesa",
    descricao: "Telha cerâmica portuguesa natural, peça",
    preco: "R$ 2,80",
    idCategoria: "5",
    idVendedor: "1",
    imagem: "/telha-ceramica-portuguesa.jpg",
    desconto: "12%",
    promocao: true,
    maisVendido: false,
    ativo: true,
    caracteristicas: "Resistente à água\nFácil instalação",
  },
  {
    id: "7",
    nome: "Bloco de Concreto 14x19x39",
    descricao: "Bloco de concreto estrutural 14x19x39cm",
    preco: "R$ 4,20",
    idCategoria: "2",
    idVendedor: "1",
    imagem: "/bloco-concreto-estrutural.jpg",
    desconto: "5%",
    promocao: false,
    maisVendido: false,
    ativo: true,
    caracteristicas: "Alta resistência\nDimensões precisas",
  },
  {
    id: "8",
    nome: "Cal Hidratada CH-I",
    descricao: "Cal hidratada CH-I saco 20kg para argamassa",
    preco: "R$ 18,90",
    idCategoria: "1",
    idVendedor: "1",
    imagem: "/saco-cal-hidratada.jpg",
    desconto: "0%",
    promocao: true,
    maisVendido: false,
    ativo: true,
    caracteristicas: "Pureza elevada\nFácil mistura",
  },
]

export const productService = {
  getAll: async (idVendedor?: string): Promise<Product[]> => {
    if (idVendedor) {
      return produtos.filter((p) => p.idVendedor === idVendedor && p.ativo)
    }
    return produtos.filter((p) => p.ativo)
  },

  getById: async (id: string): Promise<Product | undefined> => {
    return produtos.find((p) => p.id === id)
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const novoProduto: Product = {
      id: Date.now().toString(),
      ...product,
      ativo: true,
    }
    produtos.push(novoProduto)
    return novoProduto
  },

  update: async (id: string, product: Partial<Product>): Promise<Product | undefined> => {
    const idx = produtos.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    produtos[idx] = { ...produtos[idx], ...product }
    return produtos[idx]
  },

  delete: async (id: string): Promise<void> => {
    const idx = produtos.findIndex((p) => p.id === id)
    if (idx !== -1) produtos.splice(idx, 1)
  },
}

// Clientes
export const clienteService = {
  create: async (cliente: Omit<Cliente, "id" | "dataCadastro">): Promise<Cliente> => {
    // Mock para desenvolvimento
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      ...cliente,
      dataCadastro: new Date().toISOString(),
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    return novoCliente
  },

  getAll: async (idVendedor: string): Promise<Cliente[]> => {
    // Mock data para desenvolvimento - filtrado por vendedor
    return [
      {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 99999-9999",
        idVendedor,
        dataCadastro: new Date("2024-01-15").toISOString(),
        ativo: true,
      },
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        telefone: "(11) 88888-8888",
        idVendedor,
        dataCadastro: new Date("2024-02-20").toISOString(),
        ativo: true,
      },
    ]
  },

  getById: async (id: string): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  login: async (nome: string, email: string): Promise<{ cliente: Cliente; token: string }> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cliente: Cliente = {
      id: "1",
      nome,
      email,
      telefone: "(11) 99999-9999",
      idVendedor: "1",
      dataCadastro: new Date("2024-01-15").toISOString(),
      ativo: true,
    }

    return {
      cliente,
      token: "mock-client-token-" + Date.now(),
    }
  },
}

// Pedidos
export const pedidoService = {
  create: async (pedido: {
    idCliente: string
    idVendedor: string
    itens: { idProduto: string; quantidade: number; subtotal: number }[]
    total: number
    observacoes?: string
  }): Promise<Pedido> => {
    // Mock para desenvolvimento
    const formatBRL = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    const novoPedido: Pedido = {
      id: Date.now().toString(),
      idCliente: pedido.idCliente,
      idVendedor: pedido.idVendedor,
      data: new Date().toISOString(),
      total: formatBRL(pedido.total),
      status: "pendente",
      observacoes: pedido.observacoes,
      itens: pedido.itens.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        idPedido: Date.now().toString(),
        idProduto: item.idProduto,
        quantidade: item.quantidade,
        subtotal: formatBRL(item.subtotal),
      })),
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log("[v0] Notificação WhatsApp enviada para o vendedor sobre novo pedido:", novoPedido.id)

    return novoPedido
  },

  getAll: async (idVendedor: string): Promise<Pedido[]> => {
    // Mock data para desenvolvimento - retorna todos os pedidos mockados de getByCliente para o vendedor
    const pedidos: Pedido[] = [
      {
        id: "1",
        idCliente: "1",
        idVendedor,
        data: new Date("2024-03-15").toISOString(),
        total: "R$ 1.250,50",
        status: "entregue",
      },
      {
        id: "2",
        idCliente: "1",
        idVendedor,
        data: new Date("2024-03-20").toISOString(),
        total: "R$ 850,00",
        status: "em_separacao",
      },
      {
        id: "3",
        idCliente: "2",
        idVendedor,
        data: new Date("2024-03-25").toISOString(),
        total: "R$ 320,50",
        status: "pendente",
      },
      {
        id: "4",
        idCliente: "2",
        idVendedor,
        data: new Date("2024-04-01").toISOString(),
        total: "R$ 500,00",
        status: "cancelado",
      },
      {
        id: "5",
        idCliente: "1",
        idVendedor,
        data: new Date("2024-04-10").toISOString(),
        total: "R$ 1.200,00",
        status: "aprovado",
      },
      {
        id: "6",
        idCliente: "2",
        idVendedor,
        data: new Date("2024-04-15").toISOString(),
        total: "R$ 900,00",
        status: "em_analise",
      },
      {
        id: "7",
        idCliente: "1",
        idVendedor,
        data: new Date("2024-04-20").toISOString(),
        total: "R$ 2.100,00",
        status: "enviado",
      },
    ]
    return pedidos
  },

  getByCliente: async (idCliente: string): Promise<Pedido[]> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))

    const produtos = await productService.getAll()

    return [
      // Pedido entregue
      {
        id: "1",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-03-15").toISOString(),
        total: "R$ 1.250,50",
        status: "entregue",
        itens: [
          { id: "1-1", idPedido: "1", idProduto: "1", quantidade: 20, subtotal: "R$ 578,00", produto: produtos[0] },
          { id: "1-2", idPedido: "1", idProduto: "2", quantidade: 500, subtotal: "R$ 425,00", produto: produtos[1] },
          { id: "1-3", idPedido: "1", idProduto: "6", quantidade: 100, subtotal: "R$ 247,50", produto: produtos[5] },
        ],
      },
      // Pedido em separação
      {
        id: "2",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-03-20").toISOString(),
        total: "R$ 850,00",
        status: "em_separacao",
        itens: [
          { id: "2-1", idPedido: "2", idProduto: "3", quantidade: 10, subtotal: "R$ 450,00", produto: produtos[2] },
          { id: "2-2", idPedido: "2", idProduto: "5", quantidade: 10, subtotal: "R$ 425,00", produto: produtos[4] },
        ],
      },
      // Pedido pendente
      {
        id: "3",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-03-25").toISOString(),
        total: "R$ 320,50",
        status: "pendente",
        itens: [
          { id: "3-1", idPedido: "3", idProduto: "7", quantidade: 50, subtotal: "R$ 199,50", produto: produtos[6] },
          { id: "3-2", idPedido: "3", idProduto: "8", quantidade: 15, subtotal: "R$ 133,50", produto: produtos[7] },
        ],
      },
      // Pedido cancelado
      {
        id: "4",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-04-01").toISOString(),
        total: "R$ 500,00",
        status: "cancelado",
        itens: [
          { id: "4-1", idPedido: "4", idProduto: "4", quantidade: 5, subtotal: "R$ 260,00", produto: produtos[3] },
          { id: "4-2", idPedido: "4", idProduto: "1", quantidade: 8, subtotal: "R$ 230,00", produto: produtos[0] },
        ],
      },
      // Pedido aprovado
      {
        id: "5",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-04-10").toISOString(),
        total: "R$ 1.200,00",
        status: "aprovado",
        itens: [
          { id: "5-1", idPedido: "5", idProduto: "5", quantidade: 20, subtotal: "R$ 850,00", produto: produtos[4] },
          { id: "5-2", idPedido: "5", idProduto: "2", quantidade: 400, subtotal: "R$ 350,00", produto: produtos[1] },
        ],
      },
      // Pedido em análise
      {
        id: "6",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-04-15").toISOString(),
        total: "R$ 900,00",
        status: "em_analise",
        itens: [
          { id: "6-1", idPedido: "6", idProduto: "8", quantidade: 30, subtotal: "R$ 267,00", produto: produtos[7] },
          { id: "6-2", idPedido: "6", idProduto: "3", quantidade: 14, subtotal: "R$ 633,00", produto: produtos[2] },
        ],
      },
      // Pedido enviado
      {
        id: "7",
        idCliente,
        idVendedor: "1",
        data: new Date("2024-04-20").toISOString(),
        total: "R$ 2.100,00",
        status: "enviado",
        itens: [
          { id: "7-1", idPedido: "7", idProduto: "6", quantidade: 100, subtotal: "R$ 280,00", produto: produtos[5] },
          { id: "7-2", idPedido: "7", idProduto: "7", quantidade: 200, subtotal: "R$ 1.820,00", produto: produtos[6] },
        ],
      },
    ]
  },

  getById: async (id: string): Promise<Pedido> => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },

  updateStatus: async (id: string, status: Pedido["status"]): Promise<Pedido> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))
    const pedido = await pedidoService.getById(id)
    return { ...pedido, status }
  },
}

// Vendedores
export const vendedorService = {
  register: async (vendedor: Omit<Vendedor, "id" | "dataCadastro">): Promise<{ vendedor: Vendedor; token: string }> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 800))

    const novoVendedor: Vendedor = {
      id: Date.now().toString(),
      ...vendedor,
      dataCadastro: new Date().toISOString(),
    }

    return {
      vendedor: novoVendedor,
      token: "mock-jwt-token-" + Date.now(),
    }
  },

  login: async (email: string, senha: string): Promise<{ vendedor: Vendedor; token: string }> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 800))

    const vendedor: Vendedor = {
      id: "1",
      nome: "Vendedor Principal",
      cnpj: "12.345.678/0001-90",
      whatsapp: "(11) 99999-9999",
      email,
      senha: "",
      dataCadastro: new Date("2024-01-01").toISOString(),
    }

    return {
      vendedor,
      token: "mock-jwt-token-" + Date.now(),
    }
  },

  getProfile: async (): Promise<Vendedor> => {
    return {
      id: "1",
      nome: "Vendedor Principal",
      cnpj: "12.345.678/0001-90",
      whatsapp: "(11) 99999-9999",
      email: "vendedor@loja.com",
      senha: "",
      dataCadastro: new Date("2024-01-01").toISOString(),
    }
  },

  updateProfile: async (dados: Partial<Omit<Vendedor, "id" | "dataCadastro">>): Promise<Vendedor> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Retorna os dados "atualizados" (mock)
    return {
      id: "1",
      nome: dados.nome || "Vendedor Principal",
      cnpj: dados.cnpj || "12.345.678/0001-90",
      whatsapp: dados.whatsapp || "(11) 99999-9999",
      email: dados.email || "vendedor@loja.com",
      senha: "",
      dataCadastro: new Date("2024-01-01").toISOString(),
    }
  },
}

// Categorias
export const categoriaService = {
  getAll: async (idVendedor: string): Promise<Categoria[]> => {
    // Mock data para desenvolvimento
    return [
      {
        id: "1",
        nome: "Cimento e Argamassa",
        descricao: "Produtos para preparação de massas e concreto",
        idVendedor,
        ativo: true,
        dataCriacao: new Date("2024-01-01").toISOString(),
      },
      {
        id: "2",
        nome: "Tijolos e Blocos",
        descricao: "Materiais para alvenaria",
        idVendedor,
        ativo: true,
        dataCriacao: new Date("2024-01-01").toISOString(),
      },
      {
        id: "3",
        nome: "Areia e Brita",
        descricao: "Agregados para construção",
        idVendedor,
        ativo: true,
        dataCriacao: new Date("2024-01-01").toISOString(),
      },
      {
        id: "4",
        nome: "Ferro e Aço",
        descricao: "Materiais para estrutura",
        idVendedor,
        ativo: true,
        dataCriacao: new Date("2024-01-01").toISOString(),
      },
      {
        id: "5",
        nome: "Telhas e Coberturas",
        descricao: "Materiais para telhado",
        idVendedor,
        ativo: true,
        dataCriacao: new Date("2024-01-01").toISOString(),
      },
    ]
  },

  getById: async (id: string, idVendedor: string = "1"): Promise<Categoria | undefined> => {
    // Busca no mock de categorias
    const categorias = await categoriaService.getAll(idVendedor)
    return categorias.find((cat) => cat.id === id)
  },

  create: async (categoria: Omit<Categoria, "id" | "dataCriacao">): Promise<Categoria> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))

    const novaCategoria: Categoria = {
      id: Date.now().toString(),
      ...categoria,
      dataCriacao: new Date().toISOString(),
    }

    return novaCategoria
  },

  update: async (id: string, categoria: Partial<Categoria>): Promise<Categoria> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))

    const categoriaAtualizada: Categoria = {
      id,
      nome: categoria.nome || "",
      descricao: categoria.descricao,
      idVendedor: categoria.idVendedor || "",
      ativo: categoria.ativo ?? true,
      dataCriacao: new Date().toISOString(),
    }

    return categoriaAtualizada
  },

  delete: async (id: string): Promise<void> => {
    // Mock para desenvolvimento
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}

export default api
