import axios from "axios"
import type { Product, Cliente, Pedido, Usuario, Category, Representante } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Produtos
export const productService = {
  getAll: async (): Promise<Product[]> => {
    // Mock data para desenvolvimento - Material de Construção Civil
    return [
      {
        id: "1",
        nome: "Cimento Portland CP II-E-32",
        descricao: "Saco de cimento Portland 50kg, ideal para obras em geral",
        caracteristicas: "Garantia de 6 meses\nEntrega rápida em Divinópolis\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "28.9",
        idCategoria: "1",
        imagem: "/saco-de-cimento-portland.jpg",
        desconto: 15,
        promocao: true,
        idRep: "1",
        ativo: true,
      },
      {
        id: "2",
        nome: "Tijolo Cerâmico 6 Furos",
        descricao: "Tijolo cerâmico 6 furos 9x14x19cm, alta resistência",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "0.85",
        idCategoria: "4",
        imagem: "/tijolo-ceramico-6-furos.jpg",
        desconto: 10,
        idRep: "1",
        ativo: true,
      },
      {
        id: "3",
        nome: "Areia Média Lavada",
        descricao: "Areia média lavada para construção, m³",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "45",
        idCategoria: "2",
        imagem: "/areia-media-construcao.jpg",
        promocao: true,
        idRep: "1",
        ativo: true,
      },
      {
        id: "4",
        nome: "Brita 1 (19mm)",
        descricao: "Brita 1 graduação 19mm para concreto, m³",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "52",
        idCategoria: "2",
        imagem: "/brita-pedra-construcao.jpg",
        desconto: 8,
        idRep: "1",
        ativo: true,
      },
      {
        id: "5",
        nome: "Ferro 10mm CA-50",
        descricao: "Barra de ferro 10mm CA-50 com 12 metros",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "42.5",
        idCategoria: "3",
        imagem: "/barra-ferro-aco-construcao.jpg",
        idRep: "1",
        ativo: true,
      },
      {
        id: "6",
        nome: "Telha Cerâmica Portuguesa",
        descricao: "Telha cerâmica portuguesa natural, peça",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "2.8",
        idCategoria: "5",
        imagem: "/telha-ceramica-portuguesa.jpg",
        desconto: 12,
        promocao: true,
        idRep: "1",
        ativo: true,
      },
      {
        id: "7",
        nome: "Bloco de Concreto 14x19x39",
        descricao: "Bloco de concreto estrutural 14x19x39cm",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "4.2",
        idCategoria: "4",
        imagem: "/bloco-concreto-estrutural.jpg",
        desconto: 5,
        idRep: "2",
        ativo: true,
      },
      {
        id: "8",
        nome: "Cal Hidratada CH-I",
        descricao: "Cal hidratada CH-I saco 20kg para argamassa",
        caracteristicas: "Garantia de 12 meses\nEntrega rápida em todo o Brasil\nProduto original e lacrado\nSuporte técnico especializado",
        preco: "8.9",
        idCategoria: "1",
        imagem: "/saco-cal-hidratada.jpg",
        promocao: true,
        idRep: "1",
        ativo: false,
      },
    ]
    // const response = await api.get('/produtos');
    // return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/produtos/${id}`)
    return response.data
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post("/produtos", product)
    return response.data
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/produtos/${id}`, product)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/produtos/${id}`)
  },
}

// Categorias
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    // Mock data para desenvolvimento - Categorias
    return [
      {
        id: "all",
        name: "Todas as Categorias",
      },
      {
        id: "1",
        name: "Cimento e Argamassa",
      },
      {
        id: "2",
        name: "Areia e Brita",
      },
      {
        id: "3",
        name: "Ferro e Aço",
      },
      {
        id: "4",
        name: "Tijolos e Blocos",
      },
      {
        id: "5",
        name: "Telhas e Coberturas",
      },

    ]
    // const response = await api.get('/produtos');
    // return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categorias/${id}`)
    return response.data
  },

  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await api.post("/categorias", category)
    return response.data
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categorias/${id}`, category)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categorias/${id}`)
  },
}

