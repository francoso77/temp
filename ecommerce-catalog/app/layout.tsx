import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { NotificationCenter } from "@/components/NotificationCenter"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Catálogo de Produtos - E-commerce",
  description: "Catálogo de produtos com pedidos online",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
              <NotificationCenter />
            </AuthProvider>
          </NotificationProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
