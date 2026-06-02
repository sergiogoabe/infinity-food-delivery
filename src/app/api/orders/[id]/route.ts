import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { status } = body

    const db = await getDb()
    const order = await db.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const role = (session.user as any).role
    const storeId = (session.user as any).storeId
    if (role !== "admin" && order.storeId !== storeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await db.order.update({
      where: { id },
      data: { status },
      include: { items: true, store: true, user: true },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
