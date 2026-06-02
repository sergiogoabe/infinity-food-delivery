import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

let jsonDb: any = null
const DB_PATH = join(process.cwd(), "data.json")

function getJsonDb(): any {
  if (jsonDb) return jsonDb
  try {
    if (existsSync(DB_PATH)) {
      jsonDb = JSON.parse(readFileSync(DB_PATH, "utf-8"))
    } else {
      jsonDb = { users: [], stores: [], products: [], orders: [], orderItems: [], reviews: [] }
      writeFileSync(DB_PATH, JSON.stringify(jsonDb, null, 2))
    }
    return jsonDb
  } catch {
    return null
  }
}

function saveJsonDb() {
  try {
    writeFileSync(DB_PATH, JSON.stringify(jsonDb, null, 2))
  } catch {}
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

let prismaClient: any = null

async function getPrismaClient() {
  if (prismaClient) return prismaClient
  try {
    const { PrismaClient } = await import("@prisma/client")
    prismaClient = new PrismaClient()
    await prismaClient.$connect()
    return prismaClient
  } catch {
    return null
  }
}

const jsonAdapter = {
  user: {
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      const db = getJsonDb()
      if (!db) return null
      return clone(db.users.find((u: any) => (where.id && u.id === where.id) || (where.email && u.email === where.email)) || null)
    },
    async create({ data }: { data: any }) {
      const db = getJsonDb()
      const user = { id: uid(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.users.push(user)
      saveJsonDb()
      return clone(user)
    },
  },
  store: {
    async findMany(opts: any = {}) {
      const db = getJsonDb()
      if (!db) return []
      let stores = clone(db.stores)
      if (opts.where) {
        if (opts.where.isActive !== undefined) stores = stores.filter((s: any) => s.isActive === opts.where.isActive)
        if (opts.where.ownerId) stores = stores.filter((s: any) => s.ownerId === opts.where.ownerId)
      }
      if (opts.include) {
        stores = stores.map((s: any) => {
          const r: any = { ...s }
          if (opts.include.products) r.products = db.products.filter((p: any) => p.storeId === s.id && p.isAvailable).slice(0, 3)
          if (opts.include._count) r._count = { products: db.products.filter((p: any) => p.storeId === s.id).length }
          if (opts.include.reviews) r.reviews = db.reviews.filter((r: any) => r.storeId === s.id) || []
          return r
        })
      }
      return stores
    },
    async findUnique({ where, include }: { where: { id?: string; ownerId?: string }; include?: any }) {
      const db = getJsonDb()
      if (!db) return null
      const store = clone(db.stores.find((s: any) => (where.id && s.id === where.id) || (where.ownerId && s.ownerId === where.ownerId)))
      if (!store) return null
      if (include) {
        if (include.products) store.products = db.products.filter((p: any) => p.storeId === store.id)
        if (include.reviews) store.reviews = db.reviews.filter((r: any) => r.storeId === store.id) || []
      }
      return store
    },
    async create({ data }: { data: any }) {
      const db = getJsonDb()
      const store = { id: uid(), isActive: true, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.stores.push(store)
      saveJsonDb()
      return clone(store)
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const db = getJsonDb()
      const idx = db.stores.findIndex((s: any) => s.id === where.id)
      if (idx === -1) return null
      db.stores[idx] = { ...db.stores[idx], ...data, updatedAt: new Date().toISOString() }
      saveJsonDb()
      return clone(db.stores[idx])
    },
  },
  product: {
    async findMany({ where }: { where?: any } = {}) {
      const db = getJsonDb()
      if (!db) return []
      let products = clone(db.products)
      if (where) {
        if (where.storeId) products = products.filter((p: any) => p.storeId === where.storeId)
        if (where.isAvailable !== undefined) products = products.filter((p: any) => p.isAvailable === where.isAvailable)
        if (where.id?.in) products = products.filter((p: any) => where.id.in.includes(p.id))
      }
      return products
    },
    async create({ data }: { data: any }) {
      const db = getJsonDb()
      const product = { id: uid(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      db.products.push(product)
      saveJsonDb()
      return clone(product)
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const db = getJsonDb()
      const idx = db.products.findIndex((p: any) => p.id === where.id)
      if (idx === -1) return null
      db.products[idx] = { ...db.products[idx], ...data, updatedAt: new Date().toISOString() }
      saveJsonDb()
      return clone(db.products[idx])
    },
    async delete({ where }: { where: { id: string } }) {
      const db = getJsonDb()
      db.products = db.products.filter((p: any) => p.id !== where.id)
      saveJsonDb()
      return { id: where.id }
    },
  },
  order: {
    async findMany({ where, include, take }: { where?: any; include?: any; take?: number } = {}) {
      const db = getJsonDb()
      if (!db) return []
      let orders = clone(db.orders)
      if (where) {
        if (where.storeId) orders = orders.filter((o: any) => o.storeId === where.storeId)
        if (where.userId) orders = orders.filter((o: any) => o.userId === where.userId)
      }
      orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      if (take) orders = orders.slice(0, take)
      if (include) {
        orders = orders.map((o: any) => {
          const r: any = { ...o }
          if (include.items) {
            r.items = (db.orderItems.filter((i: any) => i.orderId === o.id) || []).map((i: any) => ({
              ...i,
              product: db.products.find((p: any) => p.id === i.productId),
            }))
          }
          if (include.store) r.store = db.stores.find((s: any) => s.id === o.storeId) || null
          if (include.user) r.user = db.users.find((u: any) => u.id === o.userId) || null
          return r
        })
      }
      return orders
    },
    async findUnique({ where, include }: { where: { id: string }; include?: any }) {
      const db = getJsonDb()
      if (!db) return null
      const order = clone(db.orders.find((o: any) => o.id === where.id))
      if (!order) return null
      if (include) {
        if (include.items) {
          order.items = (db.orderItems.filter((i: any) => i.orderId === order.id) || []).map((i: any) => ({
            ...i,
            product: db.products.find((p: any) => p.id === i.productId),
          }))
        }
        if (include.store) order.store = db.stores.find((s: any) => s.id === order.storeId) || null
        if (include.user) order.user = db.users.find((u: any) => u.id === order.userId) || null
      }
      return order
    },
    async create({ data }: { data: any }) {
      const db = getJsonDb()
      const items = data.items || []
      delete data.items
      const order = {
        id: uid(),
        ...data,
        status: data.status || "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.orders.push(order)
      items.forEach((item: any) => {
        db.orderItems.push({
          id: uid(),
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })
      })
      saveJsonDb()
      return clone({ ...order, items })
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const db = getJsonDb()
      const idx = db.orders.findIndex((o: any) => o.id === where.id)
      if (idx === -1) return null
      db.orders[idx] = { ...db.orders[idx], ...data, updatedAt: new Date().toISOString() }
      saveJsonDb()
      const result = clone(db.orders[idx])
      if (include) {
        if (include.items) {
          result.items = (db.orderItems.filter((i: any) => i.orderId === result.id) || []).map((i: any) => ({
            ...i,
            product: db.products.find((p: any) => p.id === i.productId),
          }))
        }
        if (include.store) result.store = db.stores.find((s: any) => s.id === result.storeId) || null
        if (include.user) result.user = db.users.find((u: any) => u.id === result.userId) || null
      }
      return result
    },
  },
  review: {},
}

export async function getDb(): Promise<any> {
  const usePrisma = process.env.VERCEL || process.env.USE_PRISMA === "true"
  if (usePrisma) {
    const prisma = await getPrismaClient()
    if (prisma) return prisma
  }
  return jsonAdapter
}

export async function initPrisma(): Promise<any> {
  try {
    const { PrismaClient } = await import("@prisma/client")
    const prisma = new PrismaClient()
    await prisma.$connect()
    return prisma
  } catch {
    return null
  }
}
