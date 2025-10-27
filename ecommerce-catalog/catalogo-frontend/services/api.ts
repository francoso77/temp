import { CategoriaInterface } from '@/app/interfaces/categoria'
import { ClienteInterface } from '@/app/interfaces/cliente'
import { DetalhePedidoInterface, PedidoInterface } from '@/app/interfaces/pedido'
import { ProdutoInterface } from '@/app/interfaces/produto'
import { UserInterface } from '@/app/interfaces/sistema/user'
import ClsApi from '@/app/utils/ClsApi'
import ClsCrud from '@/app/utils/ClsCrudApi'
import { URL_BACKEND } from '@/app/utils/Servidor'
import axios from "axios"

export const api = axios.create({
  baseURL: URL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
})

export const produtoService = {

  getFull: async (): Promise<ProdutoInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const clsApi: ClsApi = new ClsApi()

    await clsApi.execute({
      url: "maisVendidos",
      method: "post",
    })

    const produtos = await clsCrud.pesquisar({
      entidade: "Produto",
      criterio: {
        ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (produtos && produtos.length > 0) {
      return produtos as ProdutoInterface[]
    }
    // Retorna array vazio se nenhum cliente encontrado
    return []
  },

  getAll: async (idVendedor?: string): Promise<ProdutoInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const clsApi: ClsApi = new ClsApi()

    await clsApi.execute({
      url: "maisVendidos",
      method: "post",
      idUsuario: idVendedor
    })

    const produtos = await clsCrud.pesquisar({
      entidade: "Produto",
      criterio: {
        idVendedor: idVendedor,
        //ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (produtos && produtos.length > 0) {
      return produtos as ProdutoInterface[]
    }
    // Retorna array vazio se nenhum cliente encontrado
    return []
  },

  getById: async (id: string): Promise<ProdutoInterface | undefined> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const produto = await clsCrud.pesquisar({
      entidade: "Produto",
      criterio: {
        id: id,
        ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (produto && produto.length > 0) {
      return produto[0] as ProdutoInterface
    }
    return undefined
  },

  create: async (produto: Partial<ProdutoInterface>, token: string): Promise<ProdutoInterface> => {

    let nomeArquivo = "";

    // 1️⃣ Se tiver imagem (arquivo), faz upload primeiro
    if (produto.imagem && typeof produto.imagem === "object" && "name" in produto.imagem) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", produto.imagem as File);

      const responseUpload = await fetch(`${URL_BACKEND}/upload-produto`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!responseUpload.ok) {
        throw new Error("Erro ao fazer upload da imagem do produto");
      }

      const dataUpload = await responseUpload.json();
      nomeArquivo = dataUpload.filename; // nome do arquivo salvo no servidor
    }
    // 2️⃣ Caso a imagem já seja uma string (ex: edição)
    else if (typeof produto.imagem === "string") {
      nomeArquivo = produto.imagem;
    }

    // 3️⃣ Monta o corpo final do produto a ser salvo
    const produtoData = {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      idCategoria: produto.idCategoria,
      idVendedor: produto.idVendedor,
      desconto: produto.desconto,
      promocao: produto.promocao,
      maisVendido: produto.maisVendido,
      ativo: produto.ativo,
      caracteristicas: produto.caracteristicas,
      imagem: nomeArquivo, // 👈 Nome do arquivo salvo no servidor
    };

    // 4️⃣ Faz o POST para salvar o produto no banco

    const clsCrud: ClsCrud = new ClsCrud()

    const novoProduto = await clsCrud.incluir({
      entidade: "Produto",
      criterio: produtoData,
      token,
    })

    if (!novoProduto) {
      return {} as ProdutoInterface
    } else {
      return novoProduto.dados as ProdutoInterface
    }

  },

  update: async (produto: Partial<ProdutoInterface>, token: string): Promise<ProdutoInterface> => {

    let nomeArquivo = "";

    // 1️⃣ Se tiver imagem (arquivo novo enviado)
    if (produto.imagem && typeof produto.imagem === "object" && "name" in produto.imagem) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", produto.imagem as File);

      const responseUpload = await fetch(`${URL_BACKEND}/upload-produto`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!responseUpload.ok) {
        throw new Error("Erro ao fazer upload da imagem do produto");
      }

      const dataUpload = await responseUpload.json();
      nomeArquivo = dataUpload.filename; // nome do arquivo salvo no servidor
    }
    // 2️⃣ Caso a imagem já seja uma string (edição sem troca de imagem)
    else if (typeof produto.imagem === "string") {
      nomeArquivo = produto.imagem;
    }

    // 3️⃣ Monta o corpo final do produto atualizado
    const produtoData = {
      id: produto.id, // 👈 necessário para identificar o registro a ser atualizado
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      idCategoria: produto.idCategoria,
      idVendedor: produto.idVendedor,
      desconto: produto.desconto,
      promocao: produto.promocao,
      maisVendido: produto.maisVendido,
      ativo: produto.ativo,
      caracteristicas: produto.caracteristicas,
      imagem: nomeArquivo,
    };

    // 4️⃣ Chama a mesma classe ClsCrud.incluir (ela fará o update se o ID existir)
    const clsCrud: ClsCrud = new ClsCrud();

    console.log("Dados enviados para atualização do produto:", produtoData);

    const produtoAtualizado = await clsCrud.incluir({
      entidade: "Produto",
      criterio: produtoData,
      token,
    });

    if (!produtoAtualizado) {
      return {} as ProdutoInterface;
    } else {
      return produtoAtualizado.dados as ProdutoInterface;
    }
  },

  delete: async (id: string, token: string): Promise<void> => {
    const clsCrud: ClsCrud = new ClsCrud()
    await clsCrud.excluir({
      entidade: "Produto",
      criterio: { id: id },
      token,
    })
  },
  // EM produtoService

  uploadImage: async (formData: FormData, token: string): Promise<{ url: string }> => {
    // Ajuste a URL para o endpoint de upload no seu backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/upload-imagem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Não adicione Content-Type para FormData, o browser faz isso corretamente
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Falha no upload da imagem')
    }

    return response.json() // Deve retornar { url: "..." }
  },

}

// Vendedor
export const vendedorService = {


  update: async (vendedor: Partial<UserInterface>, token: string): Promise<UserInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const vendedorAtualizado = await clsCrud.incluir({
      entidade: "User",
      criterio: vendedor,
      token,
    })
    if (!vendedorAtualizado) {
      return {} as UserInterface
    } else {
      return vendedorAtualizado.dados as UserInterface
    }
  },
  getById: async (id: string): Promise<UserInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const vendedor = await clsCrud.pesquisar({
      entidade: "User",
      criterio: { id: id },
    })
    if (vendedor && vendedor.length > 0) {
      return vendedor[0] as UserInterface
    }
    return {} as UserInterface
  },

  getProfile: async (): Promise<UserInterface> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const vendedor = await clsCrud.pesquisar({
      entidade: "User",
      criterio: { isActive: true },
    })
    if (vendedor && vendedor.length > 0) {
      return vendedor[0] as UserInterface
    }
    return {} as UserInterface
  },
}

