export interface StoreType {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  image: string | null
  coverImage: string | null
  category: string
  isActive: boolean
  deliveryFee: number
  freeDeliveryMin: number | null
  ownerId: string
}

export interface ProductType {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category: string | null
  isAvailable: boolean
  storeId: string
}

export interface OrderType {
  id: string
  status: string
  total: number
  deliveryFee: number
  subtotal: number
  address: string
  paymentMethod: string
  notes: string | null
  createdAt: string
  userId: string
  storeId: string
  items: OrderItemType[]
  store?: StoreType
}

export interface OrderItemType {
  id: string
  quantity: number
  price: number
  productId: string
  product?: ProductType
}

export interface CartItem extends ProductType {
  quantity: number
  storeId: string
}