// Clientes
export const clienteService = {
  create: async (cliente: Omit<Cliente, "id">): Promise<Cliente> => {
    // Mock para desenvolvimento - simula criação de cliente
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      ...cliente,
      //dataCadastro: new Date(),
    }

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    return novoCliente
  },

  getAll: async (): Promise<Cliente[]> => {
    // Mock data para desenvolvimento
    return [
      {
        id: "1",
        nome: "João Silva",
        email: "joao@email.com",
        idRep: "1",
        ativo: true,
        whatsapp: "(37) 99932-8661",
        cnpj: "12.345.678/0001-90",
        dataCadastro: "2024-01-15",
      },
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        idRep: "1",
        ativo: true,
        whatsapp: "(11) 88888-8888",
        dataCadastro: "2024-02-20",
        cnpj: "12.345.678/0002-90",
      },
    ]
  },

  getById: async (id: string): Promise<Cliente> => {
    const clientes = await clienteService.getAll()
    const cliente = clientes.find((c) => c.id === id)
    if (!cliente) throw new Error("Cliente não encontrado")
    return cliente
  },
}

// Representantes (vendedores)
export const representanteService = {
  create: async (repsentante: Omit<Representante, "id">): Promise<Representante> => {
    // Mock para desenvolvimento - simula criação de cliente
    const novoRepresentante: Representante = {
      id: Date.now().toString(),
      ...repsentante,
      //dataCadastro: new Date(),
    }

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    return novoRepresentante
  },

  getAll: async (): Promise<Representante[]> => {
    // Mock data para desenvolvimento
    return [
      {
        id: "1", // mesmo id do usuário
        nome: "João Silva",
        email: "joao@email.com",
        whatsapp: "(11) 99999-9999",
        cnpj: "12.345.678/0001-90",
        //dataCadastro: new Date("2024-01-15"),
      },
      {
        id: "2",
        nome: "Maria Santos",
        email: "maria@email.com",
        whatsapp: "(11) 88888-8888",
        cnpj: "12.345.678/0002-90",
        //dataCadastro: new Date("2024-02-20"),
      },
    ]
  },

  getById: async (id: string): Promise<Representante> => {
    const representantes = await representanteService.getAll()
    const representante = representantes.find((r) => r.id === id)
    if (!representante) throw new Error("Representante não encontrado")
    return representante
  },
}

// Pedidos
export const pedidoService = {
  create: async (pedido: {
    idCliente: string
    idRep: string
    itens: { idProduto: string; quantidade: number; subtotal: number }[]
    total: number
  }): Promise<Pedido> => {
    const response = await api.post("/pedidos", pedido)
    return response.data
  },

  getAll: async (): Promise<Pedido[]> => {
    const response = await api.get("/pedidos")
    return response.data
  },

  getByCliente: async (idCliente: string): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/cliente/${idCliente}`)
    return response.data
  },

  getById: async (id: string): Promise<Pedido> => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },
}

// Usuários (Vendedores)
export const usuarioService = {

  create: async (usuario: {
    id: string
    nome: string
    email: string
    whatsapp: string
    senha: string
    cnpj: string
    perfil: "cliente" | "vendedor"
  }): Promise<Usuario> => {
    const response = await api.post("/usuarios", usuario)
    return response.data
  },

  login: async (email: string, senha?: string): Promise<{ user: Usuario; token: string }> => {
    // Mock para desenvolvimento - simula login de vendedor
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simula validação básica
    // if(!email || !senha) throw new Error("Credenciais inválidas")

    if (senha) {
      const representantes = await representanteService.getAll()
      console.log("representantes", representantes, email, senha)
      const representante = representantes.find((r) => r.email === email && senha === "123456")
      if (!representante) throw new Error("Credenciais inválidas")

      const user: Usuario = {
        id: representante.id,
        nome: representante.nome,
        email: representante.email,
        senha: senha,
        cnpj: representante.cnpj,
        whatsapp: representante.whatsapp,
        perfil: "vendedor",
        //dataCadastro: new Date("2024-01-01"),
      }

      return {
        user,
        token: "mock-jwt-token-" + Date.now(),
      }
    } else {
      const clientes = await clienteService.getAll()
      const cliente = clientes.find((c) => c.email === email)
      if (!cliente) throw new Error("Credenciais inválidas")

      const user: Usuario = {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        senha: "",
        cnpj: "",
        whatsapp: "",
        perfil: "cliente",
        //dataCadastro: new Date("2024-01-01"),
      }

      return {
        user,
        token: "mock-jwt-token-" + Date.now(),
      }
    }
  },


  getProfile: async (): Promise<Usuario> => {
    // Mock para desenvolvimento
    return {
      id: "1",
      nome: "Vendedor Principal",
      email: "vendedor@loja.com",
      perfil: "vendedor",
      senha: "123456",
      cnpj: "12345678901234",
      whatsapp: "(11) 99999-9999",
      //dataCadastro: new Date("2024-01-01"),
    }
  },
}

export default api