// Clientes
export const clienteService = {
  create: async (cliente: Partial<ClienteInterface>, token: string): Promise<ClienteInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const novoCliente = await clsCrud.incluir({
      entidade: "Cliente",
      criterio: cliente,
      token,
    })
    if (!novoCliente) {
      return {} as ClienteInterface
    } else {
      return novoCliente.dados as ClienteInterface
    }
  },

  getAll: async (idVendedor: string): Promise<ClienteInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const clientes = await clsCrud.pesquisar({
      entidade: "Cliente",
      criterio: { idVendedor: idVendedor },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (clientes && clientes.length > 0) {
      return clientes as ClienteInterface[]
    }
    return []
  },

  getById: async (id: string): Promise<ClienteInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const cliente = await clsCrud.pesquisar({
      entidade: "Cliente",
      criterio: { id: id },
    })
    if (cliente && cliente.length > 0) {
      return cliente[0] as ClienteInterface
    }
    return {} as ClienteInterface
  },

  delete: async (id: string, token: string): Promise<void> => {
    const clsCrud: ClsCrud = new ClsCrud()
    await clsCrud.excluir({
      entidade: "Cliente",
      criterio: { id: id },
      token,
    })
  },
}

// Pedidos
export const pedidoService = {

  create: async (pedido: Partial<PedidoInterface>, token: string): Promise<PedidoInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const novoPedido = await clsCrud.incluir({
      entidade: "Pedido",
      criterio: pedido,
      token,
    })
    if (!novoPedido || !novoPedido.dados) {
      throw new Error("Falha ao criar pedido");
    }
    return novoPedido.dados as PedidoInterface;
  },

  getAll: async (idVendedor: string): Promise<PedidoInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const pedidos = await clsCrud.pesquisar({
      entidade: "Pedido",
      relations: ["itens", "cliente", "itens.produto"],
      criterio: { idVendedor: idVendedor },
      campoOrder: ["data"],
      tipoOrder: "DESC"
    })
    if (pedidos && pedidos.length > 0) {
      return pedidos as PedidoInterface[]
    }
    return []
  },

  getByCliente: async (idCliente: string): Promise<PedidoInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const pedidos = await clsCrud.pesquisar({
      entidade: "Pedido",
      relations: ["itens", "cliente", "itens.produto"],
      criterio: { idCliente: idCliente },
      campoOrder: ["data"],
      tipoOrder: "DESC"
    })
    if (pedidos && pedidos.length > 0) {
      return pedidos as PedidoInterface[]
    }
    return []
  },

  getById: async (id: string): Promise<PedidoInterface> => {
    // const response = await api.get(`/pedidos/${id}`)
    // return response.data

    const clsCrud: ClsCrud = new ClsCrud()
    const pedido = await clsCrud.pesquisar({
      entidade: "Pedido",
      relations: ["itens", "cliente", "itens.produto"],
      criterio: { id: id },
    })
    if (pedido && pedido.length > 0) {
      return pedido[0] as PedidoInterface
    }
    return {} as PedidoInterface
  },

  details: async (itens: Array<DetalhePedidoInterface>, token: string): Promise<DetalhePedidoInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const detalhes = await clsCrud.incluir({
      entidade: "DetalhePedido",
      criterio: itens,
      token,
    })
    if (!detalhes || !detalhes.dados) {
      throw new Error("Falha ao atualizar detalhes do pedido");
    }
    return detalhes.dados as DetalhePedidoInterface;
  },

}

