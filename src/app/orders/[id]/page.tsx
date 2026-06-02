"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, Clock, ChefHat, Bike, Package, ArrowLeft } from "lucide-react"
import { OrderType } from "@/types"

const statusFlow = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"]

const statusInfo: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: "Aguardando confirmação", icon: Clock, color: "text-yellow-500" },
  confirmed: { label: "Pedido confirmado", icon: CheckCircle, color: "text-blue-500" },
  preparing: { label: "Preparando", icon: ChefHat, color: "text-orange-500" },
  out_for_delivery: { label: "Saiu para entrega", icon: Bike, color: "text-primary" },
  delivered: { label: "Entregue", icon: Package, color: "text-success" },
  cancelled: { label: "Cancelado", icon: Package, color: "text-danger" },
}

export default function OrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((orders) => {
        const found = orders.find((o: OrderType) => o.id === id)
        setOrder(found || null)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!order || order.status === "delivered" || order.status === "cancelled") return

    const interval = setInterval(async () => {
      const res = await fetch("/api/orders")
      const orders = await res.json()
      const updated = orders.find((o: OrderType) => o.id === id)
      if (updated) setOrder(updated)
    }, 5000)

    return () => clearInterval(interval)
  }, [order, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Pedido não encontrado</p>
        <button onClick={() => router.push("/")} className="text-primary mt-4 hover:underline">
          Voltar ao início
        </button>
      </div>
    )
  }

  const currentStep = statusFlow.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Pedido #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
          {order.status !== "cancelled" && (
            <span className={`text-lg font-bold ${statusInfo[order.status]?.color || "text-gray-500"}`}>
              {statusInfo[order.status]?.label}
            </span>
          )}
        </div>

        {order.status !== "cancelled" ? (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-0">
              {statusFlow.map((status, index) => {
                const info = statusInfo[status]
                const Icon = info.icon
                const isActive = index <= currentStep
                const isCurrent = index === currentStep

                return (
                  <div key={status} className="flex items-start gap-4 pb-6 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        isActive
                          ? isCurrent
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-success text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <p
                        className={`font-medium ${
                          isActive ? "text-secondary" : "text-gray-400"
                        }`}
                      >
                        {info.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-danger font-bold text-lg">Pedido cancelado</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Itens do Pedido</h2>
        <div className="space-y-2">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.product?.name}
              </span>
              <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Frete</span>
            <span>R$ {order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total</span>
            <span className="text-primary">R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Detalhes da Entrega</h2>
        <p className="text-gray-600">
          <strong>Endereço:</strong> {order.address}
        </p>
        <p className="text-gray-600">
          <strong>Pagamento:</strong>{" "}
          {order.paymentMethod === "cash"
            ? "Dinheiro"
            : order.paymentMethod === "credit"
            ? "Cartão de Crédito"
            : order.paymentMethod === "debit"
            ? "Cartão de Débito"
            : "Pix"}
        </p>
        {order.notes && (
          <p className="text-gray-600">
            <strong>Observações:</strong> {order.notes}
          </p>
        )}
      </div>
    </div>
  )
}
