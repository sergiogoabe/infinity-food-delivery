import { create } from "zustand"
import { CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  storeId: string | null
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  storeId: null,

  addItem: (item) => {
    const state = get()
    if (state.storeId && state.storeId !== item.storeId) {
      return
    }
    const existing = state.items.find((i) => i.id === item.id)
    if (existing) {
      set({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })
    } else {
      set({
        items: [...state.items, { ...item, quantity: 1 }],
        storeId: item.storeId,
      })
    }
  },

  removeItem: (productId) => {
    const state = get()
    const newItems = state.items.filter((i) => i.id !== productId)
    set({
      items: newItems,
      storeId: newItems.length === 0 ? null : state.storeId,
    })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.id === productId ? { ...i, quantity } : i
      ),
    })
  },

  clearCart: () => set({ items: [], storeId: null }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },
}))