// Categorias
export const categoriaService = {

  getFull: async (): Promise<CategoriaInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const categorias = await clsCrud.pesquisar({
      entidade: "Categoria",
      criterio: {
        ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (categorias && categorias.length > 0) {
      return categorias as CategoriaInterface[]
    }
    return []
  },
  getByIdFull: async (id: string): Promise<CategoriaInterface> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const categoria = await clsCrud.pesquisar({
      entidade: "Categoria",
      criterio: {
        id: id,
        ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (categoria.length > 0) {
      return categoria[0] as CategoriaInterface
    }
    return {} as CategoriaInterface
  },
  getAll: async (idVendedor: string): Promise<CategoriaInterface[]> => {
    const clsCrud: ClsCrud = new ClsCrud()
    const categorias = await clsCrud.pesquisar({
      entidade: "Categoria",
      criterio: {
        idVendedor: idVendedor,
        ativo: true
      },
      campoOrder: ["nome"],
      tipoOrder: "ASC"
    })
    if (categorias && categorias.length > 0) {
      return categorias as CategoriaInterface[]
    }
    return []
  },

  getById: async (id: string, idVendedor: string): Promise<CategoriaInterface | undefined> => {
    const categorias = await categoriaService.getAll(idVendedor)
    return categorias.find((cat) => cat.id === id)
  },

  create: async (categoria: Partial<CategoriaInterface>, token: string): Promise<CategoriaInterface> => {

    const clsCrud: ClsCrud = new ClsCrud()
    const novaCategoria = await clsCrud.incluir({
      entidade: "Categoria",
      criterio: categoria,
      token,
    })
    if (!novaCategoria) {
      return {} as CategoriaInterface
    } else {
      return novaCategoria.dados as CategoriaInterface
    }
  },

  delete: async (id: string, token: string): Promise<void> => {
    const clsCrud: ClsCrud = new ClsCrud()
    await clsCrud.excluir({
      entidade: "Categoria",
      criterio: { id: id },
      token,
    })
  },


}

export default api
