"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, BarChart3, DollarSign, PieChart, TrendingUp } from "lucide-react"

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-2xl font-bold">FinanceControl</span>
          </div>
          <div>
            <Button asChild variant="outline" className="mr-2">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gerencie suas finanças com simplicidade e eficiência</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            FinanceControl é uma plataforma completa para controle financeiro pessoal e empresarial. Acompanhe receitas,
            despesas e investimentos em um só lugar.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/cadastro">
              Começar agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Relatórios Detalhados</CardTitle>
              <CardDescription>
                Visualize seus dados financeiros com gráficos interativos e relatórios personalizados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Acompanhe a evolução do seu patrimônio, identifique padrões de gastos e tome decisões baseadas em dados.
                Nossos relatórios são atualizados em tempo real.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
              <CardTitle>Controle de Transações</CardTitle>
              <CardDescription>
                Registre e categorize todas as suas transações financeiras em um só lugar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Adicione receitas e despesas facilmente, organize por categorias e empresas, e mantenha um histórico
                completo de todas as suas movimentações financeiras.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle>Gestão de Categorias</CardTitle>
              <CardDescription>
                Organize suas finanças com categorias personalizadas para melhor controle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Crie e gerencie categorias para classificar suas transações. Visualize a distribuição de gastos e
                receitas por categoria com gráficos intuitivos.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-6">
            Experimente o FinanceControl hoje mesmo e transforme a maneira como você gerencia suas finanças.
          </p>
          <Button asChild size="lg">
            <Link href="/cadastro">Criar uma conta gratuita</Link>
          </Button>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} FinanceControl. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
