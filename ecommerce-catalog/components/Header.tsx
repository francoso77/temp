"use client"

import { Bell } from "lucide-react"
import { useNotification } from "@/contexts/NotificationContext"
import { useRef, useEffect } from "react"
import { NotificationCenter } from "@/components/NotificationCenter"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { CartDrawer } from "./CartDrawer"

export function Header() {
  const { user, isAuthenticated, isVendedor, logout } = useAuth()
  const { itemCount } = useCart()
  const { notifications } = useNotification()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const notifBtnRef = useRef<HTMLButtonElement>(null)

  // Fecha o popover de notificações ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifBtnRef.current && !notifBtnRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifications])

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              Catálogo
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Produtos
              </Link>
              {isAuthenticated && !isVendedor && (
                <Link href="/meus-pedidos" className="text-foreground hover:text-primary transition-colors">
                  Meus Pedidos
                </Link>
              )}
              {isVendedor && (
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && (
                <div className="relative">
                  <Button ref={notifBtnRef} variant="ghost" size="sm" onClick={() => setShowNotifications((v) => !v)} className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {notifications.filter((n) => !n.read).length}
                      </Badge>
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 z-50">
                      <NotificationCenter />
                    </div>
                  )}
                </div>
              )}
              {!isVendedor && (
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Olá, {user?.nome}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Produtos
                </Link>
                {isAuthenticated && !isVendedor && (
                  <Link
                    href="/meus-pedidos"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Pedidos
                  </Link>
                )}
                {isVendedor && (
                  <Link
                    href="/dashboard"
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {!isVendedor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCartOpen(true)
                        setIsMenuOpen(false)
                      }}
                      className="relative"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Carrinho
                      {itemCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {itemCount}
                        </Badge>
                      )}
                    </Button>
                  )}

                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{user?.nome}</span>
                      <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Entrar
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
