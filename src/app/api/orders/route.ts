import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { storeId, items, address, latitude, longitude, paymentMethod, notes, deliveryFee } = body

    if (!storeId || !items?.length || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const products = await db.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    })

    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find((p: any) => p.id === item.productId)
      return sum + (product?.price || 0) * item.quantity
    }, 0)

    const total = subtotal + (deliveryFee || 0)

    const createdItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product?.price || 0,
      }
    })

    const order = await db.order.create({
      data: {
        userId: session.user.id,
        storeId,
        subtotal,
        deliveryFee: deliveryFee || 0,
        total,
        address,
        latitude,
        longitude,
        paymentMethod: paymentMethod || "cash",
        notes,
        status: "pending",
        items: createdItems,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const db = await getDb()
    const role = (session.user as any).role
    const storeId = (session.user as any).storeId

    const where: any = {}
    if (role === "owner" && storeId) {
      where.storeId = storeId
    } else if (role === "customer") {
      where.userId = session.user.id
    }

    const orders = await db.order.findMany({
      where,
      include: { items: true, store: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
