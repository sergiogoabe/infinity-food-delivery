"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/lib/store"
import { MapPin, Bike } from "lucide-react"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotal, clearCart, storeId } = useCartStore()

  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [deliveryDistance, setDeliveryDistance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [calcLoading, setCalcLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/auth/login")
    }
  }, [session, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  async function calculateDelivery() {
    if (!address) {
      toast.error("Informe o endereço de entrega")
      return
    }
    setCalcLoading(true)

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Divinópolis, MG")}&limit=1`
      )
      const geoData = await geoRes.json()

      if (!geoData.length) {
        toast.error("Endereço não encontrado. Use um mais específico.")
        return
      }

      const destLat = geoData[0].lat
      const destLng = geoData[0].lon

      const storeRes = await fetch("/api/stores")
      const stores = await storeRes.json()
      const store = stores.find((s: any) => s.id === storeId)

      if (!store?.latitude || !store?.longitude) {
        setDeliveryFee(5)
        setDeliveryDistance(0)
        return
      }

      const distRes = await fetch(
        `/api/distance?originLat=${store.latitude}&originLng=${store.longitude}&destLat=${destLat}&destLng=${destLng}`
      )
      const distData = await distRes.json()

      if (distData.fee) {
        setDeliveryFee(distData.fee)
        setDeliveryDistance(distData.distance)
      } else {
        setDeliveryFee(5)
      }
    } catch {
      setDeliveryFee(5)
    } finally {
      setCalcLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address) {
      toast.error("Informe o endereço de entrega")
      return
    }
    setLoading(true)

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Divinópolis, MG")}&limit=1`
      )
      const geoData = await geoRes.json()
      const latitude = geoData.length ? parseFloat(geoData[0].lat) : null
      const longitude = geoData.length ? parseFloat(geoData[0].lon) : null

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          address,
          latitude,
          longitude,
          paymentMethod,
          notes,
          deliveryFee,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || "Erro ao criar pedido")
        return
      }

      const order = await res.json()
      clearCart()
      toast.success("Pedido realizado com sucesso!")
      router.push(`/orders/${order.id}`)
    } catch {
      toast.error("Erro ao criar pedido")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = getTotal()
  const total = subtotal + deliveryFee

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Endereço de Entrega
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro - Divinópolis"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              required
            />
            <button
              type="button"
              onClick={calculateDelivery}
              disabled={calcLoading}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Bike className="w-5 h-5" />
              {calcLoading ? "..." : "Calcular Frete"}
            </button>
          </div>

          {deliveryFee > 0 && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-center justify-between">
              <span className="text-gray-600">Distância: {deliveryDistance > 0 ? `${deliveryDistance} km` : "calculada"}</span>
              <span className="font-bold text-primary">Frete: R$ {deliveryFee.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Forma de Pagamento</h2>
          <div className="space-y-2">
            {[
              { value: "cash", label: "Dinheiro" },
              { value: "credit", label: "Cartão de Crédito" },
              { value: "debit", label: "Cartão de Débito" },
              { value: "pix", label: "Pix" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === opt.value
                    ? "border-primary bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Observações</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alguma observação para o restaurante?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none h-20"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Resumo</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frete</span>
              <span className="font-medium">R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !deliveryFee}
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Finalizando..." : `Finalizar Pedido - R$ ${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  )
}
