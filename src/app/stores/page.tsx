"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, MapPin, Star } from "lucide-react"
import { StoreType } from "@/types"

export default function StoresPage() {
  const [stores, setStores] = useState<(StoreType & { reviewCount: number; avgRating: number | null })[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then(setStores)
      .finally(() => setLoading(false))
  }, [])

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">Lojas</h1>
        <p className="text-gray-500">Encontre o melhor da culinária em Divinópolis</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar lojas ou categorias..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Nenhuma loja encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {store.image ? (
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary/40">{store.name.charAt(0)}</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">
                  {store.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-orange-100 text-primary px-2 py-1 rounded-full font-medium">
                    {store.category}
                  </span>
                  {store.avgRating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{store.avgRating.toFixed(1)}</span>
                      <span className="text-gray-400">({store.reviewCount})</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
