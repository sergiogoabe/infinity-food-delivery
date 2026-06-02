"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, EyeOff, Eye } from "lucide-react"
import toast from "react-hot-toast"
import { useCartStore } from "@/lib/store"

export default function MenuPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Prato Principal" })

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [authStatus, router])

  async function loadData() {
    try {
      const storesRes = await fetch("/api/stores")
      const stores = await storesRes.json()
      const myStore = stores.find((s: any) => s.ownerId === user?.id)
      setStore(myStore)
      if (myStore) {
        const prodsRes = await fetch(`/api/products?storeId=${myStore.id}`)
        setProducts(await prodsRes.json())
      }
    } catch {}
  }

  useEffect(() => {
    if (user?.id) loadData()
  }, [user?.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!store) return

    try {
      const method = editingId ? "PATCH" : "POST"
      const url = editingId ? `/api/products` : `/api/products`
      const body = {
        ...form,
        price: parseFloat(form.price),
        storeId: store.id,
        productId: editingId,
      }

      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(editingId ? "Produto atualizado!" : "Produto adicionado!")
        setForm({ name: "", description: "", price: "", category: "Prato Principal" })
        setShowForm(false)
        setEditingId(null)
        loadData()
      } else {
        toast.error("Erro ao salvar")
      }
    } catch {
      toast.error("Erro ao salvar")
    }
  }

  async function toggleAvailability(productId: string, current: boolean) {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, isAvailable: !current }),
    })
    if (res.ok) {
      toast.success("Status alterado!")
      loadData()
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Cardápio</h1>
          {store && <p className="text-gray-500 text-sm">{store.name}</p>}
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setForm({ name: "", description: "", price: "", category: "Prato Principal" })
            setShowForm(!showForm)
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Produto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-white"
            >
              {["Prato Principal", "Bebidas", "Sobremesas", "Entradas", "Porções", "Lanches", "Outros"].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              {editingId ? "Atualizar" : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              className="border-2 border-gray-300 text-gray-600 px-6 py-2 rounded-lg font-semibold hover:border-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Nenhum produto cadastrado</p>
          <p className="text-sm">Adicione produtos ao seu cardápio</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl border p-4 flex items-center justify-between ${
                product.isAvailable ? "border-gray-200" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-secondary">{product.name}</h3>
                  {!product.isAvailable && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Indisponível</span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAvailability(product.id, product.isAvailable)}
                  className="p-2 text-gray-400 hover:text-secondary transition-colors"
                  title={product.isAvailable ? "Desabilitar" : "Habilitar"}
                >
                  {product.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditingId(product.id)
                    setForm({
                      name: product.name,
                      description: product.description || "",
                      price: product.price.toString(),
                      category: product.category || "Outros",
                    })
                    setShowForm(true)
                  }}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Remover produto?")) return
                    const res = await fetch("/api/products", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ productId: product.id }),
                    })
                    if (res.ok) {
                      toast.success("Produto removido")
                      loadData()
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-danger transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
