"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Store, User, LogOut, Menu, X } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const [menuOpen, setMenuOpen] = useState(false)

  const user = session?.user as any

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Infinity</span>
          <span className="text-2xl font-semibold text-secondary">Food</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/stores" className="text-gray-600 hover:text-primary transition-colors font-medium">
            Lojas
          </Link>
          <Link href="/agency" className="text-gray-600 hover:text-primary transition-colors font-medium">
            Infinity Agency
          </Link>

          {session ? (
            <>
              <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {(user?.role === "owner" || user?.role === "admin") && (
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-1">
                  <Store className="w-4 h-4" />
                  Painel
                </Link>
              )}

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user?.name}</span>
                <button onClick={() => signOut()} className="text-gray-400 hover:text-danger transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Entrar
            </Link>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href="/stores" className="block text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
            Lojas
          </Link>
          <Link href="/agency" className="block text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
            Infinity Agency
          </Link>
          {session ? (
            <>
              {(user?.role === "owner" || user?.role === "admin") && (
                <Link href="/dashboard" className="block text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Painel do Lojista
                </Link>
              )}
              <button onClick={() => signOut()} className="block text-danger font-medium">
                Sair
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="block bg-primary text-white text-center py-2 rounded-lg font-medium" onClick={() => setMenuOpen(false)}>
              Entrar
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
