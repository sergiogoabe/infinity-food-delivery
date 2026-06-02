"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Bike, ChefHat, Clock, Eye } from "lucide-react"
import toast from "react-hot-toast"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: { id: string; name: string }
}

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  deliveryFee: number
  address: string
  paymentMethod: string
  notes: string | null
  createdAt: string
  user: { id: string; name: string | null; phone: string | null }
  items: OrderItem[]
}

export default function DashboardOrdersPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [authStatus, router])

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) setOrders(await res.json())
    } catch {}
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  async function updateStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success("Status atualizado!")
        loadOrders()
      }
    } catch {
      toast.error("Erro ao atualizar")
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user?.role !== "owner" && user?.role !== "admin") {
    return <div className="text-center py-20 text-gray-400">Acesso restrito</div>
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      preparing: "bg-orange-100 text-orange-700 border-orange-200",
      out_for_delivery: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    out_for_delivery: "Saiu para entrega",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">Pedidos</h1>
        <button onClick={loadOrders} className="text-sm text-primary hover:underline">
          Atualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Nenhum pedido ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <span className="text-xl font-bold text-primary">
                  R$ {order.total.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cliente</p>
                    <p className="font-medium">{order.user.name || "Anônimo"}</p>
                    {order.user.phone && (
                      <p className="text-sm text-gray-500">{order.user.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Entrega</p>
                    <p className="font-medium">{order.address}</p>
                    <p className="text-sm text-gray-500">
                      {order.paymentMethod === "cash"
                        ? "Dinheiro"
                        : order.paymentMethod === "credit"
                        ? "Cartão de Crédito"
                        : order.paymentMethod === "debit"
                        ? "Cartão de Débito"
                        : "Pix"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Itens</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(order.id, "confirmed")}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Cancelar
                      </button>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-1"
                    >
                      <ChefHat className="w-4 h-4" /> Iniciar Preparo
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(order.id, "out_for_delivery")}
                      className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-1"
                    >
                      <Bike className="w-4 h-4" /> Sair para Entrega
                    </button>
                  )}
                  {order.status === "out_for_delivery" && (
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmar Entrega
                    </button>
                  )}
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
                  <strong>Obs:</strong> {order.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
