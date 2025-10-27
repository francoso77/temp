# Catálogo de Produtos - Aplicação E-commerce

## 📋 Visão Geral

Esta é uma aplicação completa de catálogo de produtos desenvolvida em React + TypeScript com Material UI, projetada para facilitar a venda de produtos através de solicitações de orçamento.

## 🎯 Características Principais

### ✅ **SEM PREÇOS VISÍVEIS**
- Os produtos são exibidos **sem preços** para os clientes
- Foco em **descontos e promoções** como destaque
- Sistema de **solicitação de orçamento** via WhatsApp e E-mail

### 👥 **Dois Tipos de Usuário**

#### 🛒 **CLIENTES**
- **Login rápido**: Apenas nome e e-mail
- **Navegação de produtos**: Catálogo completo sem preços
- **Carrinho de compras**: Lista de produtos desejados
- **Solicitação de orçamento**: Via WhatsApp, E-mail ou sistema interno
- **Sem acesso**: Dashboard administrativo

#### 👨‍💼 **VENDEDORES/REPRESENTANTES**
- **Login seguro**: E-mail e senha
- **Dashboard completo**: Métricas, gráficos e relatórios
- **Gestão de produtos**: Criar, editar e excluir produtos
- **Gestão de clientes**: Visualizar e gerenciar clientes
- **Sem carrinho**: Não podem adicionar produtos ao carrinho

## 🏗️ Arquitetura da Aplicação

### 📱 **Interface do Cliente** (`/`)
\`\`\`
┌─────────────────────────────────────┐
│ 🏠 Página Principal                 │
│ ├── Catálogo de produtos           │
│ ├── Filtros por categoria          │
│ ├── Carrinho de compras            │
│ └── Login rápido (nome + e-mail)   │
└─────────────────────────────────────┘
\`\`\`

### 💼 **Interface do Vendedor** (`/dashboard`)
\`\`\`
┌─────────────────────────────────────┐
│ 📊 Dashboard Administrativo         │
│ ├── Métricas e gráficos            │
│ ├── Gestão de produtos             │
│ ├── Gestão de clientes             │
│ └── Login seguro (e-mail + senha)  │
└─────────────────────────────────────┘
\`\`\`

## 🔄 Fluxo de Trabalho

### Para Clientes:
1. **Navegar** produtos sem ver preços
2. **Adicionar** produtos ao carrinho
3. **Solicitar orçamento** via WhatsApp/E-mail
4. **Receber** proposta personalizada do vendedor

### Para Vendedores:
1. **Gerenciar** catálogo de produtos
2. **Receber** solicitações de orçamento
3. **Enviar** propostas personalizadas
4. **Acompanhar** métricas de vendas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: Next.js App Router
- **Estado**: Context API (Auth + Cart)
- **Gráficos**: Recharts
- **Integração**: WhatsApp Web API + E-mail

## 🚀 Funcionalidades Implementadas

### ✅ Concluído
- [x] Sistema de autenticação duplo (Cliente/Vendedor)
- [x] Catálogo de produtos sem preços
- [x] Carrinho de compras para clientes
- [x] Dashboard administrativo para vendedores
- [x] Gestão completa de produtos
- [x] Solicitação de orçamento via WhatsApp/E-mail
- [x] Design responsivo e moderno
- [x] Destaques para promoções e descontos

### 🔄 Próximos Passos
- [ ] Integração com backend real
- [ ] Sistema de notificações
- [ ] Relatórios avançados
- [ ] Upload de imagens
- [ ] Sistema de categorias dinâmico

## 📞 Como Funciona o Orçamento

1. **Cliente** adiciona produtos ao carrinho
2. **Sistema** gera lista sem preços
3. **Cliente** envia via WhatsApp ou E-mail
4. **Vendedor** recebe solicitação
5. **Vendedor** responde com orçamento personalizado

## 🎨 Design System

- **Cores principais**: Azul e cinza
- **Tipografia**: Fonte system (Geist)
- **Componentes**: shadcn/ui
- **Responsividade**: Mobile-first
- **Acessibilidade**: WCAG 2.1 AA

---

**Desenvolvido para facilitar vendas B2B e B2C através de solicitações de orçamento personalizadas.**
