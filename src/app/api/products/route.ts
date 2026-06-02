import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

const getSession = auth

export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get("storeId")
  if (!storeId) {
    return NextResponse.json({ error: "storeId required" }, { status: 400 })
  }

  try {
    const db = await getDb()
    const products = await db.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description, price, category, storeId } = await req.json()
    if (!name || !price || !storeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const store = await db.store.findUnique({ where: { id: storeId } })
    if (!store || store.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const product = await db.product.create({
      data: { name, description, price, category, storeId },
    })

    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId, name, description, price, category, isAvailable } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 })
    }

    const db = await getDb()
    const product = await db.product.findUnique({ where: { id: productId } })

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const store = await db.store.findUnique({ where: { id: product.storeId } })
    if (!store || store.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await db.product.update({
      where: { id: productId },
      data: { name, description, price, category, isAvailable },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 })
    }

    const db = await getDb()
    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const store = await db.store.findUnique({ where: { id: product.storeId } })
    if (!store || store.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.product.delete({ where: { id: productId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
