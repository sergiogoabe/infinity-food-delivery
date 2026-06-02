"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function SettingsPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [store, setStore] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    deliveryFee: "5",
    freeDeliveryMin: "",
    category: "all",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/login")
  }, [authStatus, router])

  useEffect(() => {
    if (!user?.id) return
    fetch("/api/stores")
      .then((r) => r.json())
      .then((stores) => {
        const myStore = stores.find((s: any) => s.ownerId === user.id)
        if (myStore) {
          setStore(myStore)
          setForm({
            name: myStore.name || "",
            address: myStore.address || "",
            phone: myStore.phone || "",
            latitude: myStore.latitude?.toString() || "",
            longitude: myStore.longitude?.toString() || "",
            deliveryFee: myStore.deliveryFee?.toString() || "5",
            freeDeliveryMin: myStore.freeDeliveryMin?.toString() || "",
            category: myStore.category || "all",
          })
        }
      })
  }, [user?.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deliveryFee: parseFloat(form.deliveryFee),
          freeDeliveryMin: form.freeDeliveryMin ? parseFloat(form.freeDeliveryMin) : null,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      })

      if (res.ok) {
        toast.success("Configurações salvas!")
      } else {
        toast.error("Erro ao salvar")
      }
    } catch {
      toast.error("Erro ao salvar")
    } finally {
      setLoading(false)
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">Configurações da Loja</h1>

      {!store ? (
        <div className="text-center py-20 text-gray-400">
          <p>Você ainda não tem uma loja cadastrada.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                placeholder="-20.1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                placeholder="-44.1234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Coordenadas necessárias para calcular o frete. Use Google Maps para encontrar as coordenadas da sua loja.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Entrega (R$)</label>
              <input
                type="number"
                step="0.5"
                value={form.deliveryFee}
                onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frete Grátis (R$)</label>
              <input
                type="number"
                step="1"
                value={form.freeDeliveryMin}
                onChange={(e) => setForm({ ...form, freeDeliveryMin: e.target.value })}
                placeholder="Valor mínimo p/ frete grátis"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-white"
            >
              {[
                { value: "all", label: "Todos" },
                { value: "brasileira", label: "Brasileira" },
                { value: "italiana", label: "Italiana" },
                { value: "japonesa", label: "Japonesa" },
                { value: "mexicana", label: "Mexicana" },
                { value: "lanches", label: "Lanches" },
                { value: "pizzas", label: "Pizzas" },
                { value: "saudavel", label: "Saudável" },
                { value: "doces", label: "Doces & Sobremesas" },
                { value: "bebidas", label: "Bebidas" },
              ].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Configurações"}
          </button>
        </form>
      )}
    </div>
  )
}
