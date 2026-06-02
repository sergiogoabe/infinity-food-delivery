"use client"

import { useCartStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-secondary mb-2">Carrinho vazio</h2>
        <p className="text-gray-500 mb-6">Adicione itens de alguma loja para começar</p>
        <button
          onClick={() => router.push("/stores")}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Ver Lojas
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <h1 className="text-2xl font-bold text-secondary mb-6">Carrinho</h1>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-secondary">{item.name}</h3>
              <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)} cada</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 text-primary hover:bg-orange-100 rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-primary min-w-[20px] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 text-primary hover:bg-orange-100 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="font-bold text-secondary min-w-[80px] text-right">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-danger transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between text-lg mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">R$ {getTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg mb-4">
          <span className="text-gray-600">Frete</span>
          <span className="font-semibold">Calculado no checkout</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between text-xl">
          <span className="font-bold text-secondary">Total</span>
          <span className="font-bold text-primary">R$ {getTotal().toFixed(2)}</span>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={clearCart}
            className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:border-danger hover:text-danger transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
