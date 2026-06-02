"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MapPin, Phone, Plus, ShoppingCart, Minus, Star } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { StoreType, ProductType } from "@/types"
import toast from "react-hot-toast"

export default function StorePage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const { items, addItem, updateQuantity, getItemCount } = useCartStore()

  const [store, setStore] = useState<StoreType | null>(null)
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/stores`).then((r) => r.json()),
      fetch(`/api/products?storeId=${id}`).then((r) => r.json()),
    ]).then(([stores, prods]) => {
      setStore(stores.find((s: any) => s.id === id) || null)
      setProducts(prods)
      setLoading(false)
    })
  }, [id])

  const groupedProducts = products.reduce<Record<string, ProductType[]>>((acc, p) => {
    const cat = p.category || "Outros"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  function getQuantity(productId: string) {
    return items.find((i) => i.id === productId)?.quantity || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Loja não encontrada</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-48 md:h-64 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary">{store.name}</h1>
          <div className="flex items-center justify-center gap-4 mt-2 text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {store.address}
            </span>
            {store.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {store.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {Object.entries(groupedProducts).map(([category, prods]) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl font-bold text-secondary mb-4 capitalize">{category}</h2>
            <div className="space-y-3">
              {prods.map((product) => {
                const qty = getQuantity(product.id)
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                      )}
                      <p className="text-primary font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <div className="ml-4">
                      {qty === 0 ? (
                        <button
                          onClick={() => {
                            if (!session) {
                              toast.error("Faça login para adicionar itens")
                              router.push("/auth/login")
                              return
                            }
                            addItem({ ...product, quantity: 1, storeId: store.id })
                            toast.success("Adicionado ao carrinho")
                          }}
                          className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="p-1.5 text-primary hover:bg-orange-100 rounded-md transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-primary min-w-[20px] text-center">{qty}</span>
                          <button
                            onClick={() => addItem({ ...product, quantity: 1, storeId: store.id })}
                            className="p-1.5 text-primary hover:bg-orange-100 rounded-md transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {getItemCount() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">{getItemCount()} itens</span>
                <span className="text-xl font-bold text-secondary ml-4">
                  R$ {items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => router.push("/cart")}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ver Carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
