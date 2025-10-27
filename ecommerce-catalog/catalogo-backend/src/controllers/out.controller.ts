import { Body, Controller, Post } from "@nestjs/common"
import { AppDataSource } from "../data-source"
import { Between, In } from "typeorm"
import { ReceitaComparativoInterface, ReceitasInterface } from "../interfaces/dashboard"
import Pedido from "../entity/pedido"
import Cliente from "../entity/cliente"
import DetalhePedido from '../entity/detalhePedido'
import Produto from '../entity/produto'

@Controller()
export class OutController {

  @Post("dashboard")
  async dashboard(@Body("idUsuario") idUsuario: string): Promise<ReceitasInterface> {
    if (!idUsuario) throw new Error("Usuário inválido.")

    const idVendedor = idUsuario
    const pedidoRepository = AppDataSource.getRepository(Pedido)
    const clienteRepository = AppDataSource.getRepository(Cliente)

    const agora = new Date()
    const mesAtual = agora.getMonth() // 0–11
    const anoAtual = agora.getFullYear()

    const toMySQL = (date: Date): string => date.toISOString().slice(0, 19).replace("T", " ")

    // === Intervalos de mês atual e passado ===
    const inicioMesAtual = toMySQL(new Date(anoAtual, mesAtual, 1))
    const fimMesAtual = toMySQL(new Date(anoAtual, mesAtual + 1, 1))
    const inicioMesPassado = toMySQL(
      new Date(mesAtual === 0 ? anoAtual - 1 : anoAtual, mesAtual === 0 ? 11 : mesAtual - 1, 1)
    )
    const fimMesPassado = toMySQL(new Date(anoAtual, mesAtual, 1))

    // === Pedidos e clientes ===
    const pedidosAtual = await pedidoRepository.find({
      where: { status: 6, data: Between(inicioMesAtual, fimMesAtual), idVendedor }
    })
    const pedidosPassado = await pedidoRepository.find({
      where: { status: 6, data: Between(inicioMesPassado, fimMesPassado), idVendedor }
    })
    const clientesAtivosAtual = await clienteRepository.find({
      where: { ativo: true, dataCadastro: Between(inicioMesAtual, fimMesAtual), idVendedor }
    })
    const clientesAtivosPassado = await clienteRepository.find({
      where: { ativo: true, dataCadastro: Between(inicioMesPassado, fimMesPassado), idVendedor }
    })

    // === ÚLTIMOS 6 MESES ===
    const nomesMeses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ]
    const receitasUltimos6Meses: { month: string; pedidos: number; vendas: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const mes = mesAtual - i
      if (mes < 0) continue
      const inicioMes = toMySQL(new Date(anoAtual, mes, 1))
      const fimMes = toMySQL(new Date(anoAtual, mes + 1, 1))

      const pedidosMes = await pedidoRepository.find({
        where: { status: 6, data: Between(inicioMes, fimMes), idVendedor }
      })

      const vendas = pedidosMes.reduce(
        (soma, p: any) => soma + Number(p.totalDescontado || 0),
        0
      )
      const pedidos = pedidosMes.length

      receitasUltimos6Meses.push({
        month: nomesMeses[mes],
        pedidos,
        vendas,
      })
    }

    // === SEMANA ATUAL ===
    const diaSemana = agora.getDay() // 0=domingo
    const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana
    const inicioSemana = toMySQL(new Date(anoAtual, mesAtual, agora.getDate() + diffSegunda))
    const fimSemana = toMySQL(new Date(anoAtual, mesAtual, agora.getDate() + (7 - diaSemana)))

    const pedidosSemana = await pedidoRepository.find({
      where: { status: 6, data: Between(inicioSemana, fimSemana), idVendedor }
    })

    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
    const receitaSemana: { day: string; vendas: number }[] = diasSemana.map((dia) => ({
      day: dia,
      vendas: 0,
    }))

    for (const pedido of pedidosSemana) {
      const dataPedido = new Date(pedido.data)
      const dia = dataPedido.getDay()
      receitaSemana[dia].vendas += Number(pedido.totalDescontado || 0)
    }

    // === CÁLCULOS GERAIS ===
    const receitaAtual = pedidosAtual.reduce(
      (soma, p: any) => soma + Number(p.totalDescontado || 0),
      0
    )
    const receitaPassada = pedidosPassado.reduce(
      (soma, p: any) => soma + Number(p.totalDescontado || 0),
      0
    )

    const qtdAtual = pedidosAtual.length
    const qtdPassada = pedidosPassado.length
    const clientesAtual = clientesAtivosAtual.length
    const clientesPassado = clientesAtivosPassado.length
    const ticketAtual = qtdAtual > 0 ? receitaAtual / qtdAtual : 0
    const ticketPassado = qtdPassada > 0 ? receitaPassada / qtdPassada : 0

    const calcPercentual = (atual: number, anterior: number): number => {
      if (anterior === 0 && atual === 0) return 0
      if (anterior === 0) return 100
      return Number((((atual - anterior) / anterior) * 100).toFixed(2))
    }

    const comparativo: ReceitaComparativoInterface = {
      percentualReceita: calcPercentual(receitaAtual, receitaPassada),
      percentualPedidos: calcPercentual(qtdAtual, qtdPassada),
      percentualTicket: calcPercentual(ticketAtual, ticketPassado),
      percentualClientes: calcPercentual(clientesAtual, clientesPassado),
    }

    const retorno: ReceitasInterface = {
      receitaAtual,
      qtdAtual,
      ticketAtual,
      clientesAtual,
      receitasUltimos6Meses,
      receitaSemana,
      receitaComparativo: comparativo,
    }

    return retorno
  }

  @Post("maisVendidos")
  async maisVendidos(@Body("idUsuario") idUsuario?: string) {
    const pedidoRepository = AppDataSource.getRepository(Pedido)
    const detalhePedidoRepository = AppDataSource.getRepository(DetalhePedido)
    const produtoRepository = AppDataSource.getRepository(Produto)
    let pedidosAtual: Pedido[]

    if (idUsuario === undefined) {
      pedidosAtual = await pedidoRepository.find({
        where: { status: 6 }
      })

    } else {

      const idVendedor = idUsuario
      pedidosAtual = await pedidoRepository.find({
        where: { status: 6, idVendedor }
      })
    }

    const detalhesAtual = await detalhePedidoRepository.find({
      where: { idPedido: In(pedidosAtual.map(p => p.id)) }
    })

    // === Cálculos ===
    const produtosMaisVendidos: { idProduto: string; quantidade: number }[] = []
    for (const detalhe of detalhesAtual) {
      const produto = produtosMaisVendidos.find(p => p.idProduto === detalhe.idProduto)
      if (produto) {
        produto.quantidade += detalhe.quantidade
      } else {
        produtosMaisVendidos.push({ idProduto: detalhe.idProduto, quantidade: detalhe.quantidade })
      }
    }

    const produtos = await produtoRepository.find({
      where: { id: In(produtosMaisVendidos.map(p => p.idProduto)) }
    })

    produtos.map(p => {
      const produtoMaisVendido = produtosMaisVendidos.find(pmv => pmv.idProduto === p.id)
      if (produtoMaisVendido) {
        p.maisVendido = produtoMaisVendido.quantidade
      }
    })

    produtoRepository.save(produtos)
  }
}
