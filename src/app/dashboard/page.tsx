"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, Package, ClipboardList, Settings, TrendingUp, ShoppingBag } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((orders) => {
        setStats({
          total: orders.length,
          pending: orders.filter((o: any) => o.status === "pending" || o.status === "confirmed").length,
          revenue: orders.reduce((sum: number, o: any) => sum + o.total, 0),
        })
      })
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user?.role !== "owner" && user?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Acesso restrito a lojistas</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Painel do Lojista</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.total}</p>
          <p className="text-sm text-gray-500">Total de Pedidos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <ClipboardList className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pendentes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
          <p className="text-3xl font-bold text-secondary">R$ {stats.revenue.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Receita Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.total}</p>
          <p className="text-sm text-gray-500">Itens Vendidos</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/orders"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Pedidos</h3>
            <p className="text-sm text-gray-500">Gerencie os pedidos em tempo real</p>
          </div>
        </Link>

        <Link
          href="/dashboard/menu"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
            <Package className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Cardápio</h3>
            <p className="text-sm text-gray-500">Gerencie seus produtos e preços</p>
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
            <Settings className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Configurações</h3>
            <p className="text-sm text-gray-500">Configure sua loja e horários</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
